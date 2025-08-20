from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ..models import APIResponse
from ..database import products_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/search", tags=["search"])

@router.get("/", response_model=APIResponse)
async def search_products(
    q: str = Query(..., min_length=1, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    limit: int = Query(20, ge=1, le=100, description="Number of results to return"),
    offset: int = Query(0, ge=0, description="Number of results to skip")
):
    """Search products by name, description, and other criteria"""
    try:
        # Build search query
        search_conditions = []
        
        # Text search in name and description
        text_search = {
            "$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"description": {"$regex": q, "$options": "i"}},
                {"colors": {"$in": [{"$regex": q, "$options": "i"}]}},
                {"category": {"$regex": q, "$options": "i"}}
            ]
        }
        search_conditions.append(text_search)
        
        # Category filter
        if category:
            search_conditions.append({"category": category})
        
        # Price filters
        if min_price is not None or max_price is not None:
            price_filter = {}
            if min_price is not None:
                price_filter["$gte"] = min_price
            if max_price is not None:
                price_filter["$lte"] = max_price
            search_conditions.append({"price": price_filter})
        
        # Combine all conditions
        final_query = {"$and": search_conditions} if len(search_conditions) > 1 else search_conditions[0]
        
        # Get total count
        total = await products_collection.count_documents(final_query)
        
        # Execute search with pagination
        cursor = products_collection.find(final_query).skip(offset).limit(limit)
        products = await cursor.to_list(length=limit)
        
        # Remove MongoDB ObjectId
        for product in products:
            if "_id" in product:
                del product["_id"]
        
        return APIResponse(
            success=True,
            data={
                "products": products,
                "query": q,
                "filters": {
                    "category": category,
                    "min_price": min_price,
                    "max_price": max_price
                }
            },
            total=total
        )
        
    except Exception as e:
        logger.error(f"Error searching products with query '{q}': {e}")
        raise HTTPException(status_code=500, detail="Error performing search")

@router.get("/suggestions", response_model=APIResponse)
async def get_search_suggestions(
    q: str = Query(..., min_length=1, description="Partial search query"),
    limit: int = Query(5, ge=1, le=10, description="Number of suggestions")
):
    """Get search suggestions based on partial query"""
    try:
        # Search for product names that start with or contain the query
        query = {
            "$or": [
                {"name": {"$regex": f"^{q}", "$options": "i"}},
                {"name": {"$regex": q, "$options": "i"}},
                {"category": {"$regex": q, "$options": "i"}}
            ]
        }
        
        # Get unique product names and categories
        cursor = products_collection.find(query, {"name": 1, "category": 1}).limit(limit * 2)
        results = await cursor.to_list(length=limit * 2)
        
        suggestions = []
        seen = set()
        
        for item in results:
            if item["name"] not in seen:
                suggestions.append({
                    "text": item["name"],
                    "type": "product",
                    "category": item["category"]
                })
                seen.add(item["name"])
                
            if len(suggestions) >= limit:
                break
        
        return APIResponse(
            success=True,
            data={"suggestions": suggestions},
            total=len(suggestions)
        )
        
    except Exception as e:
        logger.error(f"Error getting search suggestions for '{q}': {e}")
        raise HTTPException(status_code=500, detail="Error getting search suggestions")