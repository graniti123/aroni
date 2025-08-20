# StyleHub - Backend Integration Contracts

## API Endpoints

### Products API
- **GET /api/products** - Alle Produkte abrufen
  - Query params: `category`, `sale`, `limit`, `offset`
- **GET /api/products/{id}** - Einzelnes Produkt abrufen  
- **POST /api/products** - Neues Produkt erstellen (Admin)
- **PUT /api/products/{id}** - Produkt aktualisieren (Admin)
- **DELETE /api/products/{id}** - Produkt löschen (Admin)

### Categories API  
- **GET /api/categories** - Alle Kategorien abrufen

### Cart/Orders API
- **POST /api/cart** - Artikel zum Warenkorb hinzufügen
- **GET /api/cart/{session_id}** - Warenkorb abrufen
- **PUT /api/cart/{session_id}/item/{item_id}** - Warenkorb-Artikel aktualisieren
- **DELETE /api/cart/{session_id}/item/{item_id}** - Artikel aus Warenkorb entfernen
- **POST /api/orders** - Bestellung aufgeben

### Search API
- **GET /api/search** - Produktsuche
  - Query params: `q`, `category`, `min_price`, `max_price`

## Data Models

### Product Model
```python
{
  "id": "string",
  "name": "string", 
  "price": "float",
  "original_price": "float (optional)",
  "description": "string",
  "image": "string (URL)",
  "category": "string",
  "is_on_sale": "boolean",
  "sizes": ["string"],
  "colors": ["string"],
  "stock": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Category Model
```python
{
  "id": "string",
  "name": "string",
  "slug": "string", 
  "icon": "string"
}
```

### Cart Item Model  
```python
{
  "id": "string",
  "session_id": "string",
  "product_id": "string", 
  "selected_size": "string",
  "selected_color": "string",
  "quantity": "integer",
  "added_at": "datetime"
}
```

### Order Model
```python
{
  "id": "string",
  "session_id": "string", 
  "items": [CartItem],
  "total_amount": "float",
  "shipping_cost": "float",
  "customer_info": {
    "name": "string",
    "email": "string", 
    "address": "string"
  },
  "status": "string", # pending, processing, shipped, delivered
  "created_at": "datetime"
}
```

## Mock Data Migration

### Zu ersetzen in Frontend:
- `mock.js` - Entfernen der Mock-Daten
- `App.js` - API-Aufrufe statt Mock-Daten verwenden
- `ProductGrid.jsx` - Laden von /api/products
- `Header.jsx` - Suchfunktion mit /api/search
- `ShoppingCart.jsx` - Session-basierte Warenkorb-API

### Backend Implementation:
1. **MongoDB Collections:**
   - products
   - categories  
   - cart_items
   - orders

2. **Session Management:**
   - Verwende Browser sessionStorage für Gast-Benutzer
   - Session-ID für Warenkorb-Persistierung

3. **API Response Format:**
```python
{
  "success": true,
  "data": {...},
  "message": "string (optional)",
  "total": "integer (für paginated results)"
}
```

## Frontend Integration Plan

### 1. API Service Layer
- Erstelle `/frontend/src/services/api.js`
- Zentrale Axios-Konfiguration
- Error handling

### 2. React Hooks
- `useProducts()` - Produkte laden/filtern
- `useCart()` - Warenkorb-Management  
- `useSearch()` - Suchfunktionalität

### 3. State Management
- React Context für globalen Zustand
- Lokale Zustandsverwaltung für UI

### 4. Data Flow
1. Frontend lädt Kategorien beim App-Start
2. Produktliste wird dynamisch basierend auf Kategorie geladen
3. Warenkorb wird session-basiert verwaltet
4. Suchfunktion nutzt Debouncing für Performance

## Testing Strategy
- Backend: Test alle API-Endpunkte mit verschiedenen Parametern
- Frontend: Test Produktladen, Kategoriefilterung, Warenkorb-Funktionen
- Integration: Test kompletter Bestellprozess

## Performance Optimierungen
- Produktbilder lazy loading
- API-Caching für Kategorien
- Pagination für Produktlisten
- Debounced Search