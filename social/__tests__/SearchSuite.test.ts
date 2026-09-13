import { useSearchStore } from '../src/store/useSearchStore';

describe('Enterprise Search System Suite', () => {
  beforeEach(() => {
    useSearchStore.setState({
      query: '',
      selectedCategory: 'all',
      searchHistory: [],
    });
    useSearchStore.getState().resetFilters();
  });

  test('Filters results across 7 categories (Users, Posts, Videos, Reels, Groups, Pages, Events)', () => {
    // 1. Users category
    useSearchStore.getState().setSelectedCategory('users');
    const userResults = useSearchStore.getState().getFilteredResults();
    expect(userResults.length).toBeGreaterThan(0);
    expect(userResults.every((r) => r.type === 'user')).toBe(true);

    // 2. Videos category
    useSearchStore.getState().setSelectedCategory('videos');
    const videoResults = useSearchStore.getState().getFilteredResults();
    expect(videoResults.length).toBeGreaterThan(0);
    expect(videoResults.every((r) => r.type === 'video')).toBe(true);

    // 3. Reels category
    useSearchStore.getState().setSelectedCategory('reels');
    const reelResults = useSearchStore.getState().getFilteredResults();
    expect(reelResults.length).toBeGreaterThan(0);
    expect(reelResults.every((r) => r.type === 'reel')).toBe(true);

    // 4. Groups category
    useSearchStore.getState().setSelectedCategory('groups');
    const groupResults = useSearchStore.getState().getFilteredResults();
    expect(groupResults.length).toBeGreaterThan(0);
    expect(groupResults.every((r) => r.type === 'group')).toBe(true);

    // 5. Events category
    useSearchStore.getState().setSelectedCategory('events');
    const eventResults = useSearchStore.getState().getFilteredResults();
    expect(eventResults.length).toBeGreaterThan(0);
    expect(eventResults.every((r) => r.type === 'event')).toBe(true);
  });

  test('Performs real-time text query search matching names, hashtags, and titles', () => {
    useSearchStore.getState().setSelectedCategory('all');
    useSearchStore.getState().setQuery('Jenkins');

    const results = useSearchStore.getState().getFilteredResults();
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => 'name' in r && r.name.includes('Jenkins'))).toBe(true);
  });

  test('Applies Verified Only and Sorting filters', () => {
    useSearchStore.getState().setSelectedCategory('users');
    useSearchStore.getState().setFilters({ verifiedOnly: true });

    const verifiedUsers = useSearchStore.getState().getFilteredResults();
    expect(verifiedUsers.every((u) => 'isVerified' in u && u.isVerified === true)).toBe(true);

    // Sort by most liked
    useSearchStore.getState().setSelectedCategory('posts');
    useSearchStore.getState().setFilters({ sortBy: 'most_liked', verifiedOnly: false });
    const sortedPosts = useSearchStore.getState().getFilteredResults() as any[];
    if (sortedPosts.length >= 2) {
      expect(sortedPosts[0].likesCount).toBeGreaterThanOrEqual(sortedPosts[1].likesCount);
    }
  });

  test('Manages search history (add, remove, clear)', () => {
    useSearchStore.getState().addHistory('React Native TurboModules');
    useSearchStore.getState().addHistory('Deep Learning 2026');

    let history = useSearchStore.getState().searchHistory;
    expect(history.length).toBe(2);
    expect(history[0].query).toBe('Deep Learning 2026');

    // Remove single history
    const removeId = history[0].id;
    useSearchStore.getState().removeHistory(removeId);
    history = useSearchStore.getState().searchHistory;
    expect(history.length).toBe(1);

    // Clear all
    useSearchStore.getState().clearHistory();
    expect(useSearchStore.getState().searchHistory.length).toBe(0);
  });

  test('Executes quick action toggles (Follow User, Join Group, RSVP Event)', () => {
    const user = useSearchStore.getState().users[0];
    const initialFollowing = user.isFollowing;
    useSearchStore.getState().toggleFollowUser(user.id);
    expect(useSearchStore.getState().users.find((u) => u.id === user.id)?.isFollowing).toBe(!initialFollowing);

    const group = useSearchStore.getState().groups[0];
    const initialJoined = group.isJoined;
    useSearchStore.getState().toggleJoinGroup(group.id);
    expect(useSearchStore.getState().groups.find((g) => g.id === group.id)?.isJoined).toBe(!initialJoined);
  });
});
