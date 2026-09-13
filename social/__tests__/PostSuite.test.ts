import { MediaUploadService, MediaFile } from '../src/core/media/MediaUploadService';
import { RichContentParser } from '../src/core/content/RichContentParser';
import {
  CreatePostScreen,
  LinkPreviewCard,
  GifPickerModal,
  StickerEmojiModal,
} from '../src/features/post';

describe('Enterprise Post Creation & Media Upload Suite', () => {
  test('All Post feature components are properly defined and exportable', () => {
    expect(CreatePostScreen).toBeDefined();
    expect(LinkPreviewCard).toBeDefined();
    expect(GifPickerModal).toBeDefined();
    expect(StickerEmojiModal).toBeDefined();
  });

  test('MediaUploadService compresses media files and computes reduction ratio', async () => {
    const dummyImage: MediaFile = {
      id: 'img_test_1',
      name: 'photo.png',
      uri: 'file://local/photo.png',
      type: 'image',
      sizeBytes: 5 * 1024 * 1024, // 5MB
    };

    const compressed = await MediaUploadService.compressMedia(dummyImage);
    expect(compressed.compressedSize).toBeLessThan(dummyImage.sizeBytes);
    expect(compressed.compressedSize).toBeGreaterThan(0);
  });

  test('MediaUploadService enqueues chunked upload and tracks progress to completion', async () => {
    const dummyVideo: MediaFile = {
      id: 'vid_test_1',
      name: 'clip.mp4',
      uri: 'file://local/clip.mp4',
      type: 'video',
      sizeBytes: 2.5 * 1024 * 1024, // 2.5MB (multiple 1MB chunks)
    };

    const progressValues: number[] = [];
    const task = await MediaUploadService.enqueueUpload(dummyVideo, (p) => {
      progressValues.push(p);
    });

    expect(task.id).toBeDefined();
    expect(task.totalChunks).toBeGreaterThanOrEqual(1);

    // Wait for chunk uploads to complete
    await new Promise((r) => setTimeout(() => r(undefined), 600));

    const completedTask = MediaUploadService.getTask(task.id);
    expect(completedTask?.status).toBe('completed');
    expect(completedTask?.progress).toBe(100);
    expect(completedTask?.remoteUrl).toBeDefined();
  });

  test('RichContentParser extracts hashtags, mentions, and OpenGraph link previews', () => {
    const rawText = 'Hey @alex.rivera and @sarah! Check out the new #ReactNative and #AI breakthrough on https://github.com/facebook/react-native';

    const hashtags = RichContentParser.extractHashtags(rawText);
    expect(hashtags).toContain('ReactNative');
    expect(hashtags).toContain('AI');

    const mentions = RichContentParser.extractMentions(rawText);
    expect(mentions).toContain('alex.rivera');
    expect(mentions).toContain('sarah');

    const preview = RichContentParser.extractLinkPreview(rawText);
    expect(preview).toBeDefined();
    expect(preview?.domain).toBe('github.com');
    expect(preview?.title).toContain('GitHub');
  });

  test('RichContentParser provides trending GIFs and Sticker packs', () => {
    const gifs = RichContentParser.getTrendingGifs();
    expect(gifs.length).toBeGreaterThan(0);
    expect(gifs[0].url).toBeDefined();

    const stickers = RichContentParser.getStickers();
    expect(stickers.length).toBeGreaterThan(0);
    expect(stickers[0].emoji).toBeDefined();
  });
});
