import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Animated,
} from 'react-native';
import Video, { ResizeMode, SelectedTrackType } from 'react-native-video';
import { useTheme } from '../../../theme/ThemeContext';
import { Typography } from '../atoms/Typography';
import {
  StreamProtocolService,
  StreamProtocol,
  VideoQualityLevel,
  AudioTrackInfo,
  SubtitleTrackInfo,
  QUALITY_LADDER,
  LOW_LATENCY_BUFFER_CONFIG,
} from '../../../core/video/StreamProtocolService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  autoPlay?: boolean;
  isLive?: boolean;
  title?: string;
  repeat?: boolean;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

const VideoPlayerComponent: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  duration = '01:45',
  autoPlay = false,
  isLive = false,
  title,
  repeat = false,
  onFullscreenToggle,
}) => {
  const { colors, theme } = useTheme();
  const videoRef = useRef<any>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [totalDurationSec, setTotalDurationSec] = useState(105);
  const [isHoldingSpeed2x, setIsHoldingSpeed2x] = useState(false);

  // Dynamic server tracks
  const [availableQualities, setAvailableQualities] = useState<VideoQualityLevel[]>(QUALITY_LADDER);
  const [selectedQuality, setSelectedQuality] = useState<VideoQualityLevel>(QUALITY_LADDER[0]); // Auto
  const [availableAudioTracks, setAvailableAudioTracks] = useState<AudioTrackInfo[]>([]);
  const [selectedAudioTrackIndex, setSelectedAudioTrackIndex] = useState<number | undefined>(undefined);
  const [availableSubtitles, setAvailableSubtitles] = useState<SubtitleTrackInfo[]>([]);
  const [selectedSubtitleIndex, setSelectedSubtitleIndex] = useState<number | undefined>(undefined);

  // Controls UI
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Double-tap skip animations (-10s / +10s)
  const [skipNotice, setSkipNotice] = useState<{ side: 'left' | 'right'; text: string } | null>(null);
  const skipAnim = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });

  // Settings modals
  const [isQualityModalVisible, setIsQualityModalVisible] = useState(false);
  const [isSpeedModalVisible, setIsSpeedModalVisible] = useState(false);
  const [isAudioTracksModalVisible, setIsAudioTracksModalVisible] = useState(false);

  const protocol: StreamProtocol = isLive ? 'live' : StreamProtocolService.detectProtocol(videoUrl);
  const headers = StreamProtocolService.getPlaybackHeaders();

  // Auto-hide controls timer
  const controlsTimeoutRef = useRef<any>(null);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, resetControlsTimer]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
    resetControlsTimer();
  }, [resetControlsTimer]);

  const handleSeek = useCallback(
    (percentage: number) => {
      const target = Math.round(percentage * totalDurationSec);
      setCurrentTimeSec(target);
      videoRef.current?.seek(target);
      resetControlsTimer();
    },
    [totalDurationSec, resetControlsTimer]
  );

  const handleTapZone = (evt: any) => {
    const { locationX } = evt.nativeEvent;
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current.time < DOUBLE_TAP_DELAY) {
      // Double Tap detected: determine left side (rewind 10s) or right side (fast forward 10s)
      if (locationX < SCREEN_WIDTH * 0.4) {
        // Left side -> -10s
        const newTime = Math.max(0, currentTimeSec - 10);
        setCurrentTimeSec(newTime);
        videoRef.current?.seek(newTime);
        triggerSkipAnimation('left', '⏪ 10s');
      } else if (locationX > SCREEN_WIDTH * 0.6) {
        // Right side -> +10s
        const newTime = Math.min(totalDurationSec, currentTimeSec + 10);
        setCurrentTimeSec(newTime);
        videoRef.current?.seek(newTime);
        triggerSkipAnimation('right', '10s ⏩');
      }
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      lastTapRef.current = { time: now, x: locationX };
      resetControlsTimer();
    }
  };

  const triggerSkipAnimation = (side: 'left' | 'right', text: string) => {
    setSkipNotice({ side, text });
    skipAnim.setValue(0);
    Animated.sequence([
      Animated.timing(skipAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(skipAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => setSkipNotice(null));
  };

  const handleRetryStream = () => {
    setIsError(false);
    setIsBuffering(true);
    setRetryKey((k) => k + 1);
  };

  const formatTime = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = totalDurationSec > 0 ? (currentTimeSec / totalDurationSec) * 100 : 0;

  // Selected track configuration for HLS / DASH resolution targeting
  const selectedVideoTrack =
    selectedQuality.id === 'auto'
      ? { type: 'auto' as any }
      : selectedQuality.index !== undefined
      ? { type: 'index' as any, value: selectedQuality.index }
      : { type: 'resolution' as any, value: selectedQuality.height };

  const effectivePlaybackSpeed = isHoldingSpeed2x ? 2.0 : playbackSpeed;

  const playerContent = (
    <View style={[styles.playerContainer, isFullscreen ? styles.fullscreenContainer : { height: 230 }]}>
      {/* Actual Native Video Element with Dynamic Streams */}
      <Video
        key={retryKey}
        ref={videoRef}
        source={{
          uri: videoUrl,
          headers,
        }}
        poster={thumbnailUrl}
        posterResizeMode="cover"
        resizeMode={ResizeMode.COVER}
        paused={!isPlaying}
        muted={isMuted}
        rate={effectivePlaybackSpeed}
        repeat={repeat}
        bufferConfig={LOW_LATENCY_BUFFER_CONFIG}
        selectedVideoTrack={selectedVideoTrack}
        selectedAudioTrack={
          selectedAudioTrackIndex !== undefined
            ? { type: SelectedTrackType.INDEX, value: selectedAudioTrackIndex }
            : undefined
        }
        selectedTextTrack={
          selectedSubtitleIndex !== undefined
            ? { type: SelectedTrackType.INDEX, value: selectedSubtitleIndex }
            : { type: SelectedTrackType.DISABLED }
        }
        onLoad={(data: any) => {
          if (data?.duration) setTotalDurationSec(data.duration);
          if (data?.videoTracks && data.videoTracks.length > 0) {
            const parsed = StreamProtocolService.parseManifestTracks(data.videoTracks);
            setAvailableQualities(parsed);
          }
          if (data?.audioTracks) {
            setAvailableAudioTracks(data.audioTracks);
          }
          if (data?.textTracks) {
            setAvailableSubtitles(data.textTracks);
          }
          setIsBuffering(false);
          setIsError(false);
        }}
        onProgress={(data: any) => {
          if (data?.currentTime != null) {
            setCurrentTimeSec(data.currentTime);
          }
        }}
        onBuffer={(meta: any) => {
          setIsBuffering(Boolean(meta?.isBuffering));
        }}
        onError={() => {
          setIsBuffering(false);
          setIsError(true);
        }}
        onEnd={() => {
          if (!repeat) {
            setIsPlaying(false);
          }
        }}
        style={styles.nativeVideo}
      />

      {/* Protocol / Quality Badge */}
      <View style={styles.topBadgesRow}>
        {protocol === 'hls' && (
          <View style={[styles.badgePill, { backgroundColor: 'rgba(0,122,255,0.85)' }]}>
            <Typography variant="caption" color="#FFFFFF" bold>
              ⚡ HLS .m3u8 • {selectedQuality.id.toUpperCase()}
            </Typography>
          </View>
        )}
        {protocol === 'dash' && (
          <View style={[styles.badgePill, { backgroundColor: 'rgba(255,149,0,0.85)' }]}>
            <Typography variant="caption" color="#FFFFFF" bold>
              ⚡ DASH • {selectedQuality.id.toUpperCase()}
            </Typography>
          </View>
        )}
        {isLive && (
          <View style={[styles.badgePill, { backgroundColor: '#FF2D55' }]}>
            <Typography variant="caption" color="#FFFFFF" bold>
              🔴 LIVE
            </Typography>
          </View>
        )}
      </View>

      {/* Hold 2x Speed Banner */}
      {isHoldingSpeed2x && (
        <View style={styles.holding2xBanner}>
          <Typography variant="caption" color="#FFFFFF" bold>
            ⚡ 2X SPEED PLAYBACK
          </Typography>
        </View>
      )}

      {/* Tap Target with Gestures */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTapZone}
        onLongPress={() => setIsHoldingSpeed2x(true)}
        onPressOut={() => setIsHoldingSpeed2x(false)}
        style={styles.tapTarget}
      >
        {/* Buffering Spinner */}
        {isBuffering && (
          <View style={styles.centerIndicator}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}

        {/* Error Indicator with Retry */}
        {isError && (
          <View style={styles.errorOverlay}>
            <Typography variant="body2" color="#FFFFFF" bold style={{ marginBottom: 8 }}>
              ⚠️ Stream Connection Failed
            </Typography>
            <TouchableOpacity onPress={handleRetryStream} style={styles.retryBtn}>
              <Typography variant="caption" color="#FFFFFF" bold>
                🔄 Tap to Retry
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        {/* Double-tap ripple skip notice */}
        {skipNotice && (
          <Animated.View
            style={[
              styles.skipIndicator,
              skipNotice.side === 'left' ? { left: 40 } : { right: 40 },
              { opacity: skipAnim },
            ]}
          >
            <Typography variant="subtitle1" color="#FFFFFF" bold>
              {skipNotice.text}
            </Typography>
          </Animated.View>
        )}

        {/* Controls Overlay */}
        {showControls && !isBuffering && !isError && (
          <View style={styles.controlsOverlay}>
            {/* Top Bar: Title & Settings */}
            <View style={styles.topControlBar}>
              <Typography variant="subtitle2" color="#FFFFFF" bold numberOfLines={1} style={{ flex: 1 }}>
                {title || (protocol === 'hls' ? 'Adaptive HLS Stream' : protocol === 'dash' ? 'MPEG-DASH Stream' : 'Video Player')}
              </Typography>

              {/* Dynamic Quality Selector */}
              <TouchableOpacity
                onPress={() => setIsQualityModalVisible(true)}
                style={styles.headerControlBtn}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Select video resolution"
              >
                <Typography variant="caption" color="#FFFFFF" bold>
                  ⚙️ {selectedQuality.id}
                </Typography>
              </TouchableOpacity>

              {/* Speed Button */}
              <TouchableOpacity
                onPress={() => setIsSpeedModalVisible(true)}
                style={styles.headerControlBtn}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Select playback speed"
              >
                <Typography variant="caption" color="#FFFFFF" bold>
                  {playbackSpeed}x
                </Typography>
              </TouchableOpacity>

              {/* Audio Tracks (if multiple) */}
              {availableAudioTracks.length > 1 && (
                <TouchableOpacity
                  onPress={() => setIsAudioTracksModalVisible(true)}
                  style={styles.headerControlBtn}
                >
                  <Typography variant="caption" color="#FFFFFF" bold>
                    🗣️ Audio
                  </Typography>
                </TouchableOpacity>
              )}
            </View>

            {/* Main Center Play/Pause */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={togglePlay}
              style={[styles.playBtn, { backgroundColor: 'rgba(0,0,0,0.7)' }]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause video' : 'Play video'}
            >
              <Typography variant="h2" color="#FFFFFF">
                {isPlaying ? '⏸' : '▶'}
              </Typography>
            </TouchableOpacity>

            {/* Bottom Bar: Timeline, Scrub, Fullscreen */}
            <View style={styles.bottomControlBar}>
              <Typography variant="caption" color="#FFFFFF" bold>
                {formatTime(currentTimeSec)} / {isLive ? 'LIVE' : duration}
              </Typography>

              {/* Interactive Scrub Track */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={(e) => {
                  const { locationX } = e.nativeEvent;
                  const ratio = Math.max(0, Math.min(1, locationX / (SCREEN_WIDTH - 160)));
                  handleSeek(ratio);
                }}
                style={styles.scrubBarTrack}
              >
                <View style={[styles.scrubBarFill, { width: `${progressPercentage}%`, backgroundColor: colors.primary }]} />
              </TouchableOpacity>

              {/* Mute Button */}
              <TouchableOpacity
                onPress={() => setIsMuted(!isMuted)}
                style={styles.bottomIconBtn}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
              >
                <Typography variant="body1">{isMuted ? '🔇' : '🔊'}</Typography>
              </TouchableOpacity>

              {/* Fullscreen Button */}
              <TouchableOpacity
                onPress={() => {
                  const nextState = !isFullscreen;
                  setIsFullscreen(nextState);
                  onFullscreenToggle?.(nextState);
                }}
                style={styles.bottomIconBtn}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                <Typography variant="body1">{isFullscreen ? '🗗' : '⛶'}</Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Quality Selection Modal */}
      <Modal
        visible={isQualityModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsQualityModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsQualityModalVisible(false)}
          style={styles.modalBackdrop}
        >
          <View style={[styles.modalSheet, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.lg }]}>
            <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
              Streaming Quality ({protocol.toUpperCase()})
            </Typography>
            {availableQualities.map((q) => (
              <TouchableOpacity
                key={q.id}
                onPress={() => {
                  setSelectedQuality(q);
                  setIsQualityModalVisible(false);
                }}
                style={[
                  styles.optionRow,
                  selectedQuality.id === q.id && { backgroundColor: colors.primaryLight, borderRadius: theme.radius.md },
                ]}
              >
                <Typography variant="body2" color={selectedQuality.id === q.id ? colors.primary : colors.text} bold>
                  {q.label}
                </Typography>
                {q.bitrateKbps > 0 && (
                  <Typography variant="caption" color={colors.textSecondary}>
                    {q.bitrateKbps} kbps
                  </Typography>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Playback Speed Modal */}
      <Modal
        visible={isSpeedModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSpeedModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsSpeedModalVisible(false)}
          style={styles.modalBackdrop}
        >
          <View style={[styles.modalSheet, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.lg }]}>
            <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
              Playback Speed
            </Typography>
            {SPEED_OPTIONS.map((speed) => (
              <TouchableOpacity
                key={speed}
                onPress={() => {
                  setPlaybackSpeed(speed);
                  setIsSpeedModalVisible(false);
                }}
                style={[
                  styles.optionRow,
                  playbackSpeed === speed && { backgroundColor: colors.primaryLight, borderRadius: theme.radius.md },
                ]}
              >
                <Typography variant="body2" color={playbackSpeed === speed ? colors.primary : colors.text} bold>
                  {speed === 1.0 ? 'Normal (1.0x)' : `${speed}x`}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  if (isFullscreen) {
    return (
      <Modal visible={isFullscreen} animationType="slide" statusBarTranslucent>
        <SafeAreaView style={styles.fullscreenSafeContainer}>
          {playerContent}
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <View style={[styles.wrapper, { borderRadius: theme.radius.lg }]}>
      {playerContent}
    </View>
  );
};

export const VideoPlayer = memo(VideoPlayerComponent);

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginVertical: 6,
  },
  playerContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#000000',
  },
  fullscreenContainer: {
    flex: 1,
    height: '100%',
  },
  fullscreenSafeContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  nativeVideo: {
    ...StyleSheet.absoluteFill,
  },
  tapTarget: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  holding2xBanner: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 45, 85, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 15,
  },
  centerIndicator: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    borderRadius: 30,
  },
  errorOverlay: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  retryBtn: {
    backgroundColor: '#0A84FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  skipIndicator: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: 12,
  },
  topControlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerControlBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  bottomControlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scrubBarTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scrubBarFill: {
    height: '100%',
  },
  bottomIconBtn: {
    padding: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 340,
    padding: 16,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
