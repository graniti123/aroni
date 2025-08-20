from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    original_price: Optional[float] = None
    description: str
    image: str
    category: str
    is_on_sale: bool = False
    sizes: List[str]
    colors: List[str]
    stock: int = 100
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    price: float
    original_price: Optional[float] = None
    description: str
    image: str
    category: str
    is_on_sale: bool = False
    sizes: List[str]
    colors: List[str]
    stock: int = 100

class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    icon: str

class CartItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    product_id: str
    selected_size: str
    selected_color: str
    quantity: int = 1
    added_at: datetime = Field(default_factory=datetime.utcnow)

class CartItemCreate(BaseModel):
    session_id: str
    product_id: str
    selected_size: str
    selected_color: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CustomerInfo(BaseModel):
    name: str
    email: str
    address: str
    phone: Optional[str] = None

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    items: List[dict]  # Will contain cart items with product details
    total_amount: float
    shipping_cost: float
    customer_info: CustomerInfo
    status: str = "pending"  # pending, processing, shipped, delivered
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    session_id: str
    customer_info: CustomerInfo

class APIResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
    total: Optional[int] = None