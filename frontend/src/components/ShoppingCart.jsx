import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.product?.image || item.image}
          alt={item.product?.name || item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">
          {item.product?.name || item.name}
        </h4>
        <p className="text-sm text-gray-500">
          {item.selected_size && `Größe: ${item.selected_size}`}
          {item.selected_color && ` • ${item.selected_color}`}
        </p>
        <p className="font-semibold text-gray-900">
          €{(item.product?.price || item.price)}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0"
          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="text-red-500 hover:text-red-700 p-1"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ShoppingCart = ({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemove, 
  onCheckout 
}) => {
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Warenkorb
            <Badge variant="secondary">
              {totalItems} Artikel
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ihr Warenkorb ist leer</h3>
                <p className="text-gray-500 mb-4">Fügen Sie Artikel hinzu, um mit dem Einkaufen zu beginnen.</p>
                <Button onClick={onClose} className="w-full">
                  Weiter einkaufen
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-1">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`}>
                      <CartItem
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                      />
                      {index < cartItems.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Zwischensumme</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Versand</span>
                    <span>{shipping === 0 ? 'Kostenlos' : `€${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500">
                      Kostenloser Versand ab €50
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Gesamt</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800" 
                  size="lg"
                  onClick={onCheckout}
                >
                  Zur Kasse (€{total.toFixed(2)})
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={onClose}
                >
                  Weiter einkaufen
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;