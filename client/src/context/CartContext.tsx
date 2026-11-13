import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { api } from '../services/api';

interface SellerCartGroup {
  sellerId: string;
  sellerName: string;
  sellerSlug: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  freeDeliveryThreshold?: number | null;
  estimatedDeliveryTime: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  estimatedDeliveryTotal: number;
  grandTotal: number;
  sellerGroups: SellerCartGroup[];
  deliveryPinCode: string;
  setDeliveryPinCode: (pin: string) => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  validateWithBackend: (pinCode?: string) => Promise<{
    allValid: boolean;
    items: any[];
    sellerSummaries: any[];
  }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'localroots_cart_v1';
const PIN_STORAGE_KEY = 'localroots_pin_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [deliveryPinCode, setDeliveryPinCodeState] = useState<string>(() => {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || '560038';
    } catch {
      return '560038';
    }
  });

  const setDeliveryPinCode = (pin: string) => {
    setDeliveryPinCodeState(pin);
    localStorage.setItem(PIN_STORAGE_KEY, pin);
  };

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock_quantity) }
            : i
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock_quantity) }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => {
        if (i.product.id === productId) {
          const max = i.product.stock_quantity || 99;
          return { ...i, quantity: Math.min(quantity, max) };
        }
        return i;
      })
    );
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Group cart items by seller for multi-vendor checkout
  const groupMap = new Map<string, SellerCartGroup>();

  items.forEach(item => {
    const sId = item.product.seller_id;
    const sName = item.product.seller?.business_name || 'Independent Artisan';
    const sSlug = item.product.seller?.slug || '';
    const defDelivery = item.product.seller?.default_delivery_charge ?? 40;
    const threshold = item.product.seller?.free_delivery_threshold;
    const estDelivery = item.product.seller?.estimated_delivery_time || '2-3 Days';

    if (!groupMap.has(sId)) {
      groupMap.set(sId, {
        sellerId: sId,
        sellerName: sName,
        sellerSlug: sSlug,
        items: [],
        subtotal: 0,
        deliveryCharge: defDelivery,
        freeDeliveryThreshold: threshold,
        estimatedDeliveryTime: estDelivery,
      });
    }

    const group = groupMap.get(sId)!;
    group.items.push(item);
    group.subtotal += item.product.price * item.quantity;

    // Free delivery check if subtotal reaches threshold
    if (group.freeDeliveryThreshold && group.subtotal >= group.freeDeliveryThreshold) {
      group.deliveryCharge = 0;
    } else {
      group.deliveryCharge = defDelivery;
    }
  });

  const sellerGroups = Array.from(groupMap.values());

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const estimatedDeliveryTotal = sellerGroups.reduce((sum, g) => sum + g.deliveryCharge, 0);
  const grandTotal = subtotal + estimatedDeliveryTotal;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Validate live stock and prices with backend
  const validateWithBackend = async (pin?: string) => {
    const pinToUse = pin || deliveryPinCode;
    const payloadItems = items.map(i => ({
      productId: i.product.id,
      quantity: i.quantity,
    }));
    const res = await api.validateCheckout(payloadItems, pinToUse);
    return res;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        estimatedDeliveryTotal,
        grandTotal,
        sellerGroups,
        deliveryPinCode,
        setDeliveryPinCode,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        validateWithBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
