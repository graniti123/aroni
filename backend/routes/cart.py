from fastapi import APIRouter, HTTPException
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import CartItem, CartItemCreate, CartItemUpdate, APIResponse
from database import cart_items_collection, products_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cart", tags=["cart"])

@router.post("/", response_model=APIResponse)
async def add_to_cart(cart_item_data: CartItemCreate):
    """Add item to cart"""
    try:
        # Verify product exists
        product = await products_collection.find_one({"id": cart_item_data.product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if item already exists in cart
        existing_item = await cart_items_collection.find_one({
            "session_id": cart_item_data.session_id,
            "product_id": cart_item_data.product_id,
            "selected_size": cart_item_data.selected_size,
            "selected_color": cart_item_data.selected_color
        })
        
        if existing_item:
            # Update quantity of existing item
            new_quantity = existing_item["quantity"] + cart_item_data.quantity
            await cart_items_collection.update_one(
                {"id": existing_item["id"]},
                {"$set": {"quantity": new_quantity}}
            )
            
            updated_item = await cart_items_collection.find_one({"id": existing_item["id"]})
            if "_id" in updated_item:
                del updated_item["_id"]
                
            return APIResponse(
                success=True,
                data={"cart_item": updated_item},
                message="Cart item quantity updated"
            )
        else:
            # Create new cart item
            cart_item = CartItem(**cart_item_data.dict())
            result = await cart_items_collection.insert_one(cart_item.dict())
            
            return APIResponse(
                success=True,
                data={"cart_item": cart_item.dict()},
                message="Item added to cart successfully"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding to cart: {e}")
        raise HTTPException(status_code=500, detail="Error adding item to cart")

@router.get("/{session_id}", response_model=APIResponse)
async def get_cart(session_id: str):
    """Get cart items for a session"""
    try:
        # Get cart items
        cursor = cart_items_collection.find({"session_id": session_id})
        cart_items = await cursor.to_list(length=100)
        
        # Enrich cart items with product details
        enriched_items = []
        for item in cart_items:
            if "_id" in item:
                del item["_id"]
            
            # Get product details
            product = await products_collection.find_one({"id": item["product_id"]})
            if product:
                if "_id" in product:
                    del product["_id"]
                item["product"] = product
                enriched_items.append(item)
        
        # Calculate totals
        subtotal = sum(item["product"]["price"] * item["quantity"] for item in enriched_items)
        shipping = 0 if subtotal > 50 else 4.99
        total = subtotal + shipping
        
        return APIResponse(
            success=True,
            data={
                "cart_items": enriched_items,
                "subtotal": round(subtotal, 2),
                "shipping": shipping,
                "total": round(total, 2)
            },
            total=len(enriched_items)
        )
        
    except Exception as e:
        logger.error(f"Error getting cart for session {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving cart")

@router.put("/{session_id}/item/{item_id}", response_model=APIResponse)
async def update_cart_item(session_id: str, item_id: str, update_data: CartItemUpdate):
    """Update cart item quantity"""
    try:
        # Verify item belongs to session
        item = await cart_items_collection.find_one({
            "id": item_id,
            "session_id": session_id
        })
        
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        if update_data.quantity <= 0:
            # Remove item if quantity is 0 or less
            await cart_items_collection.delete_one({"id": item_id})
            return APIResponse(
                success=True,
                message="Item removed from cart"
            )
        else:
            # Update quantity
            await cart_items_collection.update_one(
                {"id": item_id},
                {"$set": {"quantity": update_data.quantity}}
            )
            
            updated_item = await cart_items_collection.find_one({"id": item_id})
            if "_id" in updated_item:
                del updated_item["_id"]
                
            return APIResponse(
                success=True,
                data={"cart_item": updated_item},
                message="Cart item updated successfully"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating cart item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Error updating cart item")

@router.delete("/{session_id}/item/{item_id}", response_model=APIResponse)
async def remove_cart_item(session_id: str, item_id: str):
    """Remove item from cart"""
    try:
        result = await cart_items_collection.delete_one({
            "id": item_id,
            "session_id": session_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Cart item not found")
        
        return APIResponse(
            success=True,
            message="Item removed from cart successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing cart item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Error removing cart item")

@router.delete("/{session_id}", response_model=APIResponse)
async def clear_cart(session_id: str):
    """Clear all items from cart"""
    try:
        result = await cart_items_collection.delete_many({"session_id": session_id})
        
        return APIResponse(
            success=True,
            message=f"Removed {result.deleted_count} items from cart"
        )
        
    except Exception as e:
        logger.error(f"Error clearing cart for session {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Error clearing cart")