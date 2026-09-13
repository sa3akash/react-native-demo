import { create } from "zustand";
import { Product, ProductVariant } from "../../../core/api/mockData";
import { ProductId, SellerId } from "../../../shared/types/branded";
import { Money, createMoney, addMoney, multiplyMoney, fromMajorUnits } from "../../../domain/pricing/money";

export interface CartItem {
  id: string; // unique key
  product: Product;
  selectedVariant?: ProductVariant | undefined;
  quantity: number;
  selected: boolean;
}

export interface SellerCartGroup {
  sellerId: SellerId;
  sellerName: string;
  items: CartItem[];
  subtotal: Money;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleSelection: (cartItemId: string) => void;
  toggleSelectAll: (select: boolean) => void;
  clearCart: () => void;
  getSellerGroups: () => SellerCartGroup[];
  getSelectedSubtotal: () => Money;
  getTaxEstimate: () => Money;
  getShippingEstimate: () => Money;
  getGrandTotal: () => Money;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    // Pre-populate with 1 mock item for seamless initial experience
    {
      id: "cart_item_1",
      product: {
        id: "prod_2" as ProductId,
        title: "Sony WH-1000XM5 Wireless Headphones",
        brand: "Sony",
        categoryId: "cat_1" as any,
        sellerId: "seller_sony" as SellerId,
        sellerName: "Sony Official Store",
        sellerRating: 4.8,
        rating: 4.7,
        reviewCount: 1890,
        price: fromMajorUnits(348.00),
        originalPrice: fromMajorUnits(399.99),
        discountPercentage: 13,
        isPrime: true,
        isDeal: true,
        stock: 120,
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
        description: "Sony Noise Canceling Headphones",
        highlights: ["Active Noise Cancelling"],
        specifications: {},
        warrantyInfo: "1 Year",
        returnPolicy: "14 Days",
        emiAvailable: true,
      },
      quantity: 1,
      selected: true,
    },
  ],

  addToCart: (product: Product, variant?: ProductVariant, quantity = 1) => {
    const itemId = `${product.id}_${variant?.id ?? "default"}`;
    const existingIndex = get().items.findIndex((i: CartItem) => i.id === itemId);

    if (existingIndex > -1) {
      const updated = [...get().items];
      const item = updated[existingIndex]!;
      updated[existingIndex] = {
        ...item,
        quantity: item.quantity + quantity,
      };
      set({ items: updated });
    } else {
      const newItem: CartItem = {
        id: itemId,
        product,
        selectedVariant: variant,
        quantity,
        selected: true,
      };
      set({ items: [...get().items, newItem] });
    }
  },

  removeFromCart: (cartItemId: string) => {
    set({ items: get().items.filter((i: CartItem) => i.id !== cartItemId) });
  },

  updateQuantity: (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }
    set({
      items: get().items.map((item: CartItem) => (item.id === cartItemId ? { ...item, quantity } : item)),
    });
  },

  toggleSelection: (cartItemId: string) => {
    set({
      items: get().items.map((item: CartItem) => (item.id === cartItemId ? { ...item, selected: !item.selected } : item)),
    });
  },

  toggleSelectAll: (select: boolean) => {
    set({ items: get().items.map((item: CartItem) => ({ ...item, selected: select })) });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getSellerGroups: () => {
    const items = get().items;
    const groupsMap = new Map<string, CartItem[]>();

    items.forEach((item: CartItem) => {
      const sId = item.product.sellerId;
      const list = groupsMap.get(sId) || [];
      list.push(item);
      groupsMap.set(sId, list);
    });

    const groups: SellerCartGroup[] = [];
    groupsMap.forEach((groupItems, sellerId) => {
      let groupSubtotal = createMoney(0);
      groupItems.forEach((item) => {
        const itemPrice = item.selectedVariant?.price ?? item.product.price;
        groupSubtotal = addMoney(groupSubtotal, multiplyMoney(itemPrice, item.quantity));
      });
      groups.push({
        sellerId: sellerId as SellerId,
        sellerName: groupItems[0]?.product.sellerName ?? "Amazon Seller",
        items: groupItems,
        subtotal: groupSubtotal,
      });
    });

    return groups;
  },

  getSelectedSubtotal: () => {
    const selectedItems = get().items.filter((i: CartItem) => i.selected);
    let subtotal = createMoney(0);
    selectedItems.forEach((item: CartItem) => {
      const price = item.selectedVariant?.price ?? item.product.price;
      subtotal = addMoney(subtotal, multiplyMoney(price, item.quantity));
    });
    return subtotal;
  },

  getTaxEstimate: () => {
    const subtotal = get().getSelectedSubtotal();
    return multiplyMoney(subtotal, 0.05); // 5% estimated tax
  },

  getShippingEstimate: () => {
    const selectedItems = get().items.filter((i: CartItem) => i.selected);
    if (selectedItems.length === 0) return createMoney(0);
    // Free shipping if all items Prime, else flat rate
    const allPrime = selectedItems.every((i: CartItem) => i.product.isPrime);
    return allPrime ? createMoney(0) : fromMajorUnits(5.99);
  },

  getGrandTotal: () => {
    const subtotal = get().getSelectedSubtotal();
    const tax = get().getTaxEstimate();
    const shipping = get().getShippingEstimate();
    return addMoney(addMoney(subtotal, tax), shipping);
  },
}));
