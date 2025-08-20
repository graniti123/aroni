import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ShoppingCart from './components/ShoppingCart';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import { products, featuredProducts } from './data/mock';
import { useToast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter(product => 
        selectedCategory === 'sale' 
          ? product.isOnSale 
          : product.category === selectedCategory
      )
    : featuredProducts;

  const addToCart = (product, selectedSize = null, selectedColor = null) => {
    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1,
      cartId: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`
    };

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, cartItem];
      }
    });

    toast({
      title: "Zum Warenkorb hinzugefügt",
      description: `${product.name} wurde erfolgreich hinzugefügt.`,
    });
  };

  const updateCartQuantity = (cartId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    toast({
      title: "Artikel entfernt",
      description: "Der Artikel wurde aus dem Warenkorb entfernt.",
    });
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