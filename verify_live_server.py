import urllib.request
import urllib.parse
import json
import http.cookiejar

base_url = "http://localhost:3000"

print("==================================================")
print("LIVE SERVER HTTP ENDPOINT VERIFICATION")
print("==================================================")

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def test_endpoint(url_path, expected_status=200, method="GET", data=None, headers=None):
    full_url = f"{base_url}{url_path}"
    req_headers = headers or {}
    post_data = None
    if data is not None:
        if isinstance(data, dict):
            post_data = json.dumps(data).encode("utf-8")
            req_headers["Content-Type"] = "application/json"
        else:
            post_data = data
            
    req = urllib.request.Request(full_url, data=post_data, headers=req_headers, method=method)
    try:
        resp = opener.open(req)
        status = resp.getcode()
        body = resp.read().decode("utf-8", errors="ignore")
        passed = (status == expected_status)
        print(f"[{'PASS' if passed else 'FAIL'}] {method} {url_path} -> Status {status} (Expected {expected_status})")
        return passed, status, body
    except urllib.error.HTTPError as e:
        status = e.code
        body = e.read().decode("utf-8", errors="ignore")
        passed = (status == expected_status)
        print(f"[{'PASS' if passed else 'FAIL'}] {method} {url_path} -> Status {status} (Expected {expected_status})")
        return passed, status, body
    except Exception as ex:
        print(f"[FAIL] {method} {url_path} -> Network Exception: {ex}")
        return False, 0, str(ex)

# Public Pages
test_endpoint("/", 200)
test_endpoint("/about", 200)
test_endpoint("/products", 200)
test_endpoint("/products/klub-velocity-pro-carbon", 200)
test_endpoint("/categories/marathon-shoes", 200)
test_endpoint("/manufacturing", 200)
test_endpoint("/contact", 200)
test_endpoint("/privacy-policy", 200)
test_endpoint("/sitemap.xml", 200)
test_endpoint("/robots.txt", 200)

# Public APIs
test_endpoint("/api/public/categories", 200)
test_endpoint("/api/public/products", 200)
test_endpoint("/api/public/products/klub-velocity-pro-carbon", 200)
test_endpoint("/api/public/products/non-existent-shoe", 404)
test_endpoint("/api/public/settings", 200)
test_endpoint("/api/public/pages/home", 200)

# Public Enquiry Submission
enquiry_payload = {
    "name": "Arun Verma",
    "companyName": "Delhi Sports Federation",
    "email": "arun.verma@delhisports.org",
    "phone": "+91 98111 22334",
    "message": "We need 500 pairs of Marathon Pro Carbon shoes for the upcoming state games.",
    "sourcePage": "/products/klub-velocity-pro-carbon",
    "honeypot": ""
}
test_endpoint("/api/public/enquiries", 200, method="POST", data=enquiry_payload)

# Security Tests: Admin API without Auth
test_endpoint("/api/admin/products", 401)
test_endpoint("/api/admin/categories", 401)
test_endpoint("/api/admin/dashboard", 401)
test_endpoint("/api/admin/enquiries", 401)
test_endpoint("/api/admin/settings", 401)

# Admin Login test with invalid credentials
test_endpoint("/api/admin/auth/login", 401, method="POST", data={"email": "admin@klubsports.com", "password": "wrongpassword"})

# Admin Login test with valid credentials
login_payload = {
    "email": "admin@klubsports.com",
    "password": "KlubSportsAdmin2026!Secure"
}
passed_login, _, login_body = test_endpoint("/api/admin/auth/login", 200, method="POST", data=login_payload)

token = None
try:
    login_data = json.loads(login_body)
    token = login_data.get("token")
except Exception:
    pass

auth_headers = {"Authorization": f"Bearer {token}"} if token else {}

# Test authenticated admin endpoints
test_endpoint("/api/admin/auth/me", 200, headers=auth_headers)
test_endpoint("/api/admin/dashboard", 200, headers=auth_headers)
test_endpoint("/api/admin/products", 200, headers=auth_headers)
test_endpoint("/api/admin/categories", 200, headers=auth_headers)
test_endpoint("/api/admin/enquiries", 200, headers=auth_headers)
test_endpoint("/api/admin/activity-logs", 200, headers=auth_headers)

print("\nAll live HTTP endpoint verifications completed.")
