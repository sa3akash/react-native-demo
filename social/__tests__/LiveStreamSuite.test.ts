import { useLiveStreamStore, VIRTUAL_GIFT_CATALOG } from '../src/store/useLiveStreamStore';

describe('Enterprise Live Streaming Suite', () => {
  beforeEach(() => {
    useLiveStreamStore.getState().startStream({
      title: 'Distributed Systems & Mobile WebAssembly Live',
      category: 'Coding & Tech',
      resolution: '1080p_hd',
    });
  });

  test('Starts and ends live broadcast with configured resolution and title', () => {
    const stream = useLiveStreamStore.getState();
    expect(stream.isLive).toBe(true);
    expect(stream.title).toContain('Mobile WebAssembly');
    expect(stream.resolution).toBe('1080p_hd');

    useLiveStreamStore.getState().endStream();
    expect(useLiveStreamStore.getState().isLive).toBe(false);
  });

  test('Manages Multi-Guest Co-Hosting workflow up to 4 participants', () => {
    // Add guest join request
    useLiveStreamStore.getState().addGuestRequest({
      userId: 'usr_sarah',
      userName: 'Sarah Jenkins',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    });

    let pending = useLiveStreamStore.getState().pendingGuestRequests;
    expect(pending.length).toBeGreaterThan(0);
    const req = pending[0];

    // Accept guest
    useLiveStreamStore.getState().acceptGuestRequest(req.id);
    let coHosts = useLiveStreamStore.getState().coHosts;
    expect(coHosts.some((h) => h.id === 'usr_sarah')).toBe(true);

    // Mute co-host
    useLiveStreamStore.getState().toggleMuteCoHost('usr_sarah');
    coHosts = useLiveStreamStore.getState().coHosts;
    expect(coHosts.find((h) => h.id === 'usr_sarah')?.isMuted).toBe(true);

    // Remove co-host
    useLiveStreamStore.getState().removeCoHost('usr_sarah');
    coHosts = useLiveStreamStore.getState().coHosts;
    expect(coHosts.some((h) => h.id === 'usr_sarah')).toBe(false);
  });

  test('Handles real-time live chat, pinned comments, and blocked spam filtering', () => {
    // Send valid comment
    useLiveStreamStore.getState().sendComment('Zero-copy TurboModules are game changing! 🔥', 'David Chen');
    let comments = useLiveStreamStore.getState().comments;
    expect(comments.some((c) => c.text.includes('TurboModules'))).toBe(true);

    const commentId = comments[comments.length - 1].id;

    // Pin comment
    useLiveStreamStore.getState().pinComment(commentId);
    expect(useLiveStreamStore.getState().pinnedCommentId).toBe(commentId);

    // Unpin comment
    useLiveStreamStore.getState().unpinComment();
    expect(useLiveStreamStore.getState().pinnedCommentId).toBeNull();

    // Blocked spam filter
    useLiveStreamStore.getState().addBlockedWord('cryptoscam');
    const commentCountBefore = useLiveStreamStore.getState().comments.length;
    useLiveStreamStore.getState().sendComment('Check out my free cryptoscam tokens', 'Bot');
    expect(useLiveStreamStore.getState().comments.length).toBe(commentCountBefore);
  });

  test('Sends Virtual Gifts and increments stream coin revenue', () => {
    const gift = VIRTUAL_GIFT_CATALOG[2]; // Rocket (500 coins)
    const initialCoins = useLiveStreamStore.getState().totalCoins;

    useLiveStreamStore.getState().sendGift(gift.id, 'Marcus Vance');
    expect(useLiveStreamStore.getState().totalCoins).toBe(initialCoins + gift.coinPrice);

    const recentGifts = useLiveStreamStore.getState().recentGiftEvents;
    expect(recentGifts[0].giftName).toBe(gift.name);
    expect(recentGifts[0].coinValue).toBe(gift.coinPrice);
  });

  test('Applies stream moderation: toggle comments and mute users', () => {
    useLiveStreamStore.getState().toggleCommentsDisabled();
    expect(useLiveStreamStore.getState().isCommentsDisabled).toBe(true);

    const countBefore = useLiveStreamStore.getState().comments.length;
    useLiveStreamStore.getState().sendComment('Should not go through', 'Viewer');
    expect(useLiveStreamStore.getState().comments.length).toBe(countBefore);

    useLiveStreamStore.getState().muteUser('usr_troll');
    expect(useLiveStreamStore.getState().mutedUserIds).toContain('usr_troll');
  });
});
