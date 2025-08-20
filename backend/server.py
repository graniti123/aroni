from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import routes
from routes.products import router as products_router
from routes.categories import router as categories_router
from routes.cart import router as cart_router
from routes.orders import router as orders_router
from routes.search import router as search_router

# Import database initialization
from database import initialize_database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="StyleHub API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "StyleHub API is running", "version": "1.0.0"}

# Health check for database
@api_router.get("/health")
async def health_check():
    try:
        # Test database connection
        await db.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "message": "API and database are running"
        }
    except Exception as e:
        return {
            "status": "error", 
            "database": "disconnected",
            "message": f"Database error: {str(e)}"
        }

# Include all route modules
api_router.include_router(products_router)
api_router.include_router(categories_router)
api_router.include_router(cart_router)
api_router.include_router(orders_router)
api_router.include_router(search_router)

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database with sample data on startup"""
    logger.info("🚀 Starting StyleHub API...")
    try:
        await initialize_database()
        logger.info("✅ StyleHub API started successfully")
    except Exception as e:
        logger.error(f"❌ Error during startup: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown"""
    logger.info("📴 Shutting down StyleHub API...")
    client.close()
    logger.info("✅ Database connection closed")