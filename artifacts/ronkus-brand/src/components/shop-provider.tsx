import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getCartSubtotal,
  getCartItemKey,
  mergeCartItem,
  type CartItem,
  type CartItemDraft,
} from '@/lib/shop';

const CART_STORAGE_KEY = 'ronkus-brand-cart-v1';

type ShopContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (item: CartItemDraft) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

function isStoredCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return Boolean(
    typeof item.key === 'string'
    && typeof item.productId === 'string'
    && typeof item.name === 'string'
    && typeof item.image === 'string'
    && typeof item.category === 'string'
    && typeof item.basePrice === 'number'
    && Number.isFinite(item.basePrice)
    && typeof item.unitPrice === 'number'
    && Number.isFinite(item.unitPrice)
    && typeof item.quantity === 'number'
    && Number.isInteger(item.quantity)
    && item.quantity > 0
    && item.options
    && typeof item.options === 'object',
  );
}

function getInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredCartItem);
  } catch {
    return [];
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialCart);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The in-memory cart remains usable when browser storage is unavailable.
    }
  }, [items]);

  const addItem = useCallback((item: CartItemDraft) => {
    setItems((current) => mergeCartItem(current, item));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) => current
      .map((item) => item.key === key ? { ...item, quantity: Math.max(1, Math.floor(quantity)) } : item));
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<ShopContextValue>(() => ({
    items,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    subtotal: getCartSubtotal(items),
    cartOpen,
    setCartOpen,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  }), [items, cartOpen, addItem, setQuantity, removeItem, clearCart]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used inside ShopProvider.');
  }
  return context;
}

export { CART_STORAGE_KEY, getCartItemKey };
