#!/usr/bin/env python3
"""
StyleHub Fashion E-commerce Backend API Test Suite
Tests all backend endpoints systematically
"""

import requests
import json
import uuid
import time
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://dress-store-1.preview.emergentagent.com/api"
TIMEOUT = 30

class StyleHubAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        self.test_results = []
        self.session_id = str(uuid.uuid4())
        self.sample_product_id = None
        self.sample_cart_item_id = None
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "response_data": response_data
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def make_request(self, method: str, endpoint: str, **kwargs) -> Optional[requests.Response]:
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        # Ensure trailing slash for POST requests to avoid 307 redirects
        if method == "POST" and not endpoint.endswith('/'):
            url += '/'
        try:
            print(f"Making {method} request to: {url}")
            response = self.session.request(method, url, **kwargs)
            print(f"Response status: {response.status_code}")
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    def test_health_endpoints(self):
        """Test health check endpoints"""
        print("\n=== Testing Health Endpoints ===")
        
        # Test root endpoint
        response = self.make_request("GET", "/")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("message") == "StyleHub API is running":
                self.log_test("Root Endpoint", True, "API is running", data)
            else:
                self.log_test("Root Endpoint", False, f"Unexpected response: {data}")
        else:
            self.log_test("Root Endpoint", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test health endpoint
        response = self.make_request("GET", "/health")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("status") == "healthy" and data.get("database") == "connected":
                self.log_test("Health Check", True, "Database connected", data)
            else:
                self.log_test("Health Check", False, f"Health check failed: {data}")
        else:
            self.log_test("Health Check", False, f"Failed with status: {response.status_code if response else 'No response'}")
    
    def test_categories_api(self):
        """Test categories API"""
        print("\n=== Testing Categories API ===")
        
        response = self.make_request("GET", "/categories")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "categories" in data.get("data", {}):
                categories = data["data"]["categories"]
                expected_categories = ["Damen", "Herren", "Accessoires", "Schuhe"]
                category_names = [cat["name"] for cat in categories]
                
                if len(categories) == 4 and all(name in category_names for name in expected_categories):
                    self.log_test("Categories API", True, f"Found {len(categories)} categories: {category_names}", data)
                else:
                    self.log_test("Categories API", False, f"Expected 4 categories {expected_categories}, got {category_names}")
            else:
                self.log_test("Categories API", False, f"Invalid response format: {data}")
        else:
            self.log_test("Categories API", False, f"Failed with status: {response.status_code if response else 'No response'}")
    
    def test_products_api(self):
        """Test products API"""
        print("\n=== Testing Products API ===")
        
        # Test get all products
        response = self.make_request("GET", "/products")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "products" in data.get("data", {}):
                products = data["data"]["products"]
                if len(products) >= 8:
                    self.log_test("Get All Products", True, f"Found {len(products)} products", {"count": len(products)})
                    # Store a sample product ID for later tests
                    if products:
                        self.sample_product_id = products[0]["id"]
                else:
                    self.log_test("Get All Products", False, f"Expected at least 8 products, got {len(products)}")
            else:
                self.log_test("Get All Products", False, f"Invalid response format: {data}")
        else:
            self.log_test("Get All Products", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test category filter
        response = self.make_request("GET", "/products?category=damen")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                products = data["data"]["products"]
                damen_products = [p for p in products if p["category"] == "damen"]
                if len(damen_products) > 0:
                    self.log_test("Category Filter (damen)", True, f"Found {len(damen_products)} damen products")
                else:
                    self.log_test("Category Filter (damen)", False, "No damen products found")
            else:
                self.log_test("Category Filter (damen)", False, f"Request failed: {data}")
        else:
            self.log_test("Category Filter (damen)", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test sale filter
        response = self.make_request("GET", "/products?sale=true")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                products = data["data"]["products"]
                sale_products = [p for p in products if p.get("is_on_sale", False)]
                if len(sale_products) > 0:
                    self.log_test("Sale Filter", True, f"Found {len(sale_products)} sale products")
                else:
                    self.log_test("Sale Filter", False, "No sale products found")
            else:
                self.log_test("Sale Filter", False, f"Request failed: {data}")
        else:
            self.log_test("Sale Filter", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test specific product by ID
        if self.sample_product_id:
            response = self.make_request("GET", f"/products/{self.sample_product_id}")
            if response and response.status_code == 200:
                data = response.json()
                if data.get("success") and "product" in data.get("data", {}):
                    product = data["data"]["product"]
                    if product["id"] == self.sample_product_id:
                        self.log_test("Get Product by ID", True, f"Retrieved product: {product['name']}")
                    else:
                        self.log_test("Get Product by ID", False, "Product ID mismatch")
                else:
                    self.log_test("Get Product by ID", False, f"Invalid response format: {data}")
            else:
                self.log_test("Get Product by ID", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test invalid product ID (404 error)
        invalid_id = str(uuid.uuid4())
        response = self.make_request("GET", f"/products/{invalid_id}")
        if response and response.status_code == 404:
            self.log_test("Invalid Product ID (404)", True, "Correctly returned 404 for invalid product ID")
        else:
            self.log_test("Invalid Product ID (404)", False, f"Expected 404, got {response.status_code if response else 'No response'}")
    
    def test_cart_api(self):
        """Test cart API"""
        print("\n=== Testing Cart API ===")
        
        if not self.sample_product_id:
            self.log_test("Cart API Setup", False, "No sample product ID available for cart tests")
            return
        
        # Test add item to cart
        cart_data = {
            "session_id": self.session_id,
            "product_id": self.sample_product_id,
            "selected_size": "M",
            "selected_color": "Schwarz",
            "quantity": 2
        }
        
        response = self.make_request("POST", "/cart", json=cart_data)
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "cart_item" in data.get("data", {}):
                cart_item = data["data"]["cart_item"]
                self.sample_cart_item_id = cart_item["id"]
                self.log_test("Add to Cart", True, f"Added item to cart: {cart_item['id']}")
            else:
                self.log_test("Add to Cart", False, f"Invalid response format: {data}")
        else:
            self.log_test("Add to Cart", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test get cart items
        response = self.make_request("GET", f"/cart/{self.session_id}")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "cart_items" in data.get("data", {}):
                cart_items = data["data"]["cart_items"]
                if len(cart_items) > 0:
                    self.log_test("Get Cart Items", True, f"Retrieved {len(cart_items)} cart items")
                    # Verify totals are calculated
                    if "subtotal" in data["data"] and "total" in data["data"]:
                        self.log_test("Cart Totals", True, f"Subtotal: {data['data']['subtotal']}, Total: {data['data']['total']}")
                    else:
                        self.log_test("Cart Totals", False, "Missing subtotal or total in response")
                else:
                    self.log_test("Get Cart Items", False, "No cart items found")
            else:
                self.log_test("Get Cart Items", False, f"Invalid response format: {data}")
        else:
            self.log_test("Get Cart Items", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test update cart item quantity
        if self.sample_cart_item_id:
            update_data = {"quantity": 3}
            response = self.make_request("PUT", f"/cart/{self.session_id}/item/{self.sample_cart_item_id}", json=update_data)
            if response and response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Update Cart Item", True, "Successfully updated cart item quantity")
                else:
                    self.log_test("Update Cart Item", False, f"Update failed: {data}")
            else:
                self.log_test("Update Cart Item", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test remove cart item
        if self.sample_cart_item_id:
            response = self.make_request("DELETE", f"/cart/{self.session_id}/item/{self.sample_cart_item_id}")
            if response and response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_test("Remove Cart Item", True, "Successfully removed cart item")
                else:
                    self.log_test("Remove Cart Item", False, f"Remove failed: {data}")
            else:
                self.log_test("Remove Cart Item", False, f"Failed with status: {response.status_code if response else 'No response'}")
    
    def test_search_api(self):
        """Test search API"""
        print("\n=== Testing Search API ===")
        
        # Test product search
        response = self.make_request("GET", "/search?q=kleid")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "products" in data.get("data", {}):
                products = data["data"]["products"]
                self.log_test("Product Search", True, f"Found {len(products)} products for 'kleid'")
            else:
                self.log_test("Product Search", False, f"Invalid response format: {data}")
        else:
            self.log_test("Product Search", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test search suggestions
        response = self.make_request("GET", "/search/suggestions?q=som")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and "suggestions" in data.get("data", {}):
                suggestions = data["data"]["suggestions"]
                self.log_test("Search Suggestions", True, f"Found {len(suggestions)} suggestions for 'som'")
            else:
                self.log_test("Search Suggestions", False, f"Invalid response format: {data}")
        else:
            self.log_test("Search Suggestions", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test search with category filter
        response = self.make_request("GET", "/search?q=herren&category=herren")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                products = data["data"]["products"]
                self.log_test("Search with Category Filter", True, f"Found {len(products)} herren products")
            else:
                self.log_test("Search with Category Filter", False, f"Search failed: {data}")
        else:
            self.log_test("Search with Category Filter", False, f"Failed with status: {response.status_code if response else 'No response'}")
    
    def test_error_handling(self):
        """Test error handling"""
        print("\n=== Testing Error Handling ===")
        
        # Test invalid cart session (should return empty cart, not error)
        invalid_session = str(uuid.uuid4())
        response = self.make_request("GET", f"/cart/{invalid_session}")
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success") and len(data.get("data", {}).get("cart_items", [])) == 0:
                self.log_test("Invalid Cart Session", True, "Correctly returned empty cart for invalid session")
            else:
                self.log_test("Invalid Cart Session", False, f"Unexpected response: {data}")
        else:
            self.log_test("Invalid Cart Session", False, f"Failed with status: {response.status_code if response else 'No response'}")
        
        # Test invalid search query (empty query should fail)
        response = self.make_request("GET", "/search?q=")
        if response and response.status_code == 422:  # Validation error
            self.log_test("Invalid Search Query", True, "Correctly rejected empty search query")
        else:
            self.log_test("Invalid Search Query", False, f"Expected 422, got {response.status_code if response else 'No response'}")
        
        # Test invalid cart item data
        invalid_cart_data = {
            "session_id": self.session_id,
            "product_id": "invalid-product-id",
            "selected_size": "M",
            "selected_color": "Black",
            "quantity": 1
        }
        
        response = self.make_request("POST", "/cart", json=invalid_cart_data)
        if response and response.status_code == 404:
            self.log_test("Invalid Product in Cart", True, "Correctly rejected invalid product ID")
        else:
            self.log_test("Invalid Product in Cart", False, f"Expected 404, got {response.status_code if response else 'No response'}")
    
    def run_all_tests(self):
        """Run all test suites"""
        print(f"🚀 Starting StyleHub Backend API Tests")
        print(f"Base URL: {self.base_url}")
        print(f"Session ID: {self.session_id}")
        
        start_time = time.time()
        
        # Run all test suites
        self.test_health_endpoints()
        self.test_categories_api()
        self.test_products_api()
        self.test_cart_api()
        self.test_search_api()
        self.test_error_handling()
        
        end_time = time.time()
        
        # Summary
        print(f"\n{'='*60}")
        print("🏁 TEST SUMMARY")
        print(f"{'='*60}")
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⏱️  Duration: {end_time - start_time:.2f} seconds")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
        
        success_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return success_rate >= 80  # Consider 80%+ success rate as overall success

if __name__ == "__main__":
    tester = StyleHubAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 Backend API tests completed successfully!")
        exit(0)
    else:
        print("\n⚠️  Backend API tests completed with issues!")
        exit(1)