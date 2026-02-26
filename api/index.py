from http.server import BaseHTTPRequestHandler
import json
import re
import os
import subprocess
import sys
import glob

# ──────────────────────────────────────────────────────────────
# Find the actual Chromium binary wherever Playwright put it
# ──────────────────────────────────────────────────────────────
def find_chromium() -> str | None:
    """Search all known cache locations for the Chromium binary."""
    search_patterns = [
        os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome'),
        os.path.expanduser('~/.cache/ms-playwright/chromium_headless_shell-*/chrome-linux/headless_shell'),
        os.path.expanduser('~/.cache/ms-patchright/chromium-*/chrome-linux/chrome'),
        os.path.expanduser('~/.cache/ms-patchright/chromium_headless_shell-*/chrome-linux/headless_shell'),
        '/tmp/.cache/ms-playwright/chromium-*/chrome-linux/chrome',
        '/tmp/.cache/ms-patchright/chromium-*/chrome-linux/chrome',
    ]
    for pattern in search_patterns:
        matches = glob.glob(pattern)
        for match in matches:
            if os.path.isfile(match) and os.access(match, os.X_OK):
                return match
    return None


def install_browsers() -> tuple[bool, str]:
    """
    Install Playwright + Patchright Chromium browsers.
    Returns (success, log_message).
    """
    logs = []

    # Try to write to /tmp since that's always writable in Lambda/Vercel
    env = os.environ.copy()
    env['PLAYWRIGHT_BROWSERS_PATH'] = '/tmp/ms-playwright'
    env['PATCHRIGHT_BROWSERS_PATH'] = '/tmp/ms-patchright'

    for cmd in [
        [sys.executable, '-m', 'playwright', 'install', 'chromium', '--with-deps'],
        [sys.executable, '-m', 'patchright', 'install', 'chromium', '--with-deps'],
    ]:
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=180,
                env=env,
            )
            logs.append(f"CMD: {' '.join(cmd)}")
            logs.append(f"RC: {result.returncode}")
            logs.append(f"STDOUT: {result.stdout[-500:] if result.stdout else '(empty)'}")
            logs.append(f"STDERR: {result.stderr[-500:] if result.stderr else '(empty)'}")
        except subprocess.TimeoutExpired:
            logs.append(f"TIMEOUT: {' '.join(cmd)}")
        except Exception as e:
            logs.append(f"ERROR: {' '.join(cmd)} → {e}")

    # Also search /tmp paths
    for pattern in [
        '/tmp/ms-playwright/chromium-*/chrome-linux/chrome',
        '/tmp/ms-patchright/chromium-*/chrome-linux/chrome',
        '/tmp/ms-playwright/chromium_headless_shell-*/chrome-linux/headless_shell',
    ]:
        matches = glob.glob(pattern)
        if matches:
            logs.append(f"FOUND at: {matches[0]}")

    binary = find_chromium_anywhere()
    success = binary is not None
    logs.append(f"BINARY FOUND: {binary}")
    return success, '\n'.join(logs)


def find_chromium_anywhere() -> str | None:
    """Extended search including /tmp paths."""
    patterns = [
        os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome'),
        os.path.expanduser('~/.cache/ms-playwright/chromium_headless_shell-*/chrome-linux/headless_shell'),
        os.path.expanduser('~/.cache/ms-patchright/chromium-*/chrome-linux/chrome'),
        os.path.expanduser('~/.cache/ms-patchright/chromium_headless_shell-*/chrome-linux/headless_shell'),
        '/tmp/ms-playwright/chromium-*/chrome-linux/chrome',
        '/tmp/ms-playwright/chromium_headless_shell-*/chrome-linux/headless_shell',
        '/tmp/ms-patchright/chromium-*/chrome-linux/chrome',
        '/tmp/ms-patchright/chromium_headless_shell-*/chrome-linux/headless_shell',
        # Vercel-specific paths
        '/var/task/.cache/ms-playwright/chromium-*/chrome-linux/chrome',
        '/var/task/.cache/ms-patchright/chromium-*/chrome-linux/chrome',
    ]
    for pattern in patterns:
        for match in glob.glob(pattern):
            if os.path.isfile(match) and os.access(match, os.X_OK):
                return match
    return None


# ── Run at cold start ──────────────────────────────────────────
_install_log = ''
_chrome_binary = find_chromium_anywhere()

if not _chrome_binary:
    _browsers_ready, _install_log = install_browsers()
    _chrome_binary = find_chromium_anywhere()
else:
    _browsers_ready = True

# ── Scrapling import (after potential install) ─────────────────
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
# LinkedIn structured profile extraction
# ──────────────────────────────────────────────────────────────
def extract_linkedin_profile(page) -> str:
    sections = []

    def safe_get(selector, default=''):
        try:
            result = page.css_first(selector)
            return result.get_all_text(strip=True) if result else default
        except Exception:
            return default

    def extract_section(heading_texts, max_items=15):
        for heading in heading_texts:
            try:
                raw = page.find_by_text(heading, tag='span') or page.find_by_text(heading, tag='h2')
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

    if name:     sections.append(f"NAME: {name}")
    if headline: sections.append(f"HEADLINE: {headline}")
    if location: sections.append(f"LOCATION: {location}")

    about = safe_get('.pv-about__summary-text') or safe_get('[data-field="summary"]')
    if about: sections.append(f"\nABOUT:\n{about}")

    for label, headings in [
        ('EXPERIENCE', ['Experience']),
        ('EDUCATION',  ['Education']),
        ('SKILLS',     ['Skills', 'Top skills']),
        ('CERTIFICATIONS', ['Licenses & certifications', 'Certifications']),
        ('LANGUAGES',  ['Languages']),
        ('PROJECTS',   ['Projects']),
        ('VOLUNTEER',  ['Volunteer experience']),
    ]:
        items = extract_section(headings)
        if items:
            connector = ', ' if label in ('SKILLS', 'LANGUAGES') else '\n'
            prefix    = '  ' if label in ('SKILLS', 'LANGUAGES') else ''
            body      = connector.join(f"{prefix}{t}" for t in items) if label in ('SKILLS', 'LANGUAGES') \
                        else '\n'.join(f"  - {re.sub(r'\\s{3,}', ' · ', t)}" for t in items if len(t) > 5)
            if body:
                sections.append(f"\n{label}:\n{body}")

    result = "\n".join(sections).strip()

    # Ultimate fallback: all visible span texts
    if len(result) < 300:
        try:
            texts = [s.get_all_text(strip=True) for s in page.css('span[aria-hidden="true"]')]
            texts = [t for t in texts if len(t) > 3]
            fallback = "\n".join(texts[:200])
            if len(fallback) > len(result):
                return f"LINKEDIN PROFILE DATA:\n\n{fallback}"
        except Exception:
            pass

    return result


def extract_generic_text(page) -> str:
    try:
        body_texts = page.css('body *:not(script):not(style):not(nav):not(footer):not(header)::text').getall()
        if body_texts:
            return re.sub(r'\s+', ' ', ' '.join(t.strip() for t in body_texts if t.strip())).strip()
    except Exception:
        pass
    html = getattr(page, 'html', '') or ''
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
    html = re.sub(r'<style[^>]*>.*?</style>',  '', html, flags=re.DOTALL|re.IGNORECASE)
    html = re.sub(r'<[^>]+>', ' ', html)
    return re.sub(r'\s+', ' ', html.replace('&nbsp;',' ').replace('&amp;','&')).strip()


def scrape_url(url: str) -> dict:
    if not SCRAPLING_AVAILABLE:
        return {'error': 'Scrapling not installed.', 'success': False}

    if not _browsers_ready or not _chrome_binary:
        return {
            'error': (
                f'Browser not ready (binary: {_chrome_binary}). '
                f'Install log: {_install_log[-300:] if _install_log else "none"}. '
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
            return {'error': f'Access denied (HTTP {status}). Page requires login.', 'success': False}

        if is_linkedin(url) and any(x in current_url for x in ('authwall', '/login', '/signup', 'checkpoint')):
            return {
                'error': 'LinkedIn redirected to login wall. The profile is private or requires authentication. '
                         'Please: LinkedIn → More → Save to PDF → upload here.',
                'success': False,
            }

        text         = extract_linkedin_profile(page) if is_linkedin(url) else extract_generic_text(page)
        profile_type = 'linkedin' if is_linkedin(url) else 'generic'

        if not text or len(text) < 150:
            return {'error': 'Not enough data extracted. Page may require login. Please upload your CV as a file.', 'success': False}

        return {'text': text[:15000], 'profile_type': profile_type, 'success': True}

    except Exception as e:
        err = str(e)
        if 'Executable doesn' in err or 'playwright install' in err or 'ms-playwright' in err or 'ms-patchright' in err:
            return {
                'error': f'Browser binary missing at: {err[:200]}. Please upload your CV file directly.',
                'success': False,
            }
        if 'net::ERR' in err or 'TimeoutError' in err or 'timeout' in err.lower():
            return {'error': 'Page load timed out. Please try again or upload the file directly.', 'success': False}
        return {'error': f'Scraping error: {err[:300]}', 'success': False}


def scrape_url_fallback(url: str) -> dict:
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
        html = re.sub(r'<style[^>]*>.*?</style>',  '', html, flags=re.DOTALL|re.IGNORECASE)
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
        # Expose full diagnostics so we can see exactly what's happening
        self._json(200, {
            'status': 'ok',
            'service': 'wazivo-scrapling',
            'version': '3.2',
            'scrapling_available': SCRAPLING_AVAILABLE,
            'browsers_ready': _browsers_ready,
            'chrome_binary': _chrome_binary,
            'python': sys.version,
            'install_log': _install_log[-800:] if _install_log else None,
            'env_playwright_path': os.environ.get('PLAYWRIGHT_BROWSERS_PATH'),
            'tmp_contents': os.listdir('/tmp') if os.path.exists('/tmp') else [],
        })

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self._json(400, {'error': 'Empty request body', 'success': False})
                return

            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            url  = data.get('url', '').strip()

            if not url:
                self._json(400, {'error': 'URL is required', 'success': False})
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
