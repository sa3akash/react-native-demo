import { useCartStore } from "../../src/features/cart/store/useCartStore";
import { Product } from "../../src/core/api/mockData";
import { ProductId, SellerId, CategoryId } from "../../src/shared/types/branded";
import { fromMajorUnits } from "../../src/domain/pricing/money";

const mockProductA: Product = {
  id: "prod_test_1" as ProductId,
  title: "Test Product A",
  brand: "Brand A",
  categoryId: "cat_1" as CategoryId,
  sellerId: "seller_1" as SellerId,
  sellerName: "Seller One",
  sellerRating: 4.8,
  rating: 4.5,
  reviewCount: 100,
  price: fromMajorUnits(50.00),
  originalPrice: fromMajorUnits(60.00),
  discountPercentage: 16,
  isPrime: true,
  isDeal: false,
  stock: 10,
  thumbnail: "https://example.com/a.jpg",
  images: [],
  description: "Test description A",
  highlights: [],
  specifications: {},
  warrantyInfo: "1 Year",
  returnPolicy: "30 Days",
  emiAvailable: false,
};

describe("Cart Store Domain Logic", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("should add products to cart and calculate subtotal", () => {
    const store = useCartStore.getState();
    store.addToCart(mockProductA, undefined, 2);

    const updatedState = useCartStore.getState();
    expect(updatedState.items.length).toBe(1);
    expect(updatedState.items[0]?.quantity).toBe(2);

    const subtotal = updatedState.getSelectedSubtotal();
    expect(subtotal.amount).toBe(10000); // $100.00 in minor units
  });

  it("should group items by seller correctly", () => {
    const store = useCartStore.getState();
    store.addToCart(mockProductA, undefined, 1);

    const groups = store.getSellerGroups();
    expect(groups.length).toBe(1);
    expect(groups[0]?.sellerName).toBe("Seller One");
    expect(groups[0]?.subtotal.amount).toBe(5000);
  });
});
