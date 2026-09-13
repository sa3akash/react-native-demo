import { navigationService } from './NavigationService';
import { StoryUser } from '../features/feed/StoryBar';
import { PostModel } from '../store/useFeedStore';
import { MainTabParamList } from './types';

/**
 * Domain-Driven Navigation Shortcuts
 * High-level shortcut methods for navigating across the entire application.
 */
export class NavigationShortcuts {
  /**
   * Open Direct or Group Chat Room
   */
  public static openChat(
    conversationId: string,
    recipientName?: string,
    recipientAvatar?: string
  ): void {
    navigationService.navigate('ChatRoom', {
      conversationId,
      recipientName,
      recipientAvatar,
    });
  }

  /**
   * Start 1:1 or Group Voice Call
   */
  public static startVoiceCall(
    participantId: string,
    participantName?: string,
    participantAvatar?: string
  ): void {
    navigationService.navigate('Call', {
      isVideo: false,
      participantId,
      participantName,
      participantAvatar,
    });
  }

  /**
   * Start 1:1 or Group Video Call
   */
  public static startVideoCall(
    participantId: string,
    participantName?: string,
    participantAvatar?: string
  ): void {
    navigationService.navigate('Call', {
      isVideo: true,
      participantId,
      participantName,
      participantAvatar,
    });
  }

  /**
   * Open Fullscreen Story Viewer
   */
  public static openStory(storyUser: StoryUser, initialIndex = 0): void {
    navigationService.navigate('StoryViewer', {
      storyUser,
      initialIndex,
    });
  }

  /**
   * Open Post Details / Thread
   */
  public static openPost(postId: string, post?: PostModel): void {
    navigationService.navigate('PostDetails', {
      postId,
      post,
    });
  }

  /**
   * Open User Profile
   */
  public static openProfile(userId: string, username?: string): void {
    navigationService.navigate('UserProfile', {
      userId,
      username,
    });
  }

  /**
   * Open Create Post Composer
   */
  public static openCreatePost(mediaType?: 'image' | 'video' | 'poll', initialText?: string): void {
    navigationService.navigate('CreatePost', {
      mediaType,
      initialText,
    });
  }

  /**
   * Open Live Stream Broadcaster or Viewer
   */
  public static openLiveStream(isHost = false, streamId?: string): void {
    navigationService.navigate('LiveStream', {
      isHost,
      streamId,
    });
  }

  /**
   * Open Group Details & Feed
   */
  public static openGroup(groupId: string, groupName?: string): void {
    navigationService.navigate('GroupDetails', {
      groupId,
      groupName,
    });
  }

  /**
   * Open Page Details & Feed
   */
  public static openPage(pageId: string, pageName?: string): void {
    navigationService.navigate('PageDetails', {
      pageId,
      pageName,
    });
  }

  /**
   * Open Marketplace Product Details
   */
  public static openProduct(productId: string, productTitle?: string): void {
    navigationService.navigate('ProductDetails', {
      productId,
      productTitle,
    });
  }

  /**
   * Open Event Details & RSVP
   */
  public static openEvent(eventId: string): void {
    navigationService.navigate('EventDetails', {
      eventId,
    });
  }

  /**
   * Open Universal Search with optional query & category
   */
  public static openSearch(initialQuery?: string, initialCategory?: string): void {
    navigationService.navigate('UniversalSearch', {
      initialQuery,
      initialCategory,
    });
  }

  /**
   * Open Notification Center
   */
  public static openNotifications(): void {
    navigationService.navigate('NotificationCenter');
  }

  /**
   * Open Settings Screen
   */
  public static openSettings(): void {
    navigationService.navigate('Settings');
  }

  /**
   * Open Creator Studio Dashboard
   */
  public static openCreatorStudio(): void {
    navigationService.navigate('CreatorStudio');
  }

  /**
   * Switch to a specific Bottom Tab
   */
  public static navigateToTab(tabName: keyof MainTabParamList): void {
    navigationService.navigate('MainTabs', {
      screen: tabName,
    } as any);
  }

  /**
   * Universal Back Navigation Shortcut
   */
  public static goBack(): void {
    navigationService.goBack();
  }
}
