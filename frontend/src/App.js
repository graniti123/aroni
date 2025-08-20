import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ShoppingCart from './components/ShoppingCart';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { categoriesAPI } from './services/api';
import { useToast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const { toast } = useToast();

  // Load products based on selected category
  const productFilters = selectedCategory 
    ? (selectedCategory === 'sale' ? { sale: true } : { category: selectedCategory })
    : { limit: 8 }; // Load featured products (first 8)
    
  const { products, loading: productsLoading, error: productsError } = useProducts(productFilters);
  
  // Cart management
  const {
    cartItems,
    cartSummary,
    loading: cartLoading,
    error: cartError,
    addToCart: addToCartAPI,
    updateCartItem,
    removeCartItem,
    clearCart
  } = useCart();

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getCategories();
        if (response.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  const addToCart = async (product, selectedSize = null, selectedColor = null) => {
    const size = selectedSize || (product.sizes.length > 0 ? product.sizes[0] : 'Einheitsgröße');
    const color = selectedColor || (product.colors.length > 0 ? product.colors[0] : 'Standard');
    
    const success = await addToCartAPI(product.id, size, color, 1);
    
    if (success) {
      toast({
        title: "Zum Warenkorb hinzugefügt",
        description: `${product.name} wurde erfolgreich hinzugefügt.`,
      });
    } else {
      toast({
        title: "Fehler",
        description: "Artikel konnte nicht hinzugefügt werden.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCartQuantity = async (itemId, newQuantity) => {
    const success = await updateCartItem(itemId, newQuantity);
    
    if (!success) {
      toast({
        title: "Fehler",
        description: "Artikel konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    const success = await removeCartItem(itemId);
    
    if (success) {
      toast({
        title: "Artikel entfernt",
        description: "Der Artikel wurde aus dem Warenkorb entfernt.",
      });
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCheckout = () => {
    toast({
      title: "Zur Kasse",
      description: "Checkout-Funktion wird implementiert...",
    });
  };

  const handleShopNowClick = () => {
    setSelectedCategory(null);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      <BrowserRouter>
        <Header 
          cartItems={cartItems}
          onCartClick={() => setIsCartOpen(true)}
          onCategoryClick={handleCategoryClick}
        />
        
        <main>
          <Hero onShopNowClick={handleShopNowClick} />
          
          <div id="products">
            <ProductGrid
              products={filteredProducts}
              onAddToCart={(product) => addToCart(product)}
              onProductClick={handleProductClick}
              title={
                selectedCategory === 'sale' ? 'Sale Artikel' :
                selectedCategory === 'damen' ? 'Damenmode' :
                selectedCategory === 'herren' ? 'Herrenmode' :
                selectedCategory === 'accessoires' ? 'Accessoires' :
                selectedCategory === 'schuhe' ? 'Schuhe' :
                'Beliebte Produkte'
              }
            />
          </div>
        </main>

        <Footer />

        <ShoppingCart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
          />
        )}

        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;