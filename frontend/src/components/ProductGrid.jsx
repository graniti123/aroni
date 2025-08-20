import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleProductClick = () => {
    onProductClick(product);
  };

  return (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onClick={handleProductClick}
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
        )}

        {/* Sale Badge */}
        {product.isOnSale && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
            Sale
          </Badge>
        )}

        {/* Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white bg-opacity-90 hover:bg-opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className={`bg-white bg-opacity-90 hover:bg-opacity-100 ${
                isLiked ? 'text-red-500' : 'text-gray-700'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              €{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                €{product.originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: color === 'Weiß' ? '#fff' : 
                                   color === 'Schwarz' ? '#000' : 
                                   color === 'Grau' ? '#6b7280' : 
                                   color === 'Navy' ? '#1e3a8a' :
                                   color === 'Blau' ? '#3b82f6' :
                                   color === 'Grün' ? '#10b981' :
                                   color === 'Braun' ? '#92400e' :
                                   color === 'Gold' ? '#d97706' : '#6b7280'
                  }}
                  title={color}
                />
              ))}
            </div>

            <Button 
              size="sm" 
              className="bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Hinzufügen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductGrid = ({ products, onAddToCart, onProductClick, title = "Unsere Produkte" }) => {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="w-24 h-1 bg-gray-900 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Keine Produkte in dieser Kategorie gefunden.</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;