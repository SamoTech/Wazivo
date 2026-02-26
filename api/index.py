from http.server import BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import re
from urllib.error import HTTPError, URLError

class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers()
    
    def do_GET(self):
        # Health check
        self._set_headers()
        response = {'status': 'ok', 'service': 'scrapling-lite'}
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self._set_headers(400)
                self.wfile.write(json.dumps({'error': 'Empty request body'}).encode('utf-8'))
                return
            
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            url = data.get('url')
            
            if not url:
                self._set_headers(400)
                self.wfile.write(json.dumps({'error': 'URL is required'}).encode('utf-8'))
                return
            
            # Fetch the URL
            req = urllib.request.Request(
                url,
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                }
            )
            
            with urllib.request.urlopen(req, timeout=15) as response:
                content = response.read().decode('utf-8', errors='ignore')
                
                # Extract text from HTML
                # Remove script and style tags
                content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)
                content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL | re.IGNORECASE)
                content = re.sub(r'<nav[^>]*>.*?</nav>', '', content, flags=re.DOTALL | re.IGNORECASE)
                content = re.sub(r'<footer[^>]*>.*?</footer>', '', content, flags=re.DOTALL | re.IGNORECASE)
                content = re.sub(r'<header[^>]*>.*?</header>', '', content, flags=re.DOTALL | re.IGNORECASE)
                
                # Remove all HTML tags
                content = re.sub(r'<[^>]+>', ' ', content)
                
                # Decode common HTML entities
                content = content.replace('&nbsp;', ' ')
                content = content.replace('&amp;', '&')
                content = content.replace('&lt;', '<')
                content = content.replace('&gt;', '>')
                content = content.replace('&quot;', '"')
                content = content.replace('&#39;', "'")
                
                # Normalize whitespace
                content = re.sub(r'\s+', ' ', content).strip()
                
                if len(content) < 200:
                    self._set_headers(400)
                    self.wfile.write(json.dumps({
                        'error': 'Insufficient text extracted (less than 200 characters)'
                    }).encode('utf-8'))
                    return
                
                # Return success response
                self._set_headers(200)
                response_data = {
                    'text': content[:10000],
                    'success': True
                }
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
                
        except HTTPError as e:
            self._set_headers(400)
            error_msg = f'HTTP {e.code}: {e.reason}'
            if e.code == 999:
                error_msg = 'Website blocked automated access (999). Try uploading the file directly.'
            elif e.code == 403:
                error_msg = 'Access denied (403). Try uploading the file directly.'
            self.wfile.write(json.dumps({'error': error_msg}).encode('utf-8'))
            
        except URLError as e:
            self._set_headers(400)
            self.wfile.write(json.dumps({'error': f'Network error: {str(e.reason)}'}).encode('utf-8'))
            
        except json.JSONDecodeError:
            self._set_headers(400)
            self.wfile.write(json.dumps({'error': 'Invalid JSON in request body'}).encode('utf-8'))
            
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({'error': f'Server error: {str(e)}'}).encode('utf-8'))
