import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Typography, Badge } from '../shared/components';
import { HomeScreen } from '../features/feed/HomeScreen';
import { ReelsScreen } from '../features/reels/ReelsScreen';
import { MarketplaceScreen } from '../features/marketplace/MarketplaceScreen';
import { ChatListScreen } from '../features/messages/ChatListScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { useChatStore } from '../store/useChatStore';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC<{
  onNavigateToStory: (storyUser: any, index: number) => void;
  onNavigateToCreatePost: () => void;
  onNavigateToChat: (conversationId?: string) => void;
  onNavigateToNotifications: () => void;
  onNavigateToProfile: (userId?: string) => void;
  onNavigateToSettings: () => void;
  onStartCall: (isVideo: boolean) => void;
}> = ({
  onNavigateToStory,
  onNavigateToCreatePost,
  onNavigateToChat,
  onNavigateToNotifications,
  onNavigateToProfile,
  onNavigateToSettings,
  onStartCall,
}) => {
  const { colors, isDark } = useTheme();
  const { conversations } = useChatStore();

  const totalUnreadMessages = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSubtle,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Typography variant="body1" style={{ fontSize: 20 }}>
              {focused ? '🏠' : '🏚️'}
            </Typography>
          ),
        }}
      >
        {() => (
          <HomeScreen
            onNavigateToStory={onNavigateToStory}
            onNavigateToCreatePost={onNavigateToCreatePost}
            onNavigateToChat={() => onNavigateToChat()}
            onNavigateToNotifications={onNavigateToNotifications}
            onNavigateToProfile={onNavigateToProfile}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="ReelsTab"
        options={{
          tabBarLabel: 'Reels',
          tabBarIcon: ({ focused }) => (
            <Typography variant="body1" style={{ fontSize: 20 }}>
              {focused ? '🎬' : '🎞️'}
            </Typography>
          ),
        }}
      >
        {() => <ReelsScreen onProfilePress={onNavigateToProfile} />}
      </Tab.Screen>

      <Tab.Screen
        name="MarketplaceTab"
        options={{
          tabBarLabel: 'Market',
          tabBarIcon: ({ focused }) => (
            <Typography variant="body1" style={{ fontSize: 20 }}>
              {focused ? '🛍️' : '🛒'}
            </Typography>
          ),
        }}
      >
        {() => <MarketplaceScreen onChatSeller={(name: string) => onNavigateToChat()} />}
      </Tab.Screen>

      <Tab.Screen
        name="MessagesTab"
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconBadgeWrapper}>
              <Typography variant="body1" style={{ fontSize: 20 }}>
                {focused ? '💬' : '🗨️'}
              </Typography>
              {totalUnreadMessages > 0 && (
                <View style={styles.badgePos}>
                  <Badge count={totalUnreadMessages} variant="primary" />
                </View>
              )}
            </View>
          ),
        }}
      >
        {() => (
          <ChatListScreen
            onSelectConversation={(id) => onNavigateToChat(id)}
            onNewMessagePress={() => onNavigateToChat()}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="ProfileTab"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Typography variant="body1" style={{ fontSize: 20 }}>
              {focused ? '👤' : '👥'}
            </Typography>
          ),
        }}
      >
        {() => (
          <ProfileScreen
            onNavigateToSettings={onNavigateToSettings}
            onCommentPress={() => {}}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconBadgeWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePos: {
    position: 'absolute',
    top: -4,
    right: -10,
  },
});
