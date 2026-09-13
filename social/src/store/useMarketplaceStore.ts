import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';
import { useChatStore } from './useChatStore';

export type ProductCondition = 'new' | 'like_new' | 'good' | 'fair';
export type ProductSortBy = 'featured' | 'price_low' | 'price_high' | 'recent';

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: ProductCondition;
  category: string;
  location: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerVerified: boolean;
  isSold: boolean;
  createdAt: string;
}

export interface MarketplaceFilters {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition | 'all';
  sortBy: ProductSortBy;
}

interface MarketplaceState {
  products: ProductItem[];
  wishlistIds: string[];
  searchQuery: string;
  filters: MarketplaceFilters;
  selectedProductId: string | null;

  setSelectedProductId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (partial: Partial<MarketplaceFilters>) => void;
  resetFilters: () => void;
  toggleWishlist: (productId: string) => void;
  createListing: (params: {
    title: string;
    description: string;
    price: number;
    currency?: string;
    condition: ProductCondition;
    category: string;
    location: string;
    images?: string[];
  }) => string;
  markAsSold: (productId: string) => void;
  deleteListing: (productId: string) => void;
  sendSellerInquiry: (productId: string, message: string, offerPrice?: number) => string;
  getFilteredProducts: () => ProductItem[];
}

const DEFAULT_FILTERS: MarketplaceFilters = {
  category: 'all',
  condition: 'all',
  sortBy: 'featured',
};

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_1',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation with 30-hour battery life. Barely used, comes in original box with all cables.',
    price: 299,
    currency: '$',
    condition: 'like_new',
    category: 'Electronics',
    location: 'San Francisco, CA',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    ],
    sellerId: 'usr_2',
    sellerName: 'David Chen',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    sellerRating: 4.9,
    sellerVerified: true,
    isSold: false,
    createdAt: '2h ago',
  },
  {
    id: 'prod_2',
    title: 'Apple MacBook Pro 16" M3 Max 64GB 1TB Space Black',
    description: '16-core CPU, 40-core GPU, 64GB unified memory. AppleCare+ valid until late 2027. Flawless condition with 100% battery health.',
    price: 2850,
    currency: '$',
    condition: 'like_new',
    category: 'Electronics',
    location: 'Palo Alto, CA',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    ],
    sellerId: 'usr_meta_998',
    sellerName: 'Alex Rivera',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    sellerRating: 5.0,
    sellerVerified: true,
    isSold: false,
    createdAt: '5h ago',
  },
  {
    id: 'prod_3',
    title: 'Herman Miller Embody Ergonomic Office Chair',
    description: 'Sync fabric in Black / Graphite frame. Fully adjustable arms, posturefit spinal support. Purchased 6 months ago.',
    price: 950,
    currency: '$',
    condition: 'good',
    category: 'Furniture',
    location: 'San Jose, CA',
    images: [
      'https://images.unsplash.com/photo-1580481077197-2a62d04a0808?w=800',
    ],
    sellerId: 'usr_3',
    sellerName: 'Elena Rostova',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    sellerRating: 4.8,
    sellerVerified: true,
    isSold: false,
    createdAt: '1d ago',
  },
  {
    id: 'prod_4',
    title: 'Canon EOS R5 Mirrorless Camera Body 8K RAW',
    description: '45MP Full-Frame sensor, IBIS image stabilization, dual card slots. 8,200 shutter count.',
    price: 2400,
    currency: '$',
    condition: 'like_new',
    category: 'Electronics',
    location: 'Oakland, CA',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    ],
    sellerId: 'usr_1',
    sellerName: 'Sarah Jenkins',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    sellerRating: 4.95,
    sellerVerified: true,
    isSold: false,
    createdAt: '2d ago',
  },
  {
    id: 'prod_5',
    title: 'Porsche Taycan 4S 2024 Frozen Blue Metallic',
    description: 'Performance Battery Plus, 21" Mission E Wheels, Premium Package, clean title with 4,500 miles.',
    price: 89000,
    currency: '$',
    condition: 'new',
    category: 'Vehicles',
    location: 'San Francisco, CA',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    ],
    sellerId: 'usr_2',
    sellerName: 'David Chen',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    sellerRating: 4.9,
    sellerVerified: true,
    isSold: false,
    createdAt: '3d ago',
  },
];

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      wishlistIds: ['prod_1'],
      searchQuery: '',
      filters: DEFAULT_FILTERS,
      selectedProductId: null,

      setSelectedProductId: (id) => set({ selectedProductId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilters: (partial) => set((s) => ({ filters: { ...s.filters, ...partial } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      toggleWishlist: (productId) => {
        set(
          produce((state: MarketplaceState) => {
            const index = state.wishlistIds.indexOf(productId);
            if (index > -1) {
              state.wishlistIds.splice(index, 1);
            } else {
              state.wishlistIds.push(productId);
            }
          })
        );
      },

      createListing: ({
        title,
        description,
        price,
        currency = '$',
        condition,
        category,
        location,
        images = ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      }) => {
        const id = `prod_${Date.now()}`;
        const newProd: ProductItem = {
          id,
          title,
          description,
          price,
          currency,
          condition,
          category,
          location,
          images,
          sellerId: 'usr_meta_998',
          sellerName: 'Alex Rivera',
          sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          sellerRating: 5.0,
          sellerVerified: true,
          isSold: false,
          createdAt: 'Just now',
        };

        set(
          produce((state: MarketplaceState) => {
            state.products.unshift(newProd);
          })
        );
        return id;
      },

      markAsSold: (productId) => {
        set(
          produce((state: MarketplaceState) => {
            const prod = state.products.find((p) => p.id === productId);
            if (prod) {
              prod.isSold = true;
            }
          })
        );
      },

      deleteListing: (productId) => {
        set(
          produce((state: MarketplaceState) => {
            state.products = state.products.filter((p) => p.id !== productId);
            state.wishlistIds = state.wishlistIds.filter((id) => id !== productId);
          })
        );
      },

      sendSellerInquiry: (productId, messageText, offerPrice) => {
        const product = get().products.find((p) => p.id === productId);
        if (!product) return '';

        const chatStore = useChatStore.getState();
        const convId = chatStore.createConversation({
          title: `${product.sellerName} (${product.title})`,
          type: 'direct',
          avatarUrl: product.sellerAvatar,
          participants: [
            {
              id: product.sellerId,
              name: product.sellerName,
              avatarUrl: product.sellerAvatar,
              role: 'member',
              isOnline: true,
            },
          ],
        });

        const inquiryContent = offerPrice
          ? `🏷️ Offer: $${offerPrice} for "${product.title}"\n${messageText}`
          : `🛍️ Inquiry for "${product.title}" ($${product.price})\n${messageText}`;

        chatStore.sendMessage({
          conversationId: convId,
          content: inquiryContent,
          type: 'text',
        });
        return convId;
      },

      getFilteredProducts: () => {
        const { products, searchQuery, filters, wishlistIds } = get();
        const q = searchQuery.toLowerCase().trim();

        let list = [...products];

        if (filters.category === 'wishlist') {
          list = list.filter((p) => wishlistIds.includes(p.id));
        } else if (filters.category !== 'all') {
          list = list.filter((p) => p.category.toLowerCase() === filters.category.toLowerCase());
        }

        if (filters.condition && filters.condition !== 'all') {
          list = list.filter((p) => p.condition === filters.condition);
        }

        if (filters.minPrice !== undefined) {
          list = list.filter((p) => p.price >= filters.minPrice!);
        }

        if (filters.maxPrice !== undefined) {
          list = list.filter((p) => p.price <= filters.maxPrice!);
        }

        if (q) {
          list = list.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.location.toLowerCase().includes(q)
          );
        }

        if (filters.sortBy === 'price_low') {
          list.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'price_high') {
          list.sort((a, b) => b.price - a.price);
        }

        return list;
      },
    }),
    {
      name: 'marketplace-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        products: state.products,
        wishlistIds: state.wishlistIds,
      }),
    }
  )
);
