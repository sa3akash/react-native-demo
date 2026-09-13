import { PaginatedResponse } from '../../../types';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly rating: number;
  readonly imageUrl: string;
  readonly description: string;
}

export const productApi = {
  getProducts: async (page = 1, pageSize = 10): Promise<PaginatedResponse<Product>> => {
    // Simulating API network latency
    await new Promise(res => setTimeout(res, 600));

    const items: Product[] = Array.from({ length: pageSize }, (_, i) => {
      const idx = (page - 1) * pageSize + i + 1;
      return {
        id: `prod_${idx}`,
        name: `Enterprise Solution Kit #${idx}`,
        category: idx % 2 === 0 ? 'Software' : 'Hardware',
        price: 299 + idx * 15,
        rating: 4.5 + (idx % 5) * 0.1,
        imageUrl: `https://images.unsplash.com/photo-1518770660439-4636190af475?w=300`,
        description: `High-performance module designed for scalability and enterprise cloud integration.`,
      };
    });

    return {
      items,
      total: 50,
      page,
      pageSize,
      totalPages: 5,
      hasNextPage: page < 5,
    };
  },
};
