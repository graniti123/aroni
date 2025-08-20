from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import Product, ProductCreate, APIResponse
from database import products_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=APIResponse)
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    sale: Optional[bool] = Query(None, description="Filter sale items only"),
    limit: int = Query(50, ge=1, le=100, description="Number of products to return"),
    offset: int = Query(0, ge=0, description="Number of products to skip"),
    search: Optional[str] = Query(None, description="Search products by name")
):
    """Get all products with optional filtering"""
    try:
        # Build query
        query = {}
        
        if category:
            query["category"] = category
            
        if sale is True:
            query["is_on_sale"] = True
            
        if search:
            query["name"] = {"$regex": search, "$options": "i"}
        
        # Get total count for pagination
        total = await products_collection.count_documents(query)
        
        # Get products with pagination
        cursor = products_collection.find(query).skip(offset).limit(limit)
        products = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string for each product
        for product in products:
            if "_id" in product:
                del product["_id"]
        
        return APIResponse(
            success=True,
            data={"products": products},
            total=total
        )
        
    except Exception as e:
        logger.error(f"Error getting products: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving products")

@router.get("/{product_id}", response_model=APIResponse)
async def get_product(product_id: str):
    """Get a single product by ID"""
    try:
        product = await products_collection.find_one({"id": product_id})
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Remove MongoDB ObjectId
        if "_id" in product:
            del product["_id"]
            
        return APIResponse(
            success=True,
            data={"product": product}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting product {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving product")

@router.post("/", response_model=APIResponse)
async def create_product(product_data: ProductCreate):
    """Create a new product (Admin function)"""
    try:
        product = Product(**product_data.dict())
        
        # Check if product with same name already exists
        existing = await products_collection.find_one({"name": product.name})
        if existing:
            raise HTTPException(status_code=400, detail="Product with this name already exists")
        
        result = await products_collection.insert_one(product.dict())
        
        return APIResponse(
            success=True,
            data={"product": product.dict()},
            message="Product created successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating product: {e}")
        raise HTTPException(status_code=500, detail="Error creating product")

@router.put("/{product_id}", response_model=APIResponse)
async def update_product(product_id: str, product_data: ProductCreate):
    """Update an existing product (Admin function)"""
    try:
        # Check if product exists
        existing = await products_collection.find_one({"id": product_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Update product
        updated_data = product_data.dict()
        updated_data["updated_at"] = datetime.utcnow()
        
        await products_collection.update_one(
            {"id": product_id},
            {"$set": updated_data}
        )
        
        # Get updated product
        updated_product = await products_collection.find_one({"id": product_id})
        if "_id" in updated_product:
            del updated_product["_id"]
        
        return APIResponse(
            success=True,
            data={"product": updated_product},
            message="Product updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Error updating product")

@router.delete("/{product_id}", response_model=APIResponse)
async def delete_product(product_id: str):
    """Delete a product (Admin function)"""
    try:
        result = await products_collection.delete_one({"id": product_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return APIResponse(
            success=True,
            message="Product deleted successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Error deleting product")