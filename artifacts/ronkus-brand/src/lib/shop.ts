import type { Product } from '@/data/catalog';

export const whatsappBusinessNumber = '2348160309308';

export type CustomizationDetails = {
  type: string;
  instructions: string;
  fee: number;
};

export type ProductSelection = {
  size?: string;
  color?: string;
  yardage?: string;
};

export type CartItemDraft = {
  productId: string;
  name: string;
  image: string;
  category: string;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  options: ProductSelection & {
    customization?: CustomizationDetails;
  };
};

export type CartItem = CartItemDraft & {
  key: string;
};

export type CheckoutCustomer = {
  name: string;
  phone: string;
  address: string;
};

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getSelectedPrice(product: Product, selection: ProductSelection): number | undefined {
  if (product.options.yardage) {
    return product.options.yardage.find((option) => option.label === selection.yardage)?.price;
  }

  return product.price;
}

export function createCartItemDraft(
  product: Product,
  selection: ProductSelection,
  customization?: CustomizationDetails,
): CartItemDraft {
  if (product.options.sizes && (!selection.size || !product.options.sizes.includes(selection.size))) {
    throw new Error(`Select a size for ${product.name} before adding it to your cart.`);
  }
  if (product.options.colors && (!selection.color || !product.options.colors.includes(selection.color))) {
    throw new Error(`Select a colour for ${product.name} before adding it to your cart.`);
  }
  if (product.options.yardage && !product.options.yardage.some((option) => option.label === selection.yardage)) {
    throw new Error(`Select a yardage for ${product.name} before adding it to your cart.`);
  }
  if (customization && !product.customization?.enabled) {
    throw new Error(`${product.name} does not support customization.`);
  }

  const selectedPrice = getSelectedPrice(product, selection);
  if (selectedPrice === undefined) {
    throw new Error(`A valid price option is required for ${product.name}.`);
  }

  return {
    productId: product.id,
    name: product.name,
    image: product.image,
    category: product.category,
    basePrice: selectedPrice,
    unitPrice: selectedPrice + (customization?.fee ?? 0),
    quantity: 1,
    options: {
      ...(selection.size ? { size: selection.size } : {}),
      ...(selection.color ? { color: selection.color } : {}),
      ...(selection.yardage ? { yardage: selection.yardage } : {}),
      ...(customization ? { customization } : {}),
    },
  };
}

export function getCartItemKey(item: CartItemDraft): string {
  const customization = item.options.customization;
  return JSON.stringify({
    productId: item.productId,
    size: item.options.size ?? '',
    color: item.options.color ?? '',
    yardage: item.options.yardage ?? '',
    customizationType: customization?.type ?? '',
    customizationInstructions: customization?.instructions.trim() ?? '',
    customizationFee: customization?.fee ?? 0,
  });
}

export function mergeCartItem(items: CartItem[], draft: CartItemDraft): CartItem[] {
  const key = getCartItemKey(draft);
  const existing = items.find((item) => item.key === key);

  if (existing) {
    return items.map((item) => (
      item.key === key ? { ...item, quantity: item.quantity + draft.quantity } : item
    ));
  }

  return [...items, { ...draft, key }];
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

export function filterProducts(
  inventory: Product[],
  searchText: string,
  category: string,
): Product[] {
  const query = searchText.trim().toLocaleLowerCase();
  return inventory.filter((product) => {
    const matchesCategory = category === 'All categories' || product.category === category;
    const searchableText = `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase();
    return matchesCategory && (!query || searchableText.includes(query));
  });
}

export function buildWhatsAppMessage(
  customer: CheckoutCustomer,
  items: CartItem[],
  orderTotal: number,
): string {
  const orderLines = items.map((item, index) => {
    const details = [
      item.options.size ? `Size: ${item.options.size}` : '',
      item.options.color ? `Colour: ${item.options.color}` : '',
      item.options.yardage ? `Yardage: ${item.options.yardage}` : '',
    ].filter(Boolean);
    const customization = item.options.customization;
    const priceDetail = customization
      ? `${formatNaira(item.basePrice)} base + ${formatNaira(customization.fee)} customization per item`
      : `${formatNaira(item.unitPrice)} per item`;

    return [
      `${index + 1}. ${item.name} × ${item.quantity}`,
      ...details.map((detail) => `   ${detail}`),
      ...(customization
        ? [
            `   Customization type: ${customization.type}`,
            `   Instructions: ${customization.instructions}`,
            `   Customization fee: ${formatNaira(customization.fee)} per item`,
          ]
        : []),
      `   ${priceDetail}`,
      `   Line total: ${formatNaira(item.unitPrice * item.quantity)}`,
    ].join('\n');
  });

  return [
    'Hello The Ronkus Brand, I would like to place an order.',
    '',
    'CUSTOMER DETAILS',
    `Name: ${customer.name.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    `Delivery address: ${customer.address.trim()}`,
    '',
    'ORDER',
    ...orderLines,
    '',
    `Order total: ${formatNaira(orderTotal)}`,
    'Delivery fee, if applicable, will be confirmed separately.',
  ].join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${whatsappBusinessNumber}?text=${encodeURIComponent(message)}`;
}
