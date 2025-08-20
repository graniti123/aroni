#!/usr/bin/env python3
import requests
import json

BASE_URL = "https://dress-store-1.preview.emergentagent.com/api"

# First get a valid product ID
response = requests.get(f"{BASE_URL}/products", timeout=10)
if response.status_code == 200:
    data = response.json()
    products = data.get('data', {}).get('products', [])
    if products:
        product_id = products[0]['id']
        print(f"Using product ID: {product_id}")
        
        # Test cart with valid product
        cart_data = {
            "session_id": "test123",
            "product_id": product_id,
            "selected_size": "M",
            "selected_color": "Schwarz",
            "quantity": 1
        }
        
        print("Testing cart POST...")
        try:
            response = requests.post(f"{BASE_URL}/cart", json=cart_data, timeout=10)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text[:200]}")
        except Exception as e:
            print(f"Error: {e}")