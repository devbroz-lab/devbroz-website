"""Backend tests for DevBroz contact API, static SEO assets (robots, sitemap)."""
import os
import re
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://database-hub-9.preview.emergentagent.com').rstrip('/')


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Contact: happy path ----------
class TestContactHappyPath:
    def test_contact_post_valid_returns_sent(self, api_client):
        payload = {
            "name": "TEST Auto Tester",
            "business": "TEST Co",
            "email": "devbroz.info@gmail.com",  # sandbox-allowed recipient
            "details": "Automated test enquiry from backend test suite. Please ignore.",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, f"Unexpected: {r.status_code} {r.text}"
        body = r.json()
        assert body.get("status") == "sent", f"status not 'sent': {body}"
        assert isinstance(body.get("id"), str) and len(body["id"]) > 0


# ---------- Contact: validation ----------
class TestContactValidation:
    def test_missing_email_returns_422(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "X", "business": "Y", "details": "abc"
        }, timeout=15)
        assert r.status_code == 422

    def test_invalid_email_returns_422(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "X", "business": "Y", "email": "not-an-email", "details": "abc"
        }, timeout=15)
        assert r.status_code == 422

    def test_empty_name_returns_422(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "", "business": "Y", "email": "a@b.co", "details": "abc"
        }, timeout=15)
        assert r.status_code == 422

    def test_details_too_long_returns_422(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "X", "business": "Y", "email": "a@b.co", "details": "x" * 4001
        }, timeout=15)
        assert r.status_code == 422

    def test_empty_details_returns_422(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={
            "name": "X", "business": "Y", "email": "a@b.co", "details": ""
        }, timeout=15)
        assert r.status_code == 422


# ---------- Static SEO assets ----------
class TestSEOAssets:
    def test_robots_txt(self, api_client):
        r = api_client.get(f"{BASE_URL}/robots.txt", timeout=15)
        assert r.status_code == 200
        assert "Allow: /" in r.text
        assert "Sitemap:" in r.text

    def test_sitemap_xml(self, api_client):
        r = api_client.get(f"{BASE_URL}/sitemap.xml", timeout=15)
        assert r.status_code == 200
        body = r.text
        assert "<urlset" in body
        expected_paths = [
            "https://www.devbroz.com/",
            "/service/data-engineering",
            "/service/ai-ml",
            "/service/data-analytics",
            "/service/business-automation",
            "/service/custom-software",
            "/partners",
        ]
        for p in expected_paths:
            assert p in body, f"Missing URL in sitemap: {p}"
        # Count <url> entries = 7
        assert len(re.findall(r"<url>", body)) == 7

    def test_index_html_seo(self, api_client):
        r = api_client.get(f"{BASE_URL}/", timeout=15)
        assert r.status_code == 200
        body = r.text
        assert "<title>" in body and "DevBroz" in body
        assert re.search(r'<meta[^>]+name="description"[^>]+technology partner', body, re.I)
        assert re.search(r'<meta[^>]+property="og:title"', body)
        assert re.search(r'<meta[^>]+property="og:image"', body)
        assert re.search(r'<link[^>]+rel="canonical"', body)
        assert 'application/ld+json' in body
        assert '"@type": "Organization"' in body or '"@type":"Organization"' in body
