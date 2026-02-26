from http.server import BaseHTTPRequestHandler
import json
import re
import urllib.request
import urllib.parse
from urllib.error import HTTPError, URLError

# ──────────────────────────────────────────────────────────────
# Jina Reader API  —  https://r.jina.ai/<url>
#
# Runs a real headless browser on Jina's servers.
# Returns clean LLM-friendly markdown text.
# FREE (no API key needed), no browser binary required here.
# Optional: set JINA_API_KEY env var for higher rate limits.
# ──────────────────────────────────────────────────────────────
import os

JINA_BASE = 'https://r.jina.ai/'

STEALTH_DOMAINS = ['linkedin.com', 'glassdoor.com', 'indeed.com',
                   'ziprecruiter.com', 'monster.com']

def needs_stealth(url: str) -> bool:
    return any(d in url.lower() for d in STEALTH_DOMAINS)

def is_linkedin(url: str) -> bool:
    return 'linkedin.com' in url.lower()


def fetch_via_jina(url: str) -> dict:
    """
    Fetch any URL through Jina Reader API.
    Returns clean markdown text — perfect for LLM analysis.
    """
    jina_url = f"{JINA_BASE}{url}"

    headers = {
        'Accept': 'text/plain',                     # clean markdown back
        'X-Return-Format': 'markdown',              # explicit markdown mode
        'X-Remove-Selector': 'nav, footer, header, .nav, .footer, .header, .sidebar, #sidebar, .ads, .cookie-banner',
        'User-Agent': 'Mozilla/5.0 (compatible; Wazivo/1.0)',
    }

    # Optional: add API key for higher rate limits (200 rpm vs 20 rpm)
    jina_key = os.environ.get('JINA_API_KEY', '').strip()
    if jina_key:
        headers['Authorization'] = f'Bearer {jina_key}'

    # For LinkedIn, wait for dynamic content to load
    if is_linkedin(url):
        headers['X-Wait-For-Selector'] = 'main'
        headers['X-Timeout'] = '30'

    try:
        req = urllib.request.Request(jina_url, headers=headers)
        with urllib.request.urlopen(req, timeout=45) as resp:
            status = resp.getcode()
            content = resp.read().decode('utf-8', errors='ignore').strip()

        if status != 200:
            return {'error': f'Jina returned HTTP {status}', 'success': False}

        if not content or len(content) < 100:
            return {
                'error': 'Page returned too little content. It may require login.',
                'success': False,
            }

        # Detect LinkedIn login wall in the returned content
        if is_linkedin(url):
            lower = content.lower()
            login_signals = ['sign in to linkedin', 'join linkedin', 'authwall',
                             'be the first', 'create your free account', 'sign up']
            if any(s in lower for s in login_signals) and len(content) < 1000:
                return {
                    'error': (
                        'LinkedIn requires login to view this profile. '
                        'Please: go to your LinkedIn profile → click "More" → '
                        '"Save to PDF" → upload the PDF here.'
                    ),
                    'success': False,
                }

        return {
            'text': content[:15000],
            'profile_type': 'linkedin' if is_linkedin(url) else 'generic',
            'success': True,
        }

    except HTTPError as e:
        if e.code == 422:
            return {'error': 'Jina could not process this URL (422). Please upload the file directly.', 'success': False}
        if e.code in (401, 403):
            return {'error': f'Access denied (HTTP {e.code}). The page requires login.', 'success': False}
        return {'error': f'HTTP error {e.code}: {e.reason}', 'success': False}

    except URLError as e:
        return {'error': f'Network error reaching Jina: {e.reason}', 'success': False}

    except Exception as e:
        return {'error': f'Jina fetch failed: {str(e)[:200]}', 'success': False}


def fetch_direct_fallback(url: str) -> dict:
    """
    Plain urllib fallback for simple public pages when Jina is unavailable.
    Does NOT handle LinkedIn or JS-heavy sites.
    """
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
            ),
            'Accept': 'text/html,*/*;q=0.8',
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')

        # Strip HTML tags
        html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<style[^>]*>.*?</style>',  '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<nav[^>]*>.*?</nav>',       '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<footer[^>]*>.*?</footer>', '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<[^>]+>', ' ', html)
        html = html.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"')
        text = re.sub(r'\s+', ' ', html).strip()

        if len(text) < 200:
            return {'error': 'Not enough text extracted. Please upload the file directly.', 'success': False}

        return {'text': text[:12000], 'profile_type': 'generic', 'success': True}

    except HTTPError as e:
        return {'error': f'HTTP {e.code}: {e.reason}', 'success': False}
    except Exception as e:
        return {'error': str(e)[:200], 'success': False}


def scrape_url(url: str) -> dict:
    """Main entry point — always tries Jina first, falls back to direct fetch."""

    # Jina handles everything: LinkedIn, Cloudflare, JS pages
    result = fetch_via_jina(url)

    # If Jina failed and it's NOT a protected site, try direct fetch
    if not result.get('success') and not needs_stealth(url):
        fallback = fetch_direct_fallback(url)
        if fallback.get('success'):
            return fallback

    return result


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
            'version': '4.0',
            'engine': 'jina-reader',
            'jina_api_key_set': bool(os.environ.get('JINA_API_KEY')),
            'note': 'Using Jina Reader API — no browser binary needed',
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

            result = scrape_url(url)
            self._json(200 if result.get('success') else 400, result)

        except json.JSONDecodeError:
            self._json(400, {'error': 'Invalid JSON', 'success': False})
        except Exception as e:
            self._json(500, {'error': f'Server error: {str(e)[:200]}', 'success': False})
