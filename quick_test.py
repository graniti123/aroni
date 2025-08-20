#!/usr/bin/env python3
import requests
import json

BASE_URL = "https://dress-store-1.preview.emergentagent.com/api"

def test_endpoint(endpoint, method="GET", data=None):
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10)
        
        print(f"{method} {endpoint}: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"  Success: {result.get('success', 'N/A')}")
        else:
            print(f"  Error: {response.text[:100]}")
        return response
    except Exception as e:
        print(f"{method} {endpoint}: ERROR - {e}")
        return None

print("=== Quick Backend Test ===")

# Test basic endpoints
test_endpoint("/")
test_endpoint("/health")
test_endpoint("/categories")

# Test products
response = test_endpoint("/products")
if response and response.status_code == 200:
    data = response.json()
    products = data.get('data', {}).get('products', [])
    if products:
        product_id = products[0]['id']
        print(f"Testing with product ID: {product_id}")
        test_endpoint(f"/products/{product_id}")

# Test search (this was failing)
print("\n=== Testing Search ===")
test_endpoint("/search?q=kleid")

# Test cart
print("\n=== Testing Cart ===")
cart_data = {
    "session_id": "test123",
    "product_id": "invalid-id",
    "selected_size": "M",
    "selected_color": "Black",
    "quantity": 1
}
test_endpoint("/cart", "POST", cart_data)