from motor.motor_asyncio import AsyncIOMotorClient
import os
from models import Product, Category

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
products_collection = db.products
categories_collection = db.categories
cart_items_collection = db.cart_items
orders_collection = db.orders

async def init_categories():
    """Initialize categories if they don't exist"""
    existing_categories = await categories_collection.count_documents({})
    
    if existing_categories == 0:
        categories = [
            Category(name='Damen', slug='damen', icon='user'),
            Category(name='Herren', slug='herren', icon='users'),
            Category(name='Accessoires', slug='accessoires', icon='shopping-bag'),
            Category(name='Schuhe', slug='schuhe', icon='footprints')
        ]
        
        categories_data = [cat.dict() for cat in categories]
        await categories_collection.insert_many(categories_data)
        print(f"✅ {len(categories)} Kategorien erstellt")

async def init_products():
    """Initialize sample products if they don't exist"""
    existing_products = await products_collection.count_documents({})
    
    if existing_products == 0:
        sample_products = [
            Product(
                name='Elegantes Sommerkleid',
                price=89.99,
                original_price=119.99,
                image='https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU1Njc0NzM3fDA&ixlib=rb-4.1.0&q=85',
                category='damen',
                is_on_sale=True,
                sizes=['XS', 'S', 'M', 'L', 'XL'],
                colors=['Weiß', 'Schwarz', 'Navy'],
                description='Leichtes Sommerkleid aus atmungsaktivem Stoff, perfekt für warme Tage.',
                stock=25
            ),
            Product(
                name='Herren Business Hemd',
                price=65.99,
                image='https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU1Njc0NzM3fDA&ixlib=rb-4.1.0&q=85',
                category='herren',
                is_on_sale=False,
                sizes=['S', 'M', 'L', 'XL', 'XXL'],
                colors=['Weiß', 'Blau', 'Grau'],
                description='Klassisches Business-Hemd aus hochwertiger Baumwolle.',
                stock=40
            ),
            Product(
                name='Designer Handtasche',
                price=149.99,
                image='https://images.unsplash.com/photo-1654707636800-a8f0acefaee9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGNhdGFsb2d8ZW58MHx8fHwxNzU1Njc0NzQyfDA&ixlib=rb-4.1.0&q=85',
                category='accessoires',
                is_on_sale=False,
                sizes=['Einheitsgröße'],
                colors=['Grün', 'Schwarz', 'Braun'],
                description='Elegante Handtasche aus echtem Leder mit praktischen Fächern.',
                stock=15
            ),
            Product(
                name='Sport Sneaker',
                price=95.99,
                original_price=125.99,
                image='https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcHJvZHVjdHN8ZW58MHx8fHwxNzU1Njc0NzQ4fDA&ixlib=rb-4.1.0&q=85',
                category='schuhe',
                is_on_sale=True,
                sizes=['36', '37', '38', '39', '40', '41', '42', '43', '44'],
                colors=['Weiß', 'Schwarz', 'Grau'],
                description='Bequeme Sneaker für Sport und Freizeit mit optimaler Dämpfung.',
                stock=30
            ),
            Product(
                name='Casual Jeans',
                price=79.99,
                image='https://images.unsplash.com/photo-1445205170230-053b83016050?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MHx8fHwxNzU1Njc0NzM3fDA&ixlib=rb-4.1.0&q=85',
                category='damen',
                is_on_sale=False,
                sizes=['25', '26', '27', '28', '29', '30', '31', '32'],
                colors=['Blue Denim', 'Black Denim', 'Light Wash'],
                description='Komfortable Jeans im klassischen Schnitt aus nachhaltiger Baumwolle.',
                stock=35
            ),
            Product(
                name='Luxus Sonnenbrille',
                price=189.99,
                image='https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwcHJvZHVjdHN8ZW58MHx8fHwxNzU1Njc0NzQ4fDA&ixlib=rb-4.1.0&q=85',
                category='accessoires',
                is_on_sale=False,
                sizes=['Einheitsgröße'],
                colors=['Schwarz', 'Braun', 'Gold'],
                description='Hochwertige Sonnenbrille mit UV-Schutz und polarisierten Gläsern.',
                stock=20
            ),
            Product(
                name='Wintermantel Damen',
                price=199.99,
                original_price=249.99,
                image='https://images.pexels.com/photos/33507998/pexels-photo-33507998.jpeg',
                category='damen',
                is_on_sale=True,
                sizes=['XS', 'S', 'M', 'L', 'XL'],
                colors=['Schwarz', 'Grau', 'Navy'],
                description='Warmer Wintermantel mit Daunen-Füllung für kalte Tage.',
                stock=18
            ),
            Product(
                name='Herren Pullover',
                price=55.99,
                image='https://images.pexels.com/photos/33507964/pexels-photo-33507964.jpeg',
                category='herren',
                is_on_sale=False,
                sizes=['S', 'M', 'L', 'XL', 'XXL'],
                colors=['Grau', 'Navy', 'Schwarz'],
                description='Kuscheliger Pullover aus weicher Wolle für gemütliche Stunden.',
                stock=45
            )
        ]
        
        products_data = [product.dict() for product in sample_products]
        await products_collection.insert_many(products_data)
        print(f"✅ {len(sample_products)} Produkte erstellt")

async def initialize_database():
    """Initialize all collections with sample data"""
    await init_categories()
    await init_products()
    print("✅ Datenbank initialisiert")