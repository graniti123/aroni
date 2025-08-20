import React, { useState } from 'react';
import { X, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    if (product.sizes.length > 1 && !selectedSize) {
      alert('Bitte wählen Sie eine Größe aus.');
      return;
    }
    
    onAddToCart(
      product, 
      product.sizes.length > 1 ? selectedSize : product.sizes[0],
      selectedColor || product.colors[0]
    );
    onClose();
  };

  const features = [
    { icon: Truck, text: 'Kostenlose Lieferung ab €50' },
    { icon: RotateCcw, text: '30 Tage Rückgaberecht' },
    { icon: Shield, text: '2 Jahre Garantie' }
  ];

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Produktdetails</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isOnSale && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                  Sale
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    €{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      €{product.originalPrice}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(127 Bewertungen)</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Farbe: {selectedColor && <span className="font-normal">{selectedColor}</span>}
              </label>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color
                        ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
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
            </div>

            {/* Size Selection */}
            {product.sizes.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Größe
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Größe auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white h-12"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  In den Warenkorb
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="px-4 h-12"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              
              <Button variant="outline" className="w-full" size="lg">
                Jetzt kaufen
              </Button>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm text-gray-600">
                  <feature.icon className="h-4 w-4" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;