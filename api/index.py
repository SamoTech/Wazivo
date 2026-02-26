from http.server import BaseHTTPRequestHandler
import json
import re
import os
import subprocess
import sys
import glob

# ──────────────────────────────────────────────────────────────
# Browser install — NO --with-deps (no sudo in Vercel sandbox)
# Store in /tmp which is always writable
# ──────────────────────────────────────────────────────────────
PLAYWRIGHT_DIR  = '/tmp/ms-playwright'
PATCHRIGHT_DIR  = '/tmp/ms-patchright'

def find_chromium() -> str | None:
    patterns = [
        f'{PLAYWRIGHT_DIR}/chromium-*/chrome-linux/chrome',
        f'{PLAYWRIGHT_DIR}/chromium_headless_shell-*/chrome-linux/headless_shell',
        f'{PATCHRIGHT_DIR}/chromium-*/chrome-linux/chrome',
        f'{PATCHRIGHT_DIR}/chromium_headless_shell-*/chrome-linux/headless_shell',
        # also check default home cache in case build-time install landed there
        os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome'),
        os.path.expanduser('~/.cache/ms-patchright/chromium-*/chrome-linux/chrome'),
    ]
    for pattern in patterns:
        for match in glob.glob(pattern):
            if os.path.isfile(match) and os.access(match, os.X_OK):
                return match
    return None


def install_browsers() -> tuple[bool, str]:
    logs = []
    env  = os.environ.copy()
    env['PLAYWRIGHT_BROWSERS_PATH'] = PLAYWRIGHT_DIR
    env['PATCHRIGHT_BROWSERS_PATH'] = PATCHRIGHT_DIR

    # playwright install chromium  (NO --with-deps — avoids sudo)
    try:
        r = subprocess.run(
            [sys.executable, '-m', 'playwright', 'install', 'chromium'],
            capture_output=True, text=True, timeout=180, env=env,
        )
        logs.append(f"playwright install → RC={r.returncode}")
        if r.stdout: logs.append(f"stdout: {r.stdout[-400:]}")
        if r.stderr: logs.append(f"stderr: {r.stderr[-400:]}")
    except Exception as e:
        logs.append(f"playwright install exception: {e}")

    # patchright is shipped inside scrapling — find its __main__ or entry point
    # Try scrapling's bundled patchright first, then fall back to standalone
    patchright_cmd = None
    try:
        import scrapling
        scrapling_dir = os.path.dirname(scrapling.__file__)
        # scrapling vendors patchright under scrapling/engines or similar
        candidate = os.path.join(scrapling_dir, '..', 'patchright')
        if os.path.isdir(candidate):
            patchright_cmd = [sys.executable, '-m', 'patchright', 'install', 'chromium']
    except Exception:
        pass

    if not patchright_cmd:
        # Try as top-level module anyway
        patchright_cmd = [sys.executable, '-m', 'patchright', 'install', 'chromium']

    try:
        r = subprocess.run(
            patchright_cmd,
            capture_output=True, text=True, timeout=180, env=env,
        )
        logs.append(f"patchright install → RC={r.returncode}")
        if r.stdout: logs.append(f"stdout: {r.stdout[-400:]}")
        if r.stderr: logs.append(f"stderr: {r.stderr[-400:]}")
    except Exception as e:
        logs.append(f"patchright install exception: {e}")

    binary  = find_chromium()
    success = binary is not None
    logs.append(f"binary found: {binary}")
    return success, '\n'.join(logs)


# ── Cold-start execution ───────────────────────────────────────
_chrome_binary = find_chromium()
_install_log   = ''

if not _chrome_binary:
    _browsers_ready, _install_log = install_browsers()
    _chrome_binary = find_chromium()
else:
    _browsers_ready = True

# ── Scrapling import ───────────────────────────────────────────
try:
    from scrapling.fetchers import StealthyFetcher, Fetcher
    SCRAPLING_AVAILABLE = True
except ImportError:
    SCRAPLING_AVAILABLE = False

import urllib.request
from urllib.error import HTTPError

STEALTH_DOMAINS = ['linkedin.com', 'glassdoor.com', 'indeed.com', 'ziprecruiter.com', 'monster.com']

def needs_stealth(url: str) -> bool:
    return any(d in url.lower() for d in STEALTH_DOMAINS)

def is_linkedin(url: str) -> bool:
    return 'linkedin.com' in url.lower()


# ──────────────────────────────────────────────────────────────
# Set browser paths so Scrapling/Playwright find the binaries in /tmp
# ──────────────────────────────────────────────────────────────
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', PLAYWRIGHT_DIR)
os.environ.setdefault('PATCHRIGHT_BROWSERS_PATH', PATCHRIGHT_DIR)


# ──────────────────────────────────────────────────────────────
# LinkedIn structured profile extraction
# ──────────────────────────────────────────────────────────────
def extract_linkedin_profile(page) -> str:
    sections = []

    def safe_get(selector, default=''):
        try:
            r = page.css_first(selector)
            return r.get_all_text(strip=True) if r else default
        except Exception:
            return default

    def extract_section(headings, max_items=15):
        for h in headings:
            try:
                raw = page.find_by_text(h, tag='span') or page.find_by_text(h, tag='h2')
                if raw:
                    parent = raw.parent.parent if raw.parent else None
                    if parent:
                        texts = [el.get_all_text(strip=True) for el in parent.css('span[aria-hidden="true"]')]
                        items = [t for t in texts if t and len(t) > 3][:max_items]
                        if items:
                            return items
            except Exception:
                continue
        return []

    name     = safe_get('h1') or safe_get('.text-heading-xlarge')
    headline = safe_get('.text-body-medium.break-words') or safe_get('[data-field="headline"]')
    location = safe_get('.text-body-small.inline.t-black--light.break-words')

    if name:      sections.append(f"NAME: {name}")
    if headline:  sections.append(f"HEADLINE: {headline}")
    if location:  sections.append(f"LOCATION: {location}")

    about = safe_get('.pv-about__summary-text') or safe_get('[data-field="summary"]')
    if about: sections.append(f"\nABOUT:\n{about}")

    for label, headings, inline in [
        ('EXPERIENCE',      ['Experience'],                             False),
        ('EDUCATION',       ['Education'],                              False),
        ('SKILLS',          ['Skills', 'Top skills'],                   True),
        ('CERTIFICATIONS',  ['Licenses & certifications'],              False),
        ('LANGUAGES',       ['Languages'],                              True),
        ('PROJECTS',        ['Projects'],                               False),
        ('VOLUNTEER',       ['Volunteer experience'],                   False),
    ]:
        items = extract_section(headings)
        if not items:
            continue
        if inline:
            body = '  ' + ', '.join(t for t in items if len(t) > 1)
        else:
            body = '\n'.join(f"  - {re.sub(r'\\s{3,}', ' · ', t)}" for t in items if len(t) > 5)
        if body.strip():
            sections.append(f"\n{label}:\n{body}")

    result = "\n".join(sections).strip()

    if len(result) < 300:
        try:
            texts = [s.get_all_text(strip=True) for s in page.css('span[aria-hidden="true"]')]
            fallback = "\n".join(t for t in texts if len(t) > 3)[:200]
            if len(fallback) > len(result):
                return f"LINKEDIN PROFILE DATA:\n\n{fallback}"
        except Exception:
            pass

    return result


def extract_generic_text(page) -> str:
    try:
        parts = page.css('body *:not(script):not(style):not(nav):not(footer):not(header)::text').getall()
        if parts:
            return re.sub(r'\s+', ' ', ' '.join(t.strip() for t in parts if t.strip())).strip()
    except Exception:
        pass
    html = getattr(page, 'html', '') or ''
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<style[^>]*>.*?</style>',  '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<[^>]+>', ' ', html)
    return re.sub(r'\s+', ' ', html.replace('&nbsp;', ' ')).strip()


def scrape_url(url: str) -> dict:
    if not SCRAPLING_AVAILABLE:
        return {'error': 'Scrapling not installed.', 'success': False}

    if not _chrome_binary:
        return {
            'error': (
                'Browser binary not available in this serverless environment. '
                f'Install log: {_install_log[-400:]}. '
                'Please upload your CV file directly.'
            ),
            'success': False,
        }

    try:
        if needs_stealth(url):
            page = StealthyFetcher.fetch(
                url,
                headless=True,
                network_idle=True,
                solve_cloudflare=True,
                google_search=False,
            )
        else:
            page = Fetcher.get(url, stealthy_headers=True, follow_redirects=True)

        current_url = getattr(page, 'url', url) or url
        status      = getattr(page, 'status', 200) or 200

        if status in (401, 403, 999):
            return {'error': f'Access denied (HTTP {status}).', 'success': False}

        if is_linkedin(url) and any(x in current_url for x in ('authwall', '/login', '/signup', 'checkpoint')):
            return {
                'error': (
                    'LinkedIn redirected to login. Profile requires authentication. '
                    'Please: LinkedIn → More → Save to PDF → upload here.'
                ),
                'success': False,
            }

        text         = extract_linkedin_profile(page) if is_linkedin(url) else extract_generic_text(page)
        profile_type = 'linkedin' if is_linkedin(url) else 'generic'

        if not text or len(text) < 150:
            return {'error': 'Not enough data extracted. Please upload your CV as a file.', 'success': False}

        return {'text': text[:15000], 'profile_type': profile_type, 'success': True}

    except Exception as e:
        err = str(e)
        if 'Executable doesn' in err or 'ms-playwright' in err or 'ms-patchright' in err:
            return {'error': f'Browser binary missing: {err[:200]}. Please upload your CV file directly.', 'success': False}
        if 'TimeoutError' in err or 'timeout' in err.lower() or 'net::ERR' in err:
            return {'error': 'Page load timed out. Please try again or upload file directly.', 'success': False}
        return {'error': f'Scraping error: {err[:300]}', 'success': False}


def scrape_url_fallback(url: str) -> dict:
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<style[^>]*>.*?</style>',  '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<[^>]+>', ' ', html)
        text = re.sub(r'\s+', ' ', html).strip()
        if len(text) < 200:
            return {'error': 'Not enough text extracted.', 'success': False}
        return {'text': text[:12000], 'profile_type': 'generic', 'success': True}
    except HTTPError as e:
        return {'error': f'HTTP {e.code}: {e.reason}', 'success': False}
    except Exception as e:
        return {'error': str(e), 'success': False}


# ──────────────────────────────────────────────────────────────
# Vercel serverless handler
# ──────────────────────────────────────────────────────────────
class handler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        pass

    def _json(self, status: int, data: dict):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._json(200, {})

    def do_GET(self):
        self._json(200, {
            'status': 'ok',
            'service': 'wazivo-scrapling',
            'version': '3.3',
            'scrapling_available': SCRAPLING_AVAILABLE,
            'browsers_ready': _browsers_ready,
            'chrome_binary': _chrome_binary,
            'playwright_dir': PLAYWRIGHT_DIR,
            'playwright_dir_exists': os.path.exists(PLAYWRIGHT_DIR),
            'playwright_dir_contents': os.listdir(PLAYWRIGHT_DIR) if os.path.exists(PLAYWRIGHT_DIR) else [],
            'install_log': _install_log[-1000:] if _install_log else None,
            'tmp_contents': os.listdir('/tmp') if os.path.exists('/tmp') else [],
        })

    def do_POST(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            if length == 0:
                self._json(400, {'error': 'Empty body', 'success': False})
                return

            data = json.loads(self.rfile.read(length).decode('utf-8'))
            url  = data.get('url', '').strip()

            if not url:
                self._json(400, {'error': 'URL required', 'success': False})
                return

            if SCRAPLING_AVAILABLE:
                result = scrape_url(url)
            elif needs_stealth(url):
                result = {'error': 'Scrapling not installed. Upload your CV file directly.', 'success': False}
            else:
                result = scrape_url_fallback(url)

            self._json(200 if result.get('success') else 400, result)

        except json.JSONDecodeError:
            self._json(400, {'error': 'Invalid JSON', 'success': False})
        except Exception as e:
            self._json(500, {'error': f'Server error: {str(e)}', 'success': False})
