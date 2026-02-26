from http.server import BaseHTTPRequestHandler
import json
import re
import os
import subprocess
import sys

# ──────────────────────────────────────────────────────────────
# Install browsers at runtime if missing (Vercel sandboxes don't
# persist the build filesystem into function execution)
# ──────────────────────────────────────────────────────────────
def ensure_browsers_installed():
    """Check if Playwright/Patchright Chromium exists; install if not."""
    chrome_paths = [
        os.path.expanduser('~/.cache/ms-playwright/chromium-1194/chrome-linux/chrome'),
        os.path.expanduser('~/.cache/ms-playwright/chromium-1169/chrome-linux/chrome'),
        os.path.expanduser('~/.cache/ms-playwright/chromium-1148/chrome-linux/chrome'),
    ]
    patchright_paths = [
        os.path.expanduser('~/.cache/ms-patchright/chromium-1194/chrome-linux/chrome'),
        os.path.expanduser('~/.cache/ms-patchright/chromium-1169/chrome-linux/chrome'),
    ]

    all_paths = chrome_paths + patchright_paths
    if any(os.path.exists(p) for p in all_paths):
        return True  # already installed

    try:
        subprocess.run(
            [sys.executable, '-m', 'playwright', 'install', 'chromium'],
            check=True, capture_output=True, timeout=120
        )
        subprocess.run(
            [sys.executable, '-m', 'patchright', 'install', 'chromium'],
            check=True, capture_output=True, timeout=120
        )
        return True
    except Exception as e:
        print(f'[scrapling] Browser install failed: {e}', flush=True)
        return False


# Run browser install check once at module load (cold start)
_browsers_ready = ensure_browsers_installed()

try:
    from scrapling.fetchers import StealthyFetcher, Fetcher
    SCRAPLING_AVAILABLE = True
except ImportError:
    SCRAPLING_AVAILABLE = False

import urllib.request
from urllib.error import HTTPError


# ──────────────────────────────────────────────────────────────
STEALTH_DOMAINS = [
    'linkedin.com', 'glassdoor.com', 'indeed.com',
    'ziprecruiter.com', 'monster.com',
]

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

    def safe_getall(selector):
        try:
            return [el.get_all_text(strip=True) for el in page.css(selector) if el.get_all_text(strip=True)]
        except Exception:
            return []

    # Name & Headline
    name = safe_get('h1') or safe_get('.text-heading-xlarge') or safe_get('[data-anonymize="person-name"]')
    headline = safe_get('.text-body-medium.break-words') or safe_get('[data-field="headline"]')
    location = safe_get('.text-body-small.inline.t-black--light.break-words') or safe_get('[data-field="location"]')

    if name:    sections.append(f"NAME: {name}")
    if headline: sections.append(f"HEADLINE: {headline}")
    if location: sections.append(f"LOCATION: {location}")

    # About
    about = (
        safe_get('#about ~ * .pv-shared-text-with-see-more') or
        safe_get('.pv-about__summary-text') or
        safe_get('[data-field="summary"]')
    )
    if about:
        sections.append(f"\nABOUT:\n{about}")

    # Helper: extract section by heading text
    def extract_section(heading_texts, max_items=10):
        items = []
        for heading in heading_texts:
            try:
                raw = page.find_by_text(heading, tag='span') or page.find_by_text(heading, tag='h2')
                if raw:
                    parent = raw.parent.parent if raw.parent else None
                    if parent:
                        texts = [el.get_all_text(strip=True) for el in parent.css('span[aria-hidden="true"]')]
                        items = [t for t in texts if t and len(t) > 3][:max_items]
                        if items:
                            break
            except Exception:
                continue
        return items

    # Experience
    exp_items = []
    for item in (page.css('section[data-section="experience"] ul li') or
                 page.css('#experience ~ * ul li') or [])[:10]:
        text = item.get_all_text(strip=True)
        if text and len(text) > 10:
            exp_items.append(f"  - {re.sub(r'\\s{3,}', ' · ', text)}")

    if not exp_items:
        raw = extract_section(['Experience'], max_items=30)
        exp_items = [f"  - {t}" for t in raw if len(t) > 5][:15]

    if exp_items:
        sections.append(f"\nEXPERIENCE:\n" + "\n".join(exp_items))

    # Education
    edu_items = []
    for item in (page.css('section[data-section="education"] ul li') or
                 page.css('#education ~ * ul li') or [])[:6]:
        text = item.get_all_text(strip=True)
        if text and len(text) > 5:
            edu_items.append(f"  - {re.sub(r'\\s{3,}', ' · ', text)}")

    if not edu_items:
        raw = extract_section(['Education'], max_items=15)
        edu_items = [f"  - {t}" for t in raw if len(t) > 5][:8]

    if edu_items:
        sections.append(f"\nEDUCATION:\n" + "\n".join(edu_items))

    # Skills
    skill_items = []
    for item in (page.css('section[data-section="skills"] ul li') or
                 page.css('#skills ~ * ul li') or [])[:25]:
        text = item.get_all_text(strip=True)
        if text and len(text) > 1:
            skill_items.append(text)

    if not skill_items:
        skill_items = [t for t in extract_section(['Skills'], max_items=30) if 2 < len(t) < 50]

    if skill_items:
        sections.append(f"\nSKILLS:\n  " + ", ".join(skill_items))

    # Certifications
    cert = extract_section(['Licenses & certifications', 'Certifications', 'Licenses'], max_items=10)
    if cert:
        sections.append(f"\nCERTIFICATIONS:\n" + "\n".join(f"  - {t}" for t in cert if len(t) > 5))

    # Languages
    langs = extract_section(['Languages'], max_items=10)
    if langs:
        sections.append(f"\nLANGUAGES:\n  " + ", ".join(t for t in langs if len(t) > 1))

    # Bonus sections
    for sname in ['Projects', 'Volunteer experience', 'Publications', 'Honors & awards']:
        items = extract_section([sname], max_items=5)
        if items:
            sections.append(f"\n{sname.upper()}:\n" + "\n".join(f"  - {t}" for t in items if len(t) > 5))

    result = "\n".join(sections).strip()

    # Fallback: all aria-hidden spans
    if len(result) < 300:
        try:
            texts = [s.get_all_text(strip=True) for s in page.css('span[aria-hidden="true"]')]
            texts = [t for t in texts if len(t) > 3]
            fallback = "\n".join(texts[:150])
            if len(fallback) > len(result):
                return f"LINKEDIN PROFILE DATA:\n\n{fallback}"
        except Exception:
            pass

    return result


def extract_generic_text(page) -> str:
    try:
        body_texts = page.css(
            'body *:not(script):not(style):not(nav):not(footer):not(header)::text'
        ).getall()
        if body_texts:
            text = ' '.join(t.strip() for t in body_texts if t.strip())
            return re.sub(r'\s+', ' ', text).strip()
    except Exception:
        pass

    html = getattr(page, 'html', '') or ''
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<[^>]+>', ' ', html)
    html = html.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"')
    return re.sub(r'\s+', ' ', html).strip()


def scrape_url(url: str) -> dict:
    if not SCRAPLING_AVAILABLE:
        return {'error': 'Scrapling not installed.', 'success': False}

    if not _browsers_ready:
        return {'error': 'Browser not available. Please try again in a moment or upload the file directly.', 'success': False}

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
        status = getattr(page, 'status', 200) or 200

        if status in (401, 403, 999):
            return {'error': f'Access denied (HTTP {status}). Page requires login.', 'success': False}

        if is_linkedin(url) and any(x in current_url for x in ('authwall', '/login', '/signup', 'checkpoint')):
            return {
                'error': (
                    'LinkedIn redirected to login. The profile requires authentication. '
                    'Please use: LinkedIn → More → Save to PDF → upload here.'
                ),
                'success': False,
            }

        text = extract_linkedin_profile(page) if is_linkedin(url) else extract_generic_text(page)
        profile_type = 'linkedin' if is_linkedin(url) else 'generic'

        if not text or len(text) < 150:
            return {
                'error': 'Not enough data extracted. The page may require login. Please upload your CV as a file.',
                'success': False,
            }

        return {'text': text[:15000], 'profile_type': profile_type, 'success': True}

    except Exception as e:
        err = str(e)
        if 'Executable doesn' in err or 'playwright install' in err or 'ms-playwright' in err:
            # Browser binary missing at runtime — try to install now and advise retry
            ensure_browsers_installed()
            return {
                'error': 'Browser was not ready. It has been queued for installation — please try again in 30 seconds, or upload your CV file directly.',
                'success': False,
            }
        if 'net::ERR' in err or 'TimeoutError' in err or 'timeout' in err.lower():
            return {'error': 'Page load timed out. Please try again or upload the file directly.', 'success': False}
        if '403' in err or 'blocked' in err.lower() or '999' in err:
            return {'error': 'Website blocked access. Please upload your CV file directly.', 'success': False}
        return {'error': f'Scraping error: {err}', 'success': False}


def scrape_url_fallback(url: str) -> dict:
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,*/*;q=0.8',
        })
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8', errors='ignore')

        html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<[^>]+>', ' ', html)
        text = re.sub(r'\s+', ' ', html).strip()

        if len(text) < 200:
            return {'error': 'Not enough text extracted. Please upload the file directly.', 'success': False}
        return {'text': text[:12000], 'profile_type': 'generic', 'success': True}
    except HTTPError as e:
        return {'error': f'HTTP {e.code}: {e.reason}', 'success': False}
    except Exception as e:
        return {'error': f'Failed: {str(e)}', 'success': False}


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
            'version': '3.1',
            'scrapling_available': SCRAPLING_AVAILABLE,
            'browsers_ready': _browsers_ready,
        })

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self._json(400, {'error': 'Empty request body', 'success': False})
                return

            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            url = data.get('url', '').strip()

            if not url:
                self._json(400, {'error': 'URL is required', 'success': False})
                return

            if SCRAPLING_AVAILABLE:
                result = scrape_url(url)
            else:
                if needs_stealth(url):
                    result = {'error': 'Scrapling not installed. Please upload your CV file directly.', 'success': False}
                else:
                    result = scrape_url_fallback(url)

            self._json(200 if result.get('success') else 400, result)

        except json.JSONDecodeError:
            self._json(400, {'error': 'Invalid JSON', 'success': False})
        except Exception as e:
            self._json(500, {'error': f'Server error: {str(e)}', 'success': False})
