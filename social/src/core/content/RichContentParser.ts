export interface LinkPreviewMetadata {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  domain: string;
}

export interface GifItem {
  id: string;
  title: string;
  url: string;
  previewUrl: string;
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export class RichContentParser {
  /**
   * Extract all hashtags from text
   */
  public static extractHashtags(text: string): string[] {
    const matches = text.match(/#[a-zA-Z0-9_]+/g);
    return matches ? matches.map((t) => t.substring(1)) : [];
  }

  /**
   * Extract all mentions from text
   */
  public static extractMentions(text: string): string[] {
    const matches = text.match(/@[a-zA-Z0-9_.]+/g);
    return matches ? matches.map((m) => m.substring(1)) : [];
  }

  /**
   * Extract first URL from text and generate OpenGraph preview metadata
   */
  public static extractLinkPreview(text: string): LinkPreviewMetadata | null {
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) return null;

    const url = urlMatch[0];
    const domain = url.replace(/^https?:\/\//, '').split('/')[0];

    // Mock realistic OpenGraph metadata
    if (url.includes('github.com')) {
      return {
        url,
        title: 'GitHub - Open Source Repository',
        description: 'Where the world builds software. Millions of developers and companies build, ship, and maintain software on GitHub.',
        imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800',
        domain: 'github.com',
      };
    }

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return {
        url,
        title: 'YouTube Video Broadcast',
        description: 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.',
        imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
        domain: 'youtube.com',
      };
    }

    return {
      url,
      title: `${domain} - Official Portal`,
      description: `Explore the latest updates, developer articles, and insights from ${domain}.`,
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      domain,
    };
  }

  /**
   * Mock GIF catalog
   */
  public static getTrendingGifs(): GifItem[] {
    return [
      { id: 'gif_1', title: 'Celebrate Confetti', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', previewUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
      { id: 'gif_2', title: 'Coding Hacker', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', previewUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400' },
      { id: 'gif_3', title: 'Rocket Launch', url: 'https://images.unsplash.com/photo-1517976487507-5b3b4b45f958?w=400', previewUrl: 'https://images.unsplash.com/photo-1517976487507-5b3b4b45f958?w=400' },
      { id: 'gif_4', title: 'Thumbs Up Good Job', url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400', previewUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400' },
    ];
  }

  /**
   * Mock Sticker & Emoji catalog
   */
  public static getStickers(): StickerItem[] {
    return [
      { id: 'stk_1', name: 'Sparkles', emoji: '✨', category: 'Reactions' },
      { id: 'stk_2', name: 'Fire Flame', emoji: '🔥', category: 'Hype' },
      { id: 'stk_3', name: 'Mind Blown', emoji: '🤯', category: 'Reactions' },
      { id: 'stk_4', name: 'Party Popper', emoji: '🎉', category: 'Celebration' },
      { id: 'stk_5', name: 'Shield Security', emoji: '🛡️', category: 'Tech' },
      { id: 'stk_6', name: 'Rocket Ship', emoji: '🚀', category: 'Hype' },
      { id: 'stk_7', name: 'Heart Sparkle', emoji: '💖', category: 'Love' },
      { id: 'stk_8', name: 'Crown King', emoji: '👑', category: 'Status' },
    ];
  }
}

export const richContentParser = RichContentParser;
