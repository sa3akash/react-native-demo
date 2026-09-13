import { useCallback } from 'react';
import { Share, ShareContent, ShareOptions } from 'react-native';
import { useToast } from '../components/molecules/Toast';

export interface AppShareContent {
  title?: string;
  message: string;
  url?: string;
}

export function useShare() {
  const { showToast } = useToast();

  const shareContent = useCallback(
    async (content: AppShareContent, options?: ShareOptions): Promise<boolean> => {
      try {
        const sharePayload: ShareContent = {
          message: content.url ? `${content.message} ${content.url}` : content.message,
          title: content.title,
          url: content.url,
        };

        const result = await Share.share(sharePayload, {
          dialogTitle: content.title || 'Share via SocialSphere',
          ...options,
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // Shared with specific activity type
            showToast({ message: 'Shared successfully!', type: 'success' });
          } else {
            showToast({ message: 'Shared successfully!', type: 'success' });
          }
          return true;
        } else if (result.action === Share.dismissedAction) {
          return false;
        }
        return false;
      } catch (error: any) {
        showToast({ message: error?.message || 'Could not open share sheet.', type: 'danger' });
        return false;
      }
    },
    [showToast]
  );

  const sharePost = useCallback(
    (post: { id: string; authorName: string; content: string }) => {
      return shareContent({
        title: `Post by ${post.authorName}`,
        message: `${post.authorName} on SocialSphere: "${post.content.slice(0, 100)}..."`,
        url: `https://socialsphere.enterprise/posts/${post.id}`,
      });
    },
    [shareContent]
  );

  const shareProfile = useCallback(
    (profile: { username: string; name: string }) => {
      return shareContent({
        title: `${profile.name}'s Profile`,
        message: `Connect with ${profile.name} (@${profile.username}) on SocialSphere!`,
        url: `https://socialsphere.enterprise/users/${profile.username}`,
      });
    },
    [shareContent]
  );

  return {
    shareContent,
    sharePost,
    shareProfile,
  };
}
