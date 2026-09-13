import { useMarketplaceStore } from '../src/store/useMarketplaceStore';
import { useChatStore } from '../src/store/useChatStore';

describe('Enterprise Marketplace Suite', () => {
  beforeEach(() => {
    useMarketplaceStore.setState({
      selectedProductId: null,
      searchQuery: '',
      wishlistIds: [],
    });
    useMarketplaceStore.getState().resetFilters();
  });

  test('Creates and lists new products for sale', () => {
    const prodId = useMarketplaceStore.getState().createListing({
      title: 'Meta Quest 3 512GB VR Headset',
      description: 'Mixed reality headset with Touch Plus controllers. Flawless condition.',
      price: 499,
      category: 'Electronics',
      condition: 'like_new',
      location: 'San Francisco, CA',
    });

    const products = useMarketplaceStore.getState().products;
    const created = products.find((p) => p.id === prodId);
    expect(created).toBeDefined();
    expect(created?.title).toBe('Meta Quest 3 512GB VR Headset');
    expect(created?.price).toBe(499);
    expect(created?.condition).toBe('like_new');
  });

  test('Filters products by search query, category, and price range', () => {
    // Category filter
    useMarketplaceStore.getState().setFilters({ category: 'Electronics' });
    let results = useMarketplaceStore.getState().getFilteredProducts();
    expect(results.every((p) => p.category === 'Electronics')).toBe(true);

    // Search query
    useMarketplaceStore.getState().setSearchQuery('MacBook');
    results = useMarketplaceStore.getState().getFilteredProducts();
    expect(results.some((p) => p.title.includes('MacBook'))).toBe(true);

    // Price range
    useMarketplaceStore.getState().setSearchQuery('');
    useMarketplaceStore.getState().setFilters({ category: 'all', minPrice: 1000, maxPrice: 3000 });
    results = useMarketplaceStore.getState().getFilteredProducts();
    expect(results.every((p) => p.price >= 1000 && p.price <= 3000)).toBe(true);
  });

  test('Manages Wishlist: toggle heart and filter wishlist items', () => {
    const prod = useMarketplaceStore.getState().products[0];

    // Add to wishlist
    useMarketplaceStore.getState().toggleWishlist(prod.id);
    expect(useMarketplaceStore.getState().wishlistIds).toContain(prod.id);

    // Filter by wishlist
    useMarketplaceStore.getState().setFilters({ category: 'wishlist' });
    const wishlistItems = useMarketplaceStore.getState().getFilteredProducts();
    expect(wishlistItems.some((p) => p.id === prod.id)).toBe(true);

    // Remove from wishlist
    useMarketplaceStore.getState().toggleWishlist(prod.id);
    expect(useMarketplaceStore.getState().wishlistIds).not.toContain(prod.id);
  });

  test('Sends seller inquiry and offer, creating a direct chat message', () => {
    const prod = useMarketplaceStore.getState().products[0];
    const initialConvs = useChatStore.getState().conversations.length;

    const convId = useMarketplaceStore
      .getState()
      .sendSellerInquiry(prod.id, 'Would you take $250 today?', 250);

    expect(convId).toBeDefined();
    expect(useChatStore.getState().conversations.length).toBe(initialConvs + 1);

    const conv = useChatStore.getState().conversations.find((c) => c.id === convId);
    expect(conv).toBeDefined();
    expect(conv?.lastMessage?.content).toContain('Offer: $250');
  });

  test('Marks product as sold and deletes listing', () => {
    const prod = useMarketplaceStore.getState().products[0];

    useMarketplaceStore.getState().markAsSold(prod.id);
    expect(useMarketplaceStore.getState().products.find((p) => p.id === prod.id)?.isSold).toBe(true);

    const countBefore = useMarketplaceStore.getState().products.length;
    useMarketplaceStore.getState().deleteListing(prod.id);
    expect(useMarketplaceStore.getState().products.length).toBe(countBefore - 1);
  });
});
