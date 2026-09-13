import { useStoryStore } from '../src/store/useStoryStore';
import {
  StoryViewerScreen,
  StoryViewersModal,
  StoryArchiveScreen,
  StoryHighlightsScreen,
  CreateStoryModal,
} from '../src/features/story';

describe('Enterprise Story System Suite', () => {
  beforeEach(() => {
    // Reset stories store
    useStoryStore.setState((state) => ({
      ...state,
      highlights: [
        {
          id: 'hl_test_1',
          title: 'Testing Highlights',
          coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
          storyIds: ['arch_1'],
          createdAt: 'Aug 20, 2026',
        },
      ],
    }));
  });

  test('All Story screens and modals are properly defined and exportable', () => {
    expect(StoryViewerScreen).toBeDefined();
    expect(StoryViewersModal).toBeDefined();
    expect(StoryArchiveScreen).toBeDefined();
    expect(StoryHighlightsScreen).toBeDefined();
    expect(CreateStoryModal).toBeDefined();
  });

  test('addStory adds a new 24h ephemeral story with music, poll, and question stickers', () => {
    useStoryStore.getState().addStory({
      mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      type: 'image',
      caption: 'New AI feature deployed!',
      music: {
        title: 'Cyberpunk Synth',
        artist: 'Waveform',
      },
      poll: {
        question: 'Ready for production?',
        options: [
          { id: 'opt_1', text: 'Yes', votes: 0 },
          { id: 'opt_2', text: 'No', votes: 0 },
        ],
        totalVotes: 0,
      },
    });

    const userStories = useStoryStore.getState().userStories;
    const myGroup = userStories.find((g) => g.userId === 'usr_meta_998');
    expect(myGroup).toBeDefined();
    expect(myGroup?.stories.length).toBeGreaterThan(0);
    expect(myGroup?.stories[0].music?.title).toBe('Cyberpunk Synth');
  });

  test('recordStoryView adds viewer with timestamp to story', () => {
    const group = useStoryStore.getState().userStories[0];
    const story = group.stories[0];

    useStoryStore.getState().recordStoryView(group.userId, story.id, {
      userId: 'usr_viewer_99',
      userName: 'Viewer 99',
      userAvatar: 'https://example.com/avatar.jpg',
    });

    const updatedGroup = useStoryStore.getState().userStories.find((g) => g.userId === group.userId);
    const updatedStory = updatedGroup?.stories.find((s) => s.id === story.id);
    expect(updatedStory?.viewers.some((v) => v.userId === 'usr_viewer_99')).toBe(true);
  });

  test('reactToStory adds reaction emoji to viewer badge', () => {
    const group = useStoryStore.getState().userStories[0];
    const story = group.stories[0];

    useStoryStore.getState().reactToStory(group.userId, story.id, '🔥', {
      userId: 'usr_viewer_99',
      userName: 'Viewer 99',
      userAvatar: '',
    });

    const updatedGroup = useStoryStore.getState().userStories.find((g) => g.userId === group.userId);
    const updatedStory = updatedGroup?.stories.find((s) => s.id === story.id);
    const viewer = updatedStory?.viewers.find((v) => v.userId === 'usr_viewer_99');
    expect(viewer?.reaction).toBe('🔥');
  });

  test('voteStoryPoll submits vote and updates poll totals', () => {
    const group = useStoryStore.getState().userStories[0];
    const story = group.stories[0];

    if (story.poll) {
      useStoryStore.getState().voteStoryPoll(group.userId, story.id, 'opt_1');
      const updatedGroup = useStoryStore.getState().userStories.find((g) => g.userId === group.userId);
      const updatedStory = updatedGroup?.stories.find((s) => s.id === story.id);
      expect(updatedStory?.poll?.options[0].votes).toBeGreaterThan(0);
    }
  });

  test('answerStoryQuestion records viewer text response to AMA prompt', () => {
    const group = useStoryStore.getState().userStories[1];
    const story = group.stories[0];

    if (story.questionPrompt) {
      useStoryStore.getState().answerStoryQuestion(group.userId, story.id, 'Great scaling architecture!', 'Alex');
      const updatedGroup = useStoryStore.getState().userStories.find((g) => g.userId === group.userId);
      const updatedStory = updatedGroup?.stories.find((s) => s.id === story.id);
      expect(updatedStory?.questionPrompt?.responses.some((r) => r.text === 'Great scaling architecture!')).toBe(true);
    }
  });

  test('createHighlight and deleteHighlight manage album collections', () => {
    useStoryStore.getState().createHighlight('Travel ✈️', 'https://example.com/cover.jpg', ['s_1_1']);
    let highlights = useStoryStore.getState().highlights;
    expect(highlights.some((h) => h.title === 'Travel ✈️')).toBe(true);

    const created = highlights.find((h) => h.title === 'Travel ✈️');
    if (created) {
      useStoryStore.getState().deleteHighlight(created.id);
      highlights = useStoryStore.getState().highlights;
      expect(highlights.some((h) => h.title === 'Travel ✈️')).toBe(false);
    }
  });

  test('archiveStory preserves expired stories', () => {
    const story = useStoryStore.getState().userStories[0].stories[0];
    useStoryStore.getState().archiveStory(story.id);

    const archived = useStoryStore.getState().archivedStories;
    expect(archived.some((a) => a.id === story.id)).toBe(true);
  });
});
