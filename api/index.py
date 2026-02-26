from http.server import BaseHTTPRequestHandler
import json
import re

try:
    from scrapling.fetchers import StealthyFetcher, Fetcher
    SCRAPLING_AVAILABLE = True
except ImportError:
    SCRAPLING_AVAILABLE = False

import urllib.request
from urllib.error import HTTPError, URLError


# ──────────────────────────────────────────────────────────────
# Domains that need StealthyFetcher (full headless + stealth)
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
# Uses Scrapling CSS selectors on the rendered DOM
# Returns a rich text block formatted for AI analysis
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

    # ── Name & Headline ──────────────────────────────────────
    name = (
        safe_get('h1') or
        safe_get('.text-heading-xlarge') or
        safe_get('[data-anonymize="person-name"]') or
        safe_get('.pv-top-card--list li:first-child')
    )
    headline = (
        safe_get('.text-body-medium.break-words') or
        safe_get('[data-field="headline"]') or
        safe_get('.pv-top-card-section__headline')
    )
    location = (
        safe_get('.text-body-small.inline.t-black--light.break-words') or
        safe_get('[data-field="location"]') or
        safe_get('.pv-top-card--list-bullet li')
    )

    if name:
        sections.append(f"NAME: {name}")
    if headline:
        sections.append(f"HEADLINE: {headline}")
    if location:
        sections.append(f"LOCATION: {location}")

    # ── About / Summary ──────────────────────────────────────
    about = (
        safe_get('.display-flex.ph5.pv3 div.pv-shared-text-with-see-more span[aria-hidden="true"]') or
        safe_get('#about ~ * .pv-shared-text-with-see-more') or
        safe_get('.pv-about__summary-text') or
        safe_get('[data-field="summary"]')
    )
    if about:
        sections.append(f"\nABOUT:\n{about}")

    # ── Experience ───────────────────────────────────────────
    exp_items = []

    # Try modern LinkedIn structure
    exp_containers = page.css('section[data-section="experience"] ul li') or \
                     page.css('#experience ~ * ul li') or \
                     page.css('.pvs-list__item--line-separated')

    for item in exp_containers[:10]:
        text = item.get_all_text(strip=True)
        if text and len(text) > 10:
            # Clean up excessive whitespace
            text = re.sub(r'\s{3,}', ' · ', text)
            exp_items.append(f"  - {text}")

    # Fallback: grab all span texts near experience section
    if not exp_items:
        try:
            raw = page.find_by_text('Experience', tag='span') or \
                  page.find_by_text('Experience', tag='h2')
            if raw:
                parent = raw.parent.parent if raw.parent else None
                if parent:
                    texts = [el.get_all_text(strip=True) for el in parent.css('span[aria-hidden="true"]')]
                    exp_items = [f"  - {t}" for t in texts if t and len(t) > 5][:20]
        except Exception:
            pass

    if exp_items:
        sections.append(f"\nEXPERIENCE:\n" + "\n".join(exp_items))

    # ── Education ────────────────────────────────────────────
    edu_items = []
    edu_containers = page.css('section[data-section="education"] ul li') or \
                     page.css('#education ~ * ul li') or \
                     page.css('.pv-education-entity')

    for item in edu_containers[:6]:
        text = item.get_all_text(strip=True)
        if text and len(text) > 5:
            text = re.sub(r'\s{3,}', ' · ', text)
            edu_items.append(f"  - {text}")

    if not edu_items:
        try:
            raw = page.find_by_text('Education', tag='span') or \
                  page.find_by_text('Education', tag='h2')
            if raw:
                parent = raw.parent.parent if raw.parent else None
                if parent:
                    texts = [el.get_all_text(strip=True) for el in parent.css('span[aria-hidden="true"]')]
                    edu_items = [f"  - {t}" for t in texts if t and len(t) > 5][:10]
        except Exception:
            pass

    if edu_items:
        sections.append(f"\nEDUCATION:\n" + "\n".join(edu_items))

    # ── Skills ───────────────────────────────────────────────
    skill_items = []
    skill_containers = page.css('section[data-section="skills"] ul li') or \
                       page.css('#skills ~ * ul li') or \
                       page.css('.pv-skill-category-entity__name')

    for item in skill_containers[:20]:
        text = item.get_all_text(strip=True)
        if text and len(text) > 1:
            skill_items.append(text)

    if not skill_items:
        try:
            raw = page.find_by_text('Skills', tag='span') or \
                  page.find_by_text('Skills', tag='h2')
            if raw:
                parent = raw.parent.parent if raw.parent else None
                if parent:
                    texts = [el.get_all_text(strip=True) for el in parent.css('span[aria-hidden="true"]')]
                    skill_items = [t for t in texts if t and 2 < len(t) < 50][:25]
        except Exception:
            pass

    if skill_items:
        sections.append(f"\nSKILLS:\n  " + ", ".join(skill_items))

    # ── Certifications ───────────────────────────────────────
    cert_items = []
    try:
        raw = page.find_by_text('Licenses', tag='span') or \
              page.find_by_text('Certifications', tag='span') or \
              page.find_by_text('Licenses & certifications', tag='h2')
        if raw:
            parent = raw.parent.parent if raw.parent else None
            if parent:
                texts = [el.get_all_text(strip=True) for el in parent.css('span[aria-hidden="true"]')]
                cert_items = [f"  - {t}" for t in texts if t and len(t) > 5][:10]
    except Exception:
        pass

    if cert_items:
        sections.append(f"\nCERTIFICATIONS:\n" + "\n".join(cert_items))

    # ── Languages ────────────────────────────────────────────
    lang_items = []
    try:
        raw = page.find_by_text('Languages', tag='span') or \
              page.find_by_text('Languages', tag='h2')
        if raw:
            parent = raw.parent.parent if raw.parent else None
            if parent:
                texts = [el.get_all_text(strip=True) for el in parent.css('span[aria-hidden="true"]')]
                lang_items = [t for t in texts if t and len(t) > 1][:10]
    except Exception:
        pass

    if lang_items:
        sections.append(f"\nLANGUAGES:\n  " + ", ".join(lang_items))

    # ── Volunteer / Projects (bonus) ─────────────────────────
    for section_name in ['Volunteer experience', 'Projects', 'Publications', 'Honors & awards']:
        try:
            raw = page.find_by_text(section_name, tag='span') or \
                  page.find_by_text(section_name, tag='h2')
            if raw:
                parent = raw.parent.parent if raw.parent else None
                if parent:
                    texts = [el.get_all_text(strip=True) for el in parent.css('span[aria-hidden="true"]')]
                    items = [f"  - {t}" for t in texts if t and len(t) > 5][:5]
                    if items:
                        sections.append(f"\n{section_name.upper()}:\n" + "\n".join(items))
        except Exception:
            pass

    result = "\n".join(sections).strip()

    # Final fallback: if we got very little structured data,
    # return cleaned full-page text so AI can still extract something
    if len(result) < 300:
        try:
            all_spans = page.css('span[aria-hidden="true"]')
            texts = [s.get_all_text(strip=True) for s in all_spans if s.get_all_text(strip=True)]
            texts = [t for t in texts if len(t) > 3]
            fallback = "\n".join(texts[:150])
            if len(fallback) > len(result):
                return f"LINKEDIN PROFILE DATA:\n\n{fallback}"
        except Exception:
            pass

    return result


# ──────────────────────────────────────────────────────────────
# Generic HTML → clean text
# ──────────────────────────────────────────────────────────────
def extract_generic_text(page) -> str:
    try:
        # Try Scrapling's structured extraction first
        body_texts = page.css(
            'body *:not(script):not(style):not(nav):not(footer):not(header)::text'
        ).getall()
        if body_texts:
            text = ' '.join(t.strip() for t in body_texts if t.strip())
            return re.sub(r'\s+', ' ', text).strip()
    except Exception:
        pass

    # Fallback: strip HTML tags from raw HTML
    html = getattr(page, 'html', '') or ''
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<nav[^>]*>.*?</nav>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<footer[^>]*>.*?</footer>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<header[^>]*>.*?</header>', '', html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<[^>]+>', ' ', html)
    html = html.replace('&nbsp;', ' ').replace('&amp;', '&') \
               .replace('&lt;', '<').replace('&gt;', '>') \
               .replace('&quot;', '"').replace('&#39;', "'")
    return re.sub(r'\s+', ' ', html).strip()


# ──────────────────────────────────────────────────────────────
# Core scrape function
# ──────────────────────────────────────────────────────────────
def scrape_url(url: str) -> dict:
    if not SCRAPLING_AVAILABLE:
        return {'error': 'Scrapling not installed on this server.', 'success': False}

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

        # Check if we got blocked / redirected to login
        current_url = getattr(page, 'url', url) or url
        status = getattr(page, 'status', 200) or 200

        if status in (401, 403, 999):
            return {
                'error': f'Access denied (HTTP {status}). The page requires login or blocks automated access.',
                'success': False,
            }

        # LinkedIn login wall detection
        if is_linkedin(url) and ('authwall' in current_url or 'login' in current_url or 'signup' in current_url):
            return {
                'error': (
                    'LinkedIn redirected to login wall. '
                    'The profile is private or requires authentication. '
                    'Please use LinkedIn → More → Save to PDF and upload the file directly.'
                ),
                'success': False,
            }

        # Extract structured data
        if is_linkedin(url):
            text = extract_linkedin_profile(page)
            profile_type = 'linkedin'
        else:
            text = extract_generic_text(page)
            profile_type = 'generic'

        if not text or len(text) < 150:
            return {
                'error': (
                    'Not enough profile data could be extracted. '
                    'The page may require login or render content dynamically after authentication. '
                    'Please download/export your profile as PDF and upload it directly.'
                ),
                'success': False,
            }

        return {
            'text': text[:15000],   # generous limit — profiles can be long
            'profile_type': profile_type,
            'success': True,
        }

    except Exception as e:
        err = str(e)
        if 'net::ERR' in err or 'TimeoutError' in err or 'timeout' in err.lower():
            return {'error': 'Page load timed out or network error. Please try again or upload the file directly.', 'success': False}
        if '403' in err or 'blocked' in err.lower() or '999' in err:
            return {'error': 'The website blocked access. Please upload your CV file directly.', 'success': False}
        return {'error': f'Scraping error: {err}', 'success': False}


# ──────────────────────────────────────────────────────────────
# Stdlib fallback (when Scrapling not installed)
# ──────────────────────────────────────────────────────────────
def scrape_url_fallback(url: str) -> dict:
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        })
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8', errors='ignore')

        html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r'<[^>]+>', ' ', html)
        html = re.sub(r'&\w+;', ' ', html)
        text = re.sub(r'\s+', ' ', html).strip()

        if len(text) < 200:
            return {'error': 'Not enough text extracted. Please upload the file directly.', 'success': False}

        return {'text': text[:12000], 'profile_type': 'generic', 'success': True}

    except HTTPError as e:
        return {'error': f'HTTP {e.code}: {e.reason}. Please upload the file directly.', 'success': False}
    except Exception as e:
        return {'error': f'Failed to fetch URL: {str(e)}', 'success': False}


# ──────────────────────────────────────────────────────────────
# Vercel serverless handler
# ──────────────────────────────────────────────────────────────
class handler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        pass  # suppress noisy Vercel logs

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
            'version': '3.0',
            'scrapling_available': SCRAPLING_AVAILABLE,
            'features': ['linkedin_structured', 'stealth_fetch', 'direct_file_parse'],
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

            # Route to appropriate scraper
            if SCRAPLING_AVAILABLE:
                result = scrape_url(url)
            else:
                if needs_stealth(url):
                    result = {
                        'error': (
                            'Scrapling is not installed. Bot-protected sites like LinkedIn '
                            'cannot be fetched. Please upload your CV file directly.'
                        ),
                        'success': False,
                    }
                else:
                    result = scrape_url_fallback(url)

            status_code = 200 if result.get('success') else 400
            self._json(status_code, result)

        except json.JSONDecodeError:
            self._json(400, {'error': 'Invalid JSON', 'success': False})
        except Exception as e:
            self._json(500, {'error': f'Server error: {str(e)}', 'success': False})
