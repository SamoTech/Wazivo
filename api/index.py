from http.server import BaseHTTPRequestHandler
import json
import re

# ──────────────────────────────────────────────
# Scrapling imports — installed via requirements.txt
# Uses StealthyFetcher for bot-protected pages (LinkedIn, Cloudflare, etc.)
# Falls back to lightweight Fetcher for normal pages
# ──────────────────────────────────────────────
try:
    from scrapling.fetchers import StealthyFetcher, Fetcher
    SCRAPLING_AVAILABLE = True
except ImportError:
    SCRAPLING_AVAILABLE = False

# Fallback: stdlib urllib if Scrapling is somehow not installed
import urllib.request
import urllib.parse
from urllib.error import HTTPError, URLError


# ──────────────────────────────────────────────
# Sites that need StealthyFetcher (full headless browser + stealth)
# ──────────────────────────────────────────────
STEALTH_DOMAINS = [
    'linkedin.com',
    'glassdoor.com',
    'indeed.com',
    'ziprecruiter.com',
    'monster.com',
]


def needs_stealth(url: str) -> bool:
    url_lower = url.lower()
    return any(domain in url_lower for domain in STEALTH_DOMAINS)


def clean_html_text(raw: str) -> str:
    """Strip HTML tags and normalize whitespace from a raw HTML string."""
    raw = re.sub(r'<script[^>]*>.*?</script>', '', raw, flags=re.DOTALL | re.IGNORECASE)
    raw = re.sub(r'<style[^>]*>.*?</style>', '', raw, flags=re.DOTALL | re.IGNORECASE)
    raw = re.sub(r'<nav[^>]*>.*?</nav>', '', raw, flags=re.DOTALL | re.IGNORECASE)
    raw = re.sub(r'<footer[^>]*>.*?</footer>', '', raw, flags=re.DOTALL | re.IGNORECASE)
    raw = re.sub(r'<header[^>]*>.*?</header>', '', raw, flags=re.DOTALL | re.IGNORECASE)
    raw = re.sub(r'<[^>]+>', ' ', raw)
    raw = raw.replace('&nbsp;', ' ').replace('&amp;', '&') \
             .replace('&lt;', '<').replace('&gt;', '>') \
             .replace('&quot;', '"').replace('&#39;', "'")
    return re.sub(r'\s+', ' ', raw).strip()


def scrape_with_scrapling(url: str) -> str:
    """
    Use Scrapling to fetch a URL.
    - StealthyFetcher  →  bot-protected sites (LinkedIn, Glassdoor, Cloudflare, etc.)
    - Fetcher          →  normal public pages
    Both return a Scrapling `Response` object whose `.css()` / `.xpath()` / `.text` we can use.
    """
    stealth = needs_stealth(url)

    if stealth:
        # StealthyFetcher: full Playwright Chromium + fingerprint spoofing
        # solve_cloudflare=True handles Cloudflare Turnstile / Interstitial
        page = StealthyFetcher.fetch(
            url,
            headless=True,
            network_idle=True,       # wait until network is idle (JS rendered)
            solve_cloudflare=True,
            google_search=False,     # skip fake Google referrer — not needed here
        )
    else:
        # Fetcher: fast HTTP, impersonates Chrome TLS fingerprint
        page = Fetcher.get(
            url,
            stealthy_headers=True,
            follow_redirects=True,
        )

    # Extract body text — Scrapling gives us a parsed DOM we can query
    # Get all visible text from the body, excluding scripts/nav/footer
    body_text_nodes = page.css(
        'body *:not(script):not(style):not(nav):not(footer):not(header)::text'
    ).getall()

    if body_text_nodes:
        text = ' '.join(t.strip() for t in body_text_nodes if t.strip())
        text = re.sub(r'\s+', ' ', text).strip()
    else:
        # Fallback: get raw HTML and strip tags ourselves
        text = clean_html_text(page.html or '')

    return text


def scrape_with_urllib_fallback(url: str) -> str:
    """
    Pure stdlib fallback used only when Scrapling is not installed.
    Good for simple public pages, NOT for LinkedIn/Cloudflare.
    """
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': (
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/120.0.0.0 Safari/537.36'
            ),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }
    )
    with urllib.request.urlopen(req, timeout=15) as response:
        content = response.read().decode('utf-8', errors='ignore')
    return clean_html_text(content)


# ──────────────────────────────────────────────
# Vercel serverless handler
# ──────────────────────────────────────────────
class handler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        # Suppress default HTTP server logs in serverless environment
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
            'service': 'scrapling-real',
            'scrapling_available': SCRAPLING_AVAILABLE,
        })

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self._json(400, {'error': 'Empty request body'})
                return

            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            url = data.get('url', '').strip()

            if not url:
                self._json(400, {'error': 'URL is required'})
                return

            # ── Scrape ───────────────────────────────────────
            if SCRAPLING_AVAILABLE:
                text = scrape_with_scrapling(url)
            else:
                # Scrapling not installed — use stdlib fallback
                # This won't work for LinkedIn/Cloudflare-protected pages
                if needs_stealth(url):
                    self._json(400, {
                        'error': (
                            'Scrapling is not installed on this server. '
                            'Bot-protected pages like LinkedIn cannot be fetched. '
                            'Please upload your CV file directly.'
                        )
                    })
                    return
                text = scrape_with_urllib_fallback(url)

            # ── Validate extracted text ───────────────────────
            if not text or len(text) < 200:
                self._json(400, {
                    'error': (
                        'Not enough text could be extracted from this page. '
                        'The content may require a login or be JavaScript-only. '
                        'Please upload the file directly.'
                    )
                })
                return

            self._json(200, {
                'text': text[:12000],   # generous limit for CV-length content
                'success': True,
                'used_stealth': needs_stealth(url),
            })

        except json.JSONDecodeError:
            self._json(400, {'error': 'Invalid JSON in request body'})

        except Exception as e:
            err = str(e)
            # Make common Scrapling/Playwright errors more user-friendly
            if 'net::ERR' in err or 'TimeoutError' in err:
                self._json(400, {
                    'error': (
                        'The page could not be loaded (network error or timeout). '
                        'Please check the URL and try again, or upload the file directly.'
                    )
                })
            elif 'blocked' in err.lower() or '403' in err or '999' in err:
                self._json(400, {
                    'error': (
                        'The website blocked access even with stealth mode. '
                        'Please download your CV and upload it directly.'
                    )
                })
            else:
                self._json(500, {'error': f'Scraping failed: {err}'})
