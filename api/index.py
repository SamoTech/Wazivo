from http.server import BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import re
from urllib.error import HTTPError, URLError

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Read request body
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode('utf-8'))
            url = data.get('url')
            
            if not url:
                self.send_error(400, 'URL is required')
                return
            
            # Fetch the URL with better headers
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
                    raise ValueError('Insufficient text extracted')
                
                # Return response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                response_data = {
                    'text': content[:10000],
                    'success': True
                }
                
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
                
        except HTTPError as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_msg = f'HTTP {e.code}: {e.reason}. Try uploading the file directly.'
            self.wfile.write(json.dumps({'error': error_msg}).encode('utf-8'))
            
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_msg = f'Extraction failed: {str(e)}. Try uploading the file directly.'
            self.wfile.write(json.dumps({'error': error_msg}).encode('utf-8'))
    
    def do_GET(self):
        # Health check
        if self.path == '/api/scrapling/health' or self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok'}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
