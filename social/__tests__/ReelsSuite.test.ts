import { useReelsStore } from '../src/store/useReelsStore';
import {
  ReelsScreen,
  ReelCommentsModal,
  ReelRemixModal,
  AudioLibraryModal,
  CreateReelScreen,
} from '../src/features/reels';

describe('Enterprise Reels System Suite', () => {
  beforeEach(() => {
    // Reset reels state
    useReelsStore.setState({
      activeReelIndex: 0,
      savedReels: ['reel_2'],
    });
  });

  test('All Reels screens and modals are properly defined and exportable', () => {
    expect(ReelsScreen).toBeDefined();
    expect(ReelCommentsModal).toBeDefined();
    expect(ReelRemixModal).toBeDefined();
    expect(AudioLibraryModal).toBeDefined();
    expect(CreateReelScreen).toBeDefined();
  });

  test('likeReel increments/decrements like counter and toggles state', () => {
    const reel = useReelsStore.getState().reels[0];
    const initialLikes = reel.likesCount;

    useReelsStore.getState().likeReel(reel.id);
    let updated = useReelsStore.getState().reels.find((r) => r.id === reel.id);
    expect(updated?.isLiked).toBe(true);
    expect(updated?.likesCount).toBe(initialLikes + 1);

    // Un-like
    useReelsStore.getState().likeReel(reel.id);
    updated = useReelsStore.getState().reels.find((r) => r.id === reel.id);
    expect(updated?.isLiked).toBe(false);
    expect(updated?.likesCount).toBe(initialLikes);
  });

  test('saveReel manages bookmarks collection', () => {
    const reel = useReelsStore.getState().reels[0];

    useReelsStore.getState().saveReel(reel.id);
    expect(useReelsStore.getState().savedReels.includes(reel.id)).toBe(true);

    useReelsStore.getState().saveReel(reel.id);
    expect(useReelsStore.getState().savedReels.includes(reel.id)).toBe(false);
  });

  test('toggleFollowCreator updates creator follow status across reels', () => {
    const creatorId = 'usr_3';
    useReelsStore.getState().toggleFollowCreator(creatorId);

    const match = useReelsStore.getState().reels.find((r) => r.creatorId === creatorId);
    expect(match?.isFollowing).toBe(true);
  });

  test('createReel adds a new high-resolution video reel with filters and audio track', () => {
    useReelsStore.getState().createReel({
      creatorId: 'usr_meta_998',
      creatorName: 'alex.rivera',
      creatorAvatar: 'https://example.com/avatar.jpg',
      description: 'Testing Reanimated 4 gesture physics! 🚀',
      videoUrl: 'https://example.com/video.mp4',
      videoThumbnail: 'https://example.com/thumb.jpg',
      songTitle: 'Synthwave Beats',
      songArtist: 'Kavinsky',
      songCoverUrl: 'https://example.com/cover.jpg',
      filter: 'cyberpunk',
      effect: 'speed_ramp',
    });

    const reels = useReelsStore.getState().reels;
    expect(reels[0].description).toContain('Testing Reanimated 4');
    expect(reels[0].filter).toBe('cyberpunk');
  });

  test('createRemix generates a split-screen duet linked to the original creator', () => {
    const original = useReelsStore.getState().reels[0];
    const initialRemixes = original.remixesCount;

    useReelsStore.getState().createRemix(original.id, {
      videoUrl: 'https://example.com/my_duet.mp4',
      description: 'Reacting to this design masterpiece!',
    });

    const reels = useReelsStore.getState().reels;
    const remix = reels[0];

    expect(remix.remixOf?.originalCreatorName).toBe(original.creatorName);
    expect(remix.remixOf?.originalReelId).toBe(original.id);

    const updatedOriginal = useReelsStore.getState().reels.find((r) => r.id === original.id);
    expect(updatedOriginal?.remixesCount).toBe(initialRemixes + 1);
  });

  test('AudioLibrary provides trending soundtrack tracks', () => {
    const library = useReelsStore.getState().audioLibrary;
    expect(library.length).toBeGreaterThan(0);
    expect(library.some((t) => t.isTrending)).toBe(true);
  });
});
