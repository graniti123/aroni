from fastapi import APIRouter, HTTPException
from ..models import Order, OrderCreate, APIResponse
from ..database import orders_collection, cart_items_collection, products_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=APIResponse)
async def create_order(order_data: OrderCreate):
    """Create a new order from cart items"""
    try:
        # Get cart items for the session
        cursor = cart_items_collection.find({"session_id": order_data.session_id})
        cart_items = await cursor.to_list(length=100)
        
        if not cart_items:
            raise HTTPException(status_code=400, detail="No items in cart")
        
        # Enrich cart items with product details and calculate total
        enriched_items = []
        subtotal = 0
        
        for item in cart_items:
            if "_id" in item:
                del item["_id"]
            
            # Get product details
            product = await products_collection.find_one({"id": item["product_id"]})
            if product:
                if "_id" in product:
                    del product["_id"]
                
                item["product"] = product
                item["price_at_time"] = product["price"]  # Store price at time of order
                enriched_items.append(item)
                subtotal += product["price"] * item["quantity"]
        
        # Calculate shipping
        shipping_cost = 0 if subtotal > 50 else 4.99
        total_amount = subtotal + shipping_cost
        
        # Create order
        order = Order(
            session_id=order_data.session_id,
            items=enriched_items,
            total_amount=round(total_amount, 2),
            shipping_cost=shipping_cost,
            customer_info=order_data.customer_info
        )
        
        # Save order
        result = await orders_collection.insert_one(order.dict())
        
        # Clear cart after successful order
        await cart_items_collection.delete_many({"session_id": order_data.session_id})
        
        return APIResponse(
            success=True,
            data={"order": order.dict()},
            message="Order created successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Error creating order")

@router.get("/{order_id}", response_model=APIResponse)
async def get_order(order_id: str):
    """Get order by ID"""
    try:
        order = await orders_collection.find_one({"id": order_id})
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if "_id" in order:
            del order["_id"]
            
        return APIResponse(
            success=True,
            data={"order": order}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting order {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving order")

@router.get("/session/{session_id}", response_model=APIResponse)
async def get_orders_by_session(session_id: str):
    """Get all orders for a session"""
    try:
        cursor = orders_collection.find({"session_id": session_id}).sort("created_at", -1)
        orders = await cursor.to_list(length=100)
        
        # Remove MongoDB ObjectId
        for order in orders:
            if "_id" in order:
                del order["_id"]
        
        return APIResponse(
            success=True,
            data={"orders": orders},
            total=len(orders)
        )
        
    except Exception as e:
        logger.error(f"Error getting orders for session {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving orders")