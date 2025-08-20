from fastapi import APIRouter, HTTPException
from ..models import APIResponse
from ..database import categories_collection
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=APIResponse)
async def get_categories():
    """Get all categories"""
    try:
        cursor = categories_collection.find({})
        categories = await cursor.to_list(length=100)
        
        # Remove MongoDB ObjectId from each category
        for category in categories:
            if "_id" in category:
                del category["_id"]
        
        return APIResponse(
            success=True,
            data={"categories": categories},
            total=len(categories)
        )
        
    except Exception as e:
        logger.error(f"Error getting categories: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving categories")