import { useQuery } from "@tanstack/react-query";
import { mockApi } from "../../core/api/mockApi";
import { ProductId, OrderId } from "../types/branded";

export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (filters?: { categoryId?: string; search?: string; brand?: string }) =>
      [...queryKeys.products.all, "list", filters] as const,
    detail: (id: ProductId) => [...queryKeys.products.all, "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  orders: {
    all: ["orders"] as const,
    detail: (id: OrderId) => [...queryKeys.orders.all, "detail", id] as const,
  },
  reviews: {
    byProduct: (id: ProductId) => ["reviews", id] as const,
  },
};

export const useProducts = (filters?: { categoryId?: string; search?: string; brand?: string }) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const res = await mockApi.getProducts(filters);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductDetails = (id: ProductId) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const res = await mockApi.getProductDetails(id);
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(id),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const res = await mockApi.getCategories();
      return res.data;
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: async () => {
      const res = await mockApi.getOrders();
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};
