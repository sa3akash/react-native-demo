import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

/**
 * Universal & Deep Linking Configuration
 * Maps external web URLs and internal schemes to fully-typed app screens & parameters.
 */
export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'socialsphere://',
    'https://socialsphere.enterprise',
    'https://*.socialsphere.enterprise',
  ],
  config: {
    screens: {
      // Auth
      Login: 'login',
      Register: 'register',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password/:token',
      OtpVerification: 'verify-otp',

      // Main Tabs
      MainTabs: {
        screens: {
          HomeTab: 'feed',
          ReelsTab: 'reels',
          MarketplaceTab: 'marketplace',
          MessagesTab: 'messages',
          ProfileTab: 'me',
        },
      },

      // Feature Detail Screens
      PostDetails: 'posts/:postId',
      UserProfile: 'users/:username',
      ChatRoom: 'chat/:conversationId',
      Call: 'call/:callId',
      ReelDetails: 'reel/:reelId',
      StoryViewer: 'stories/:userId',
      GroupDetails: 'groups/:groupId',
      PageDetails: 'pages/:pageId',
      EventDetails: 'events/:eventId',
      ProductDetails: 'marketplace/item/:productId',
      LiveStream: 'live/:streamId',
      UniversalSearch: 'search',
      NotificationCenter: 'notifications',
      CreatorStudio: 'creator',
      Settings: 'settings',
    },
  },
};
