import type { NavigatorScreenParams, CompositeScreenProps, RouteProp } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabScreenProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StoryUser } from '../features/feed/StoryBar';
import { PostModel } from '../store/useFeedStore';

/**
 * Root Stack Parameter List
 */
export type RootStackParamList = {
  // Auth Flows
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string } | undefined;
  ResetPassword: { token: string; email: string };
  OtpVerification: { phoneOrEmail: string; type: 'login' | 'register' | '2fa' };
  BiometricLock: undefined;

  // Main Tab Navigation
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;

  // Modals & Detailed Feature Stacks
  PostDetails: { postId: string; post?: PostModel };
  CreatePost: { initialText?: string; mediaType?: 'image' | 'video' | 'poll' } | undefined;
  StoryViewer: { storyUser: StoryUser; initialIndex?: number };
  ReelDetails: { reelId: string; autoPlay?: boolean };
  ChatRoom: { conversationId: string; recipientName?: string; recipientAvatar?: string };
  Call: { isVideo: boolean; callId?: string; participantId?: string; participantName?: string; participantAvatar?: string };
  LiveStream: { streamId?: string; isHost?: boolean } | undefined;
  UserProfile: { userId: string; username?: string };
  EditProfile: undefined;
  GroupDetails: { groupId: string; groupName?: string };
  Groups: undefined;
  PageDetails: { pageId: string; pageName?: string };
  Pages: undefined;
  EventDetails: { eventId: string };
  Events: undefined;
  ProductDetails: { productId: string; productTitle?: string };
  Marketplace: undefined;
  CreatorStudio: undefined;
  NotificationCenter: undefined;
  UniversalSearch: { initialQuery?: string; initialCategory?: string } | undefined;
  Settings: undefined;
  ActiveSessions: undefined;
  PrivacySecurity: undefined;
  OfflineSyncManager: undefined;
};

/**
 * Bottom Tab Parameter List
 */
export type MainTabParamList = {
  HomeTab: undefined;
  ReelsTab: undefined;
  MarketplaceTab: undefined;
  MessagesTab: undefined;
  ProfileTab: undefined;
};

/**
 * Global React Navigation Typesafe Augmentation
 * Enables fully typed useNavigation() out of the box anywhere in the app!
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/**
 * Screen Props Helpers
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabNavScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AppRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
