import React, { useState, memo, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import {
  Typography,
  Avatar,
  Button,
  Tabs,
  Card,
  ImageViewer,
} from '../../shared/components';
import { useAuthStore } from '../../store/useAuthStore';
import { useFeedStore } from '../../store/useFeedStore';
import { PostCard } from '../feed/PostCard';
import { EditProfileScreen } from './EditProfileScreen';
import { PrivacySettingsScreen } from './PrivacySettingsScreen';
import { ModerationManagementScreen } from './ModerationManagementScreen';
import { useToast } from '../../shared/components/molecules/Toast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ProfileScreenProps {
  onNavigateToSettings?: () => void;
  onCommentPress?: (postId: string) => void;
}

const ProfileScreenComponent: React.FC<ProfileScreenProps> = ({
  onNavigateToSettings,
  onCommentPress,
}) => {
  const { colors, theme } = useTheme();
  const { user } = useAuthStore();
  const { posts } = useFeedStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('posts');
  const [currentView, setCurrentView] = useState<'profile' | 'edit' | 'privacy' | 'moderation'>('profile');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const profileTabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'experience', label: 'Experience' },
    { id: 'about', label: 'About & Links' },
    { id: 'photos', label: 'Photos' },
  ];

  const userPosts = useMemo(
    () => posts.filter((p) => p.authorId === (user?.id || 'usr_meta_998')),
    [posts, user?.id]
  );

  const handleOpenLink = (url?: string) => {
    if (!url) return;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else showToast({ message: `Cannot open URL: ${url}`, type: 'warning' });
    });
  };

  if (currentView === 'edit') {
    return <EditProfileScreen onBack={() => setCurrentView('profile')} />;
  }

  if (currentView === 'privacy') {
    return <PrivacySettingsScreen onBack={() => setCurrentView('profile')} />;
  }

  if (currentView === 'moderation') {
    return <ModerationManagementScreen onBack={() => setCurrentView('profile')} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Profile Header Bar */}
      <View style={[styles.navBar, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <Typography variant="h4" color={colors.text} bold>
          {user?.username ? `@${user.username}` : 'Profile'}
        </Typography>
        <View style={styles.navActions}>
          <TouchableOpacity
            onPress={() => setCurrentView('privacy')}
            style={styles.navIconBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Privacy settings"
          >
            <Typography variant="body1">🛡️</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentView('moderation')}
            style={styles.navIconBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Blocked and restricted users"
          >
            <Typography variant="body1">🚫</Typography>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNavigateToSettings}
            style={styles.navIconBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Typography variant="body1">⚙️</Typography>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cover Photo */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setPreviewImage(user?.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200')}
          style={styles.coverContainer}
        >
          <Image
            source={{ uri: user?.coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200' }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Profile Info Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setPreviewImage(user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400')}
            >
              <Avatar
                uri={user?.avatarUrl}
                name={user?.name || 'Alex'}
                size="xl"
                hasStory
                isOnline
              />
            </TouchableOpacity>
            <View style={styles.editBtnGroup}>
              <Button
                label="Edit Profile"
                variant="outline"
                size="sm"
                onPress={() => setCurrentView('edit')}
              />
              <Button
                label="Share"
                variant="secondary"
                size="sm"
                onPress={() => showToast({ message: 'Profile link copied to clipboard! 📋', type: 'success' })}
              />
            </View>
          </View>

          {/* Name & Headline */}
          <View style={styles.nameBlock}>
            <View style={styles.nameRow}>
              <Typography variant="h3" color={colors.text} bold>
                {user?.name || 'Alex Rivera'}
              </Typography>
              {user?.isVerified && (
                <Typography variant="body1" color={colors.primary} style={styles.verifiedIcon}>
                  ✓
                </Typography>
              )}
            </View>
            {user?.headline && (
              <Typography variant="body2" color={colors.primary} bold style={styles.headline}>
                {user.headline}
              </Typography>
            )}
            {user?.location && (
              <Typography variant="caption" color={colors.textSecondary} style={styles.locationText}>
                📍 {user.location}
              </Typography>
            )}
          </View>

          {/* Bio */}
          {user?.bio && (
            <Typography variant="body2" color={colors.text} style={styles.bioText}>
              {user.bio}
            </Typography>
          )}

          {/* Social Links Quick Badges */}
          {user?.socialLinks && (
            <View style={styles.socialChipsRow}>
              {user.socialLinks.github && (
                <TouchableOpacity onPress={() => handleOpenLink(user?.socialLinks?.github)} style={[styles.socialChip, { backgroundColor: colors.inputBg }]}>
                  <Typography variant="caption" color={colors.text} bold>🐙 GitHub</Typography>
                </TouchableOpacity>
              )}
              {user.socialLinks.twitter && (
                <TouchableOpacity onPress={() => handleOpenLink(user?.socialLinks?.twitter)} style={[styles.socialChip, { backgroundColor: colors.inputBg }]}>
                  <Typography variant="caption" color={colors.text} bold>🐦 Twitter/X</Typography>
                </TouchableOpacity>
              )}
              {user.socialLinks.linkedin && (
                <TouchableOpacity onPress={() => handleOpenLink(user?.socialLinks?.linkedin)} style={[styles.socialChip, { backgroundColor: colors.inputBg }]}>
                  <Typography variant="caption" color={colors.text} bold>💼 LinkedIn</Typography>
                </TouchableOpacity>
              )}
              {user.socialLinks.youtube && (
                <TouchableOpacity onPress={() => handleOpenLink(user?.socialLinks?.youtube)} style={[styles.socialChip, { backgroundColor: colors.inputBg }]}>
                  <Typography variant="caption" color={colors.text} bold>▶️ YouTube</Typography>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Stats Bar */}
          <View style={[styles.statsBar, { borderTopColor: colors.borderSubtle, borderBottomColor: colors.borderSubtle }]}>
            <View style={styles.statItem}>
              <Typography variant="h4" color={colors.text} bold>
                {userPosts.length}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Posts
              </Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h4" color={colors.text} bold>
                {user?.followersCount || 0}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Followers
              </Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Typography variant="h4" color={colors.text} bold>
                {user?.followingCount || 0}
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Following
              </Typography>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <Tabs
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          scrollable
        />

        {/* Tab 1: Posts */}
        {activeTab === 'posts' && (
          <View style={styles.tabContent}>
            {userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onCommentPress={() => onCommentPress?.(post.id)}
                onSharePress={() => showToast({ message: 'Post link copied to clipboard!', type: 'info' })}
              />
            ))}
          </View>
        )}

        {/* Tab 2: Experience */}
        {activeTab === 'experience' && (
          <View style={styles.tabContent}>
            <Card variant="flat" padding={16} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Typography variant="subtitle1" color={colors.text} bold style={styles.cardHeader}>
                Work Experience
              </Typography>
              {user?.workHistory && user.workHistory.length > 0 ? (
                user.workHistory.map((work) => (
                  <View key={work.id} style={[styles.expItem, { borderBottomColor: colors.borderSubtle }]}>
                    <Typography variant="subtitle2" color={colors.text} bold>
                      {work.role}
                    </Typography>
                    <Typography variant="caption" color={colors.primary} bold>
                      {work.company} • {work.period}
                    </Typography>
                    {work.location && (
                      <Typography variant="caption" color={colors.textSecondary}>
                        📍 {work.location}
                      </Typography>
                    )}
                    {work.description && (
                      <Typography variant="body2" color={colors.text} style={styles.expDesc}>
                        {work.description}
                      </Typography>
                    )}
                  </View>
                ))
              ) : (
                <Typography variant="caption" color={colors.textSecondary}>
                  No experience listed yet.
                </Typography>
              )}
            </Card>

            <Card variant="flat" padding={16} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Typography variant="subtitle1" color={colors.text} bold style={styles.cardHeader}>
                Education
              </Typography>
              {user?.education && user.education.length > 0 ? (
                user.education.map((edu) => (
                  <View key={edu.id} style={[styles.expItem, { borderBottomColor: colors.borderSubtle }]}>
                    <Typography variant="subtitle2" color={colors.text} bold>
                      {edu.school}
                    </Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                      {edu.degree} • {edu.year}
                    </Typography>
                  </View>
                ))
              ) : (
                <Typography variant="caption" color={colors.textSecondary}>
                  No education listed yet.
                </Typography>
              )}
            </Card>
          </View>
        )}

        {/* Tab 3: About & Links */}
        {activeTab === 'about' && (
          <View style={styles.tabContent}>
            {/* Skills */}
            <Card variant="flat" padding={16} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Typography variant="subtitle1" color={colors.text} bold style={styles.cardHeader}>
                Skills & Endorsements
              </Typography>
              <View style={styles.skillsWrap}>
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <View key={skill} style={[styles.skillBadge, { backgroundColor: colors.inputBg, borderColor: colors.borderSubtle }]}>
                      <Typography variant="caption" color={colors.text} bold>
                        {skill}
                      </Typography>
                    </View>
                  ))
                ) : (
                  <Typography variant="caption" color={colors.textSecondary}>
                    No skills listed.
                  </Typography>
                )}
              </View>
            </Card>

            {/* Contact & Website */}
            <Card variant="flat" padding={16} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Typography variant="subtitle1" color={colors.text} bold style={styles.cardHeader}>
                Contact & Links
              </Typography>
              <Typography variant="body2" color={colors.text} style={styles.contactLine}>
                📧 <Typography variant="body2" color={colors.textSecondary}>{user?.email || 'N/A'}</Typography>
              </Typography>
              {user?.phoneNumber && (
                <Typography variant="body2" color={colors.text} style={styles.contactLine}>
                  📞 <Typography variant="body2" color={colors.textSecondary}>{user.phoneNumber}</Typography>
                </Typography>
              )}
              {user?.website && (
                <TouchableOpacity onPress={() => handleOpenLink(user.website)}>
                  <Typography variant="body2" color={colors.primary} bold style={styles.contactLine}>
                    🌐 {user.website}
                  </Typography>
                </TouchableOpacity>
              )}
            </Card>
          </View>
        )}

        {/* Tab 4: Photos Grid */}
        {activeTab === 'photos' && (
          <View style={styles.photosGrid}>
            {[
              'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
              'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600',
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
              'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
            ].map((uri, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => setPreviewImage(uri)}
                style={styles.gridThumb}
              >
                <Image source={{ uri }} style={styles.gridThumbImg} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Fullscreen Media Viewer */}
      {previewImage && (
        <ImageViewer
          visible={Boolean(previewImage)}
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </View>
  );
};

export const ProfileScreen = memo(ProfileScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navIconBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverContainer: {
    width: SCREEN_WIDTH,
    height: 150,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: -40,
    marginBottom: 8,
  },
  editBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  nameBlock: {
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedIcon: {
    marginLeft: 6,
    fontWeight: 'bold',
  },
  headline: {
    marginTop: 2,
  },
  locationText: {
    marginTop: 2,
  },
  bioText: {
    lineHeight: 20,
    marginBottom: 10,
  },
  socialChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  socialChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  tabContent: {
    paddingVertical: 8,
    gap: 8,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  cardHeader: {
    marginBottom: 10,
  },
  expItem: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  expDesc: {
    marginTop: 4,
    lineHeight: 18,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  contactLine: {
    marginVertical: 4,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    padding: 2,
  },
  gridThumb: {
    width: (SCREEN_WIDTH - 8) / 3,
    height: (SCREEN_WIDTH - 8) / 3,
  },
  gridThumbImg: {
    width: '100%',
    height: '100%',
  },
});
