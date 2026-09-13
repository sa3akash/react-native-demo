import { usePageStore } from '../src/store/usePageStore';

describe('Enterprise Pages & Analytics Suite', () => {
  beforeEach(() => {
    usePageStore.setState({
      selectedPageId: null,
    });
  });

  test('Creates Business, Creator, and Organization Pages with custom contact info', () => {
    // 1. Business page
    const bizId = usePageStore.getState().createPage({
      name: 'Cyberdyne Quantum AI Corp',
      description: 'Enterprise quantum computing and robotics hardware',
      category: 'Quantum Computing',
      pageType: 'business',
      website: 'https://cyberdyne-ai.io',
      email: 'invest@cyberdyne-ai.io',
      address: 'Silicon Valley, CA',
    });

    // 2. Creator page
    const creatorId = usePageStore.getState().createPage({
      name: 'Alex Rivera Studio',
      description: 'Designing high-performance cross-platform architectures',
      category: 'Software Architect & Designer',
      pageType: 'creator',
      website: 'https://alexrivera.dev',
    });

    // 3. Organization page
    const orgId = usePageStore.getState().createPage({
      name: 'Open Foundation for Distributed Robotics',
      description: 'Non-profit advancing open-source ROS robotics',
      category: 'Non-Profit Research',
      pageType: 'organization',
    });

    const pages = usePageStore.getState().pages;
    expect(pages.some((p) => p.id === bizId && p.pageType === 'business')).toBe(true);
    expect(pages.some((p) => p.id === creatorId && p.pageType === 'creator')).toBe(true);
    expect(pages.some((p) => p.id === orgId && p.pageType === 'organization')).toBe(true);
  });

  test('Toggles Follow/Unfollow and increments/decrements follower count', () => {
    const page = usePageStore.getState().pages[0];
    const initialFollowing = page.isFollowing;
    const initialFollowers = page.followersCount;

    usePageStore.getState().toggleFollowPage(page.id);
    let updated = usePageStore.getState().pages.find((p) => p.id === page.id);
    expect(updated?.isFollowing).toBe(!initialFollowing);
    expect(updated?.followersCount).toBe(initialFollowing ? initialFollowers - 1 : initialFollowers + 1);

    // Toggle back
    usePageStore.getState().toggleFollowPage(page.id);
    updated = usePageStore.getState().pages.find((p) => p.id === page.id);
    expect(updated?.isFollowing).toBe(initialFollowing);
    expect(updated?.followersCount).toBe(initialFollowers);
  });

  test('Publishes page posts to follower feeds', () => {
    const pageId = 'page_1';
    const initialPosts = usePageStore.getState().pages.find((p) => p.id === pageId)?.posts.length || 0;

    usePageStore.getState().createPagePost(pageId, 'Announcing our global developer ecosystem fund! 🚀', 'https://example.com/banner.png');
    const updated = usePageStore.getState().pages.find((p) => p.id === pageId);
    expect(updated?.posts.length).toBe(initialPosts + 1);
    expect(updated?.posts[0].content).toContain('developer ecosystem fund');
  });

  test('Inspects Page Analytics: Followers, Reach, and Engagement metrics', () => {
    const page = usePageStore.getState().pages.find((p) => p.id === 'page_1');
    expect(page).toBeDefined();

    const { analytics } = page!;
    expect(analytics.followers.total).toBeGreaterThan(0);
    expect(analytics.followers.growthRatePercent).toBeGreaterThan(0);
    expect(analytics.reach.totalReach).toBeGreaterThan(0);
    expect(analytics.reach.organicReach).toBeGreaterThan(0);
    expect(analytics.reach.impressions).toBeGreaterThan(0);
    expect(analytics.engagement.ratePercent).toBeGreaterThan(0);
    expect(analytics.engagement.totalLikes).toBeGreaterThan(0);
    expect(analytics.weeklyChart.length).toBe(7);
  });
});
