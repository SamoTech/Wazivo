from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from playwright.async_api import async_playwright
import asyncio
from typing import Optional

app = FastAPI(title="Wazivo Scrapling Service")

class ExtractRequest(BaseModel):
    url: HttpUrl
    mode: str = "auto"  # "fast" | "stealth" | "auto"

class ExtractResponse(BaseModel):
    text: str
    title: Optional[str] = None
    success: bool

async def extract_with_playwright(url: str, mode: str) -> tuple[str, str]:
    """Extract text from URL using Playwright for stealth web scraping"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            extra_http_headers={
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        )
        
        page = await context.new_page()
        
        try:
            # Navigate with network idle wait
            await page.goto(str(url), wait_until="networkidle", timeout=30000)
            
            # Wait for potential Cloudflare/bot detection
            await page.wait_for_timeout(3000)
            
            # Get title
            title = await page.title()
            
            # Extract main content text (Scrapling-style)
            content = await page.evaluate('''
                () => {
                    // Remove unwanted elements
                    const unwanted = ['script', 'style', 'nav', 'footer', 'header', 
                                    '.header', '.footer', '.nav', '.sidebar', 
                                    '[role="banner"]', '[role="navigation"]'];
                    
                    unwanted.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => el.remove());
                    });
                    
                    // Get main content
                    let text = Array.from(document.querySelectorAll('body *'))
                        .map(el => el.textContent || el.innerText || '')
                        .filter(text => text.trim().length > 0)
                        .join(' ')
                        .replace(/\\s+/g, ' ')
                        .trim();
                    
                    return text;
                }
            ''')
            
            return content, title
            
        finally:
            await browser.close()

@app.post("/extract-cv", response_model=ExtractResponse)
async def extract_cv(req: ExtractRequest):
    """Extract CV/resume text from URL using stealth browser automation"""
    try:
        content, title = await extract_with_playwright(str(req.url), req.mode)
        
        if len(content) < 200:
            raise ValueError("Insufficient meaningful text extracted")
        
        return ExtractResponse(
            text=content[:10000],  # Truncate for API limits
            title=title,
            success=True
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Extraction failed: {str(e)}. Try uploading the file directly."
        )

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "scrapling-playwright"}
