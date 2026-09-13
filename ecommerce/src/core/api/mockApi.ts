import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ADDRESSES, MOCK_REVIEWS, MOCK_ORDERS, Product, Category, UserAddress, Review, Order } from "./mockData";
import { ProductId, OrderId, AddressId } from "../../shared/types/branded";
import { ApiResponse } from "./apiClient";

const delay = (ms: number = 300) => new Promise<void>((res) => setTimeout(() => res(), ms));

export const mockApi = {
  // PRODUCTS
  async getProducts(params?: { categoryId?: string; search?: string; brand?: string }): Promise<ApiResponse<Product[]>> {
    await delay(300);
    let items = [...MOCK_PRODUCTS];

    if (params?.categoryId) {
      items = items.filter((p) => p.categoryId === params.categoryId);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (params?.brand) {
      items = items.filter((p) => p.brand.toLowerCase() === params.brand?.toLowerCase());
    }

    return { success: true, data: items };
  },

  async getProductDetails(id: ProductId): Promise<ApiResponse<Product>> {
    await delay(250);
    const item = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0]!;
    return { success: true, data: item };
  },

  // CATEGORIES
  async getCategories(): Promise<ApiResponse<Category[]>> {
    await delay(200);
    return { success: true, data: MOCK_CATEGORIES };
  },

  // ADDRESSES
  async getAddresses(): Promise<ApiResponse<UserAddress[]>> {
    await delay(200);
    return { success: true, data: MOCK_ADDRESSES };
  },

  async addAddress(address: Omit<UserAddress, "id">): Promise<ApiResponse<UserAddress>> {
    await delay(300);
    const newAddr: UserAddress = {
      ...address,
      id: `addr_${Date.now()}` as AddressId,
    };
    MOCK_ADDRESSES.push(newAddr);
    return { success: true, data: newAddr };
  },

  // REVIEWS
  async getReviews(productId: ProductId): Promise<ApiResponse<Review[]>> {
    await delay(200);
    const reviews = MOCK_REVIEWS.filter((r) => r.productId === productId);
    return { success: true, data: reviews.length > 0 ? reviews : MOCK_REVIEWS };
  },

  // ORDERS
  async getOrders(): Promise<ApiResponse<Order[]>> {
    await delay(300);
    return { success: true, data: MOCK_ORDERS };
  },

  async getOrderDetails(orderId: OrderId): Promise<ApiResponse<Order>> {
    await delay(250);
    const order = MOCK_ORDERS.find((o) => o.id === orderId) || MOCK_ORDERS[0]!;
    return { success: true, data: order };
  },
};
