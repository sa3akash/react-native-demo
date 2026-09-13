import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';
import { MainTabNavigator } from './MainTabNavigator';
import { navigationRef } from './NavigationService';
import { linkingConfig } from './linkingConfig';
import { LoginScreen } from '../features/auth/LoginScreen';
import { RegisterScreen, BiometricLockScreen } from '../features/auth/RegisterScreen';
import { CreatePostScreen } from '../features/post/CreatePostScreen';
import { StoryViewerScreen } from '../features/story/StoryViewerScreen';
import { LiveStreamScreen } from '../features/live/LiveStreamScreen';
import { CallScreen } from '../features/calls/CallScreen';
import { ChatRoomScreen } from '../features/messages/ChatRoomScreen';
import { NotificationScreen } from '../features/notifications/NotificationScreen';
import { SearchScreen } from '../features/search/SearchScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { GroupsScreen } from '../features/groups/GroupsScreen';
import { PagesScreen } from '../features/pages/PagesScreen';
import { EventsScreen } from '../features/events/EventsScreen';
import { CreatorStudioScreen } from '../features/creator/CreatorStudioScreen';
import { webRTCManager } from '../core/realtime/WebRTCManager';
import { StoryUser } from '../features/feed/StoryBar';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isBiometricLocked } = useAuthStore();

  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [activeStory, setActiveStory] = useState<{ storyUser: StoryUser; index: number } | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [activeChatConvId, setActiveChatConvId] = useState<string | null>(null);
  const [isCallingOpen, setIsCallingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Biometric lock gate
  if (isAuthenticated && isBiometricLocked) {
    return <BiometricLockScreen />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return <RegisterScreen onNavigateToLogin={() => setAuthScreen('login')} />;
    }
    return <LoginScreen onNavigateToRegister={() => setAuthScreen('register')} />;
  }

  // Active Story Viewer Overlay
  if (activeStory) {
    return (
      <StoryViewerScreen
        storyUser={activeStory.storyUser}
        onClose={() => setActiveStory(null)}
      />
    );
  }

  // Active Call Screen Overlay
  if (isCallingOpen) {
    return <CallScreen onClose={() => setIsCallingOpen(false)} />;
  }

  // Active Live Stream Overlay
  if (isLiveStreamOpen) {
    return <LiveStreamScreen onClose={() => setIsLiveStreamOpen(false)} />;
  }

  // Active Create Post Modal
  if (isCreatePostOpen) {
    return <CreatePostScreen onClose={() => setIsCreatePostOpen(false)} />;
  }

  // Active Chat Room Screen
  if (activeChatConvId) {
    return (
      <ChatRoomScreen
        conversationId={activeChatConvId}
        onBack={() => setActiveChatConvId(null)}
        onStartCall={(isVideo) => {
          webRTCManager.startCall({
            participant: {
              userId: 'usr_1',
              userName: 'Sarah Jenkins',
              avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            },
            isVideo,
          });
          setIsCallingOpen(true);
        }}
      />
    );
  }

  // Active Notification Screen
  if (isNotificationsOpen) {
    return (
      <NotificationScreen
        onNotificationPress={(notif) => {
          setIsNotificationsOpen(false);
        }}
      />
    );
  }

  // Active Search Screen
  if (isSearchOpen) {
    return (
      <SearchScreen
        onSelectUser={() => setIsSearchOpen(false)}
        onSelectGroup={() => {
          setIsSearchOpen(false);
          setIsGroupsOpen(true);
        }}
      />
    );
  }

  // Active Settings Screen
  if (isSettingsOpen) {
    return <SettingsScreen onBack={() => setIsSettingsOpen(false)} />;
  }

  // Active Groups Screen
  if (isGroupsOpen) {
    return <GroupsScreen />;
  }

  // Active Pages Screen
  if (isPagesOpen) {
    return <PagesScreen />;
  }

  // Active Events Screen
  if (isEventsOpen) {
    return <EventsScreen />;
  }

  // Active Creator Studio Screen
  if (isCreatorOpen) {
    return <CreatorStudioScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linkingConfig}>
      <MainTabNavigator
        onNavigateToStory={(storyUser, index) => setActiveStory({ storyUser, index })}
        onNavigateToCreatePost={() => setIsCreatePostOpen(true)}
        onNavigateToChat={(convId) => setActiveChatConvId(convId || 'conv_1')}
        onNavigateToNotifications={() => setIsNotificationsOpen(true)}
        onNavigateToProfile={() => {}}
        onNavigateToSettings={() => setIsSettingsOpen(true)}
        onStartCall={(isVideo) => {
          webRTCManager.startCall({
            participant: {
              userId: 'usr_1',
              userName: 'Sarah Jenkins',
              avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            },
            isVideo,
          });
          setIsCallingOpen(true);
        }}
      />
    </NavigationContainer>
  );
};
