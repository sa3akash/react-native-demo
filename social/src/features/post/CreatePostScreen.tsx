import React, { useState, useEffect, useMemo, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import {
  Typography,
  Avatar,
  Button,
  SegmentedControl,
  Input,
  TextArea,
  Card,
  VideoPlayer,
  AudioPlayer,
} from '../../shared/components';
import { useFeedStore } from '../../store/useFeedStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { MediaUploadService } from '../../core/media/MediaUploadService';
import { RichContentParser, LinkPreviewMetadata, GifItem, StickerItem } from '../../core/content/RichContentParser';
import { LinkPreviewCard } from './LinkPreviewCard';
import { GifPickerModal } from './GifPickerModal';
import { StickerEmojiModal } from './StickerEmojiModal';

export type PostFormatType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'poll'
  | 'story'
  | 'reel'
  | 'live'
  | 'event'
  | 'article';

export interface CreatePostScreenProps {
  onClose: () => void;
  initialType?: PostFormatType;
}

const CreatePostScreenComponent: React.FC<CreatePostScreenProps> = ({
  onClose,
  initialType = 'text',
}) => {
  const { colors, theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const createPost = useFeedStore((state) => state.createPost);
  const { showToast } = useToast();

  const [postType, setPostType] = useState<PostFormatType>(initialType);
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');

  // Media
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);

  // Poll
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Event
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('Tomorrow at 6:00 PM');

  // Article
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCover, setArticleCover] = useState<string | null>(null);

  // Rich Content
  const [linkPreview, setLinkPreview] = useState<LinkPreviewMetadata | null>(null);
  const [isGifModalVisible, setIsGifModalVisible] = useState(false);
  const [isStickerModalVisible, setIsStickerModalVisible] = useState(false);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Auto-detect link preview
  useEffect(() => {
    const preview = RichContentParser.extractLinkPreview(content);
    if (preview && !linkPreview) {
      setLinkPreview(preview);
    }
  }, [content, linkPreview]);

  const postTypeSegments = useMemo(
    () => [
      { id: 'text', label: '📝 Post' },
      { id: 'image', label: '🖼️ Photos' },
      { id: 'video', label: '🎬 Video' },
      { id: 'poll', label: '📊 Poll' },
      { id: 'event', label: '📅 Event' },
      { id: 'article', label: '📰 Article' },
    ],
    []
  );

  const handleAddMediaMock = (type: 'image' | 'video' | 'audio') => {
    if (type === 'image') {
      setSelectedImages([
        ...selectedImages,
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      ]);
      setPostType('image');
    } else if (type === 'video') {
      setSelectedVideo('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');
      setPostType('video');
    } else if (type === 'audio') {
      setSelectedAudio('https://sample-audio.com/voice_sample_1.mp3');
      setPostType('audio');
    }
  };

  const handleSelectGif = (gif: GifItem) => {
    setSelectedImages([...selectedImages, gif.url]);
    setPostType('image');
  };

  const handleSelectSticker = (sticker: StickerItem) => {
    setContent((prev) => `${prev} ${sticker.emoji} `);
  };

  const handlePublish = async () => {
    if (!content.trim() && selectedImages.length === 0 && !selectedVideo && !pollQuestion && !articleTitle) {
      showToast({ message: 'Please add some content to publish.', type: 'warning' });
      return;
    }

    // Chunk Upload simulation
    if (selectedImages.length > 0 || selectedVideo || selectedAudio) {
      setIsUploading(true);
      await MediaUploadService.enqueueUpload(
        {
          id: `file_${Date.now()}`,
          name: 'attachment.jpg',
          uri: selectedImages[0] || selectedVideo || '',
          type: selectedVideo ? 'video' : 'image',
          sizeBytes: 3.5 * 1024 * 1024, // 3.5MB
        },
        (progress) => setUploadProgress(progress)
      );
      setIsUploading(false);
    }

    // Formulate final post
    let finalContent = content;
    if (articleTitle) {
      finalContent = `# ${articleTitle}\n\n${content}`;
    } else if (eventTitle) {
      finalContent = `📅 **${eventTitle}**\n📍 Location: ${eventLocation}\n⏰ Date: ${eventDate}\n\n${content}`;
    }

    createPost({
      authorId: user?.id || 'usr_meta_998',
      authorName: user?.name || 'Alex Rivera',
      authorAvatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      authorHeadline: user?.headline,
      isVerified: user?.isVerified,
      content: finalContent,
      privacy,
      mediaUrls: selectedImages.length > 0 ? selectedImages : undefined,
      videoUrl: selectedVideo || undefined,
      videoDuration: selectedVideo ? '0:34' : undefined,
      poll:
        pollQuestion.trim() && pollOptions.filter((o) => o.trim()).length >= 2
          ? {
              question: pollQuestion.trim(),
              options: pollOptions
                .filter((o) => o.trim())
                .map((text, idx) => ({ id: `opt_${idx + 1}`, text, votes: 0 })),
              totalVotes: 0,
            }
          : undefined,
    });

    showToast({ message: 'Post published successfully! 🚀', type: 'success' });
    onClose();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
          <Typography variant="body1" color={colors.textSecondary}>
            Cancel
          </Typography>
        </TouchableOpacity>
        <Typography variant="h4" color={colors.text} bold>
          Create {postType.toUpperCase()}
        </Typography>
        <Button
          label={isUploading ? `${uploadProgress}%` : 'Publish'}
          variant="primary"
          size="sm"
          loading={isUploading}
          onPress={handlePublish}
        />
      </View>

      {/* Post Type Selector */}
      <View style={{ paddingHorizontal: 16, backgroundColor: colors.surface, paddingBottom: 6 }}>
        <SegmentedControl
          segments={postTypeSegments}
          activeId={postType}
          onSelect={(id) => setPostType(id as any)}
          size="sm"
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Author info row */}
          <View style={styles.authorRow}>
            <Avatar uri={user?.avatarUrl} name={user?.name || 'Alex'} size="md" />
            <View style={styles.authorInfoCol}>
              <Typography variant="subtitle1" color={colors.text} bold>
                {user?.name || 'Alex Rivera'}
              </Typography>
              <TouchableOpacity
                onPress={() => setPrivacy(privacy === 'public' ? 'friends' : privacy === 'friends' ? 'private' : 'public')}
                style={[styles.privacyPill, { backgroundColor: colors.inputBg, borderColor: colors.borderSubtle }]}
              >
                <Typography variant="caption" color={colors.primary} bold>
                  {privacy === 'public' ? '🌍 Public' : privacy === 'friends' ? '👥 Friends' : '🔒 Only Me'} ▼
                </Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Article Hero & Title (if article mode) */}
          {postType === 'article' && (
            <View style={styles.articleSection}>
              <TouchableOpacity
                onPress={() => setArticleCover('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200')}
                style={[styles.articleCoverPlaceholder, { backgroundColor: colors.inputBg, borderColor: colors.borderSubtle }]}
              >
                {articleCover ? (
                  <Image source={{ uri: articleCover }} style={styles.articleCoverImg} resizeMode="cover" />
                ) : (
                  <Typography variant="body2" color={colors.primary} bold>
                    📷 Add Cover Photo
                  </Typography>
                )}
              </TouchableOpacity>
              <Input
                label="Article Headline / Title"
                placeholder="Enter compelling article title..."
                value={articleTitle}
                onChangeText={setArticleTitle}
              />
            </View>
          )}

          {/* Event Details (if event mode) */}
          {postType === 'event' && (
            <Card variant="flat" padding={14} style={[styles.eventCard, { backgroundColor: colors.surface }]}>
              <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 8 }}>
                📅 Event Information
              </Typography>
              <Input label="Event Name" placeholder="e.g. NextGen WebRTC Hackathon" value={eventTitle} onChangeText={setEventTitle} />
              <Input label="Location or URL" placeholder="e.g. San Francisco, CA or Google Meet link" value={eventLocation} onChangeText={setEventLocation} />
              <Input label="Date & Time" placeholder="e.g. Saturday, Aug 29 at 10:00 AM" value={eventDate} onChangeText={setEventDate} />
            </Card>
          )}

          {/* Main Text Content Input */}
          <TextInput
            placeholder={
              postType === 'article'
                ? 'Write your long-form article body here (supports markdown, mentions @, and hashtags #)...'
                : "What's happening? Use @ to mention or # to tag..."
            }
            placeholderTextColor={colors.textMuted}
            multiline
            value={content}
            onChangeText={setContent}
            style={[styles.mainInput, { color: colors.text, minHeight: postType === 'article' ? 180 : 120 }]}
          />

          {/* OpenGraph Link Preview Card */}
          {linkPreview && (
            <LinkPreviewCard metadata={linkPreview} onRemove={() => setLinkPreview(null)} />
          )}

          {/* Image Attachments Grid */}
          {selectedImages.length > 0 && (
            <View style={styles.imagesGrid}>
              {selectedImages.map((uri, idx) => (
                <View key={idx} style={styles.imagePreviewWrap}>
                  <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />
                  <TouchableOpacity
                    onPress={() => setSelectedImages(selectedImages.filter((_, i) => i !== idx))}
                    style={styles.deleteMediaBtn}
                  >
                    <Typography variant="caption" color="#FFFFFF" bold>✕</Typography>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Video Attachment Preview */}
          {selectedVideo && (
            <View style={styles.videoPreviewWrap}>
              <VideoPlayer videoUrl={selectedVideo} />
              <TouchableOpacity onPress={() => setSelectedVideo(null)} style={styles.deleteMediaBtn}>
                <Typography variant="caption" color="#FFFFFF" bold>✕</Typography>
              </TouchableOpacity>
            </View>
          )}

          {/* Audio Waveform Preview */}
          {selectedAudio && (
            <View style={styles.audioPreviewWrap}>
              <AudioPlayer audioUrl={selectedAudio} duration="00:45" />
              <TouchableOpacity onPress={() => setSelectedAudio(null)} style={styles.deleteMediaBtn}>
                <Typography variant="caption" color="#FFFFFF" bold>✕</Typography>
              </TouchableOpacity>
            </View>
          )}

          {/* Poll Builder (if poll mode) */}
          {postType === 'poll' && (
            <Card variant="flat" padding={14} style={[styles.pollBuilder, { backgroundColor: colors.surface }]}>
              <Typography variant="subtitle2" color={colors.text} bold style={{ marginBottom: 6 }}>
                📊 Create a Poll
              </Typography>
              <Input
                placeholder="Ask a question..."
                value={pollQuestion}
                onChangeText={setPollQuestion}
              />
              {pollOptions.map((opt, idx) => (
                <Input
                  key={idx}
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChangeText={(t) => {
                    const newOpts = [...pollOptions];
                    newOpts[idx] = t;
                    setPollOptions(newOpts);
                  }}
                />
              ))}
              <Button
                label="+ Add Option"
                size="sm"
                variant="outline"
                onPress={() => setPollOptions([...pollOptions, ''])}
                style={{ marginTop: 4 }}
              />
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Tool bar for Rich Attachments */}
      <View style={[styles.bottomToolbar, { backgroundColor: colors.surface, borderTopColor: colors.borderSubtle }]}>
        <TouchableOpacity onPress={() => handleAddMediaMock('image')} style={styles.toolBtn}>
          <Typography variant="h3">🖼️</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleAddMediaMock('video')} style={styles.toolBtn}>
          <Typography variant="h3">🎬</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleAddMediaMock('audio')} style={styles.toolBtn}>
          <Typography variant="h3">🎙️</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsGifModalVisible(true)} style={styles.toolBtn}>
          <Typography variant="h3">👾</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsStickerModalVisible(true)} style={styles.toolBtn}>
          <Typography variant="h3">✨</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPostType('poll')} style={styles.toolBtn}>
          <Typography variant="h3">📊</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setContent((c) => `${c} #`)} style={styles.toolBtn}>
          <Typography variant="body1" color={colors.primary} bold>#Tag</Typography>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setContent((c) => `${c} @`)} style={styles.toolBtn}>
          <Typography variant="body1" color={colors.primary} bold>@User</Typography>
        </TouchableOpacity>
      </View>

      {/* GIF Picker Modal */}
      <GifPickerModal
        visible={isGifModalVisible}
        onClose={() => setIsGifModalVisible(false)}
        onSelectGif={handleSelectGif}
      />

      {/* Sticker & Emoji Modal */}
      <StickerEmojiModal
        visible={isStickerModalVisible}
        onClose={() => setIsStickerModalVisible(false)}
        onSelectSticker={handleSelectSticker}
      />
    </SafeAreaView>
  );
};

export const CreatePostScreen = memo(CreatePostScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorInfoCol: {
    marginLeft: 12,
  },
  privacyPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  mainInput: {
    fontSize: 17,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  articleSection: {
    marginBottom: 12,
  },
  articleCoverPlaceholder: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  articleCoverImg: {
    width: '100%',
    height: '100%',
  },
  eventCard: {
    marginBottom: 12,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
  },
  imagePreviewWrap: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  videoPreviewWrap: {
    position: 'relative',
    marginVertical: 10,
  },
  audioPreviewWrap: {
    position: 'relative',
    marginVertical: 10,
  },
  deleteMediaBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pollBuilder: {
    marginVertical: 10,
  },
  bottomToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  toolBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
