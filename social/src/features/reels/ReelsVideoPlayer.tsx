import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Video, { ResizeMode } from 'react-native-video';
import { Typography } from '../../shared/components';
import {
  StreamProtocolService,
  StreamProtocol,
  LOW_LATENCY_BUFFER_CONFIG,
} from '../../core/video/StreamProtocolService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ReelsVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  onDoubleTapLike?: () => void;
}

const ReelsVideoPlayerComponent: React.FC<ReelsVideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  isActive,
  onDoubleTapLike,
}) => {
  const videoRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showPlayStateIndicator, setShowPlayStateIndicator] = useState(false);
  const [isHolding2x, setIsHolding2x] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  // Double-tap & heart animation
  const lastTapRef = useRef<number>(0);
  const heartScaleAnim = useRef(new Animated.Value(0)).current;
  const [showHeart, setShowHeart] = useState(false);

  const protocol: StreamProtocol = StreamProtocolService.detectProtocol(videoUrl);
  const headers = StreamProtocolService.getPlaybackHeaders();

  // Sync isPlaying with isActive viewability changes
  useEffect(() => {
    setIsPlaying(isActive);
    if (!isActive) {
      videoRef.current?.seek(0);
      setProgressPercent(0);
    }
  }, [isActive]);

  const handleTap = (evt: any) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap detected -> trigger Like & heart animation
      handleDoubleTap();
      lastTapRef.current = 0;
    } else {
      // Single Tap -> toggle play/pause
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current !== 0) {
          togglePlayPause();
          lastTapRef.current = 0;
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setShowPlayStateIndicator(true);
    setTimeout(() => {
      setShowPlayStateIndicator(false);
    }, 800);
  };

  const handleDoubleTap = () => {
    onDoubleTapLike?.();
    setShowHeart(true);
    heartScaleAnim.setValue(0);

    Animated.sequence([
      Animated.spring(heartScaleAnim, {
        toValue: 1.25,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(heartScaleAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowHeart(false);
    });
  };

  const currentPlaybackRate = isHolding2x ? 2.0 : 1.0;

  return (
    <View style={styles.container}>
      {/* Actual Native Streaming Video Surface */}
      <Video
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
        repeat={true}
        rate={currentPlaybackRate}
        bufferConfig={LOW_LATENCY_BUFFER_CONFIG}
        onLoad={() => {
          setIsBuffering(false);
          setIsError(false);
        }}
        onProgress={(data: any) => {
          if (data?.playableDuration && data?.currentTime != null) {
            const pct = (data.currentTime / Math.max(1, data.playableDuration)) * 100;
            setProgressPercent(pct);
          }
        }}
        onBuffer={(meta: any) => {
          setIsBuffering(Boolean(meta?.isBuffering));
        }}
        onError={() => {
          setIsBuffering(false);
          setIsError(true);
        }}
        style={styles.nativeVideo}
      />

      {/* Stream Protocol Indicator Badge */}
      <View style={styles.protocolBadge}>
        <Typography variant="caption" color="#FFFFFF" bold>
          {protocol === 'hls' ? '⚡ HLS .m3u8' : protocol === 'dash' ? '⚡ DASH' : '⚡ HD Stream'}
        </Typography>
      </View>

      {/* 2X Speed Hold Indicator */}
      {isHolding2x && (
        <View style={styles.speed2xBanner}>
          <Typography variant="caption" color="#FFFFFF" bold>
            ⚡ 2X SPEED PLAYBACK
          </Typography>
        </View>
      )}

      {/* Tap Target for Gestures */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTap}
        onLongPress={() => setIsHolding2x(true)}
        onPressOut={() => setIsHolding2x(false)}
        style={styles.touchArea}
      >
        {/* Buffering Indicator */}
        {isBuffering && (
          <View style={styles.centerSpinner}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}

        {/* Error Indicator */}
        {isError && (
          <View style={styles.centerSpinner}>
            <Typography variant="body2" color="#FF3B30" bold>
              ⚠️ Video stream unavailable
            </Typography>
          </View>
        )}

        {/* Transient Play/Pause Indicator Icon */}
        {showPlayStateIndicator && (
          <View style={styles.playStateIndicator}>
            <Typography variant="h1" color="#FFFFFF">
              {isPlaying ? '▶' : '⏸'}
            </Typography>
          </View>
        )}

        {/* Floating Heart Animation on Double-Tap */}
        {showHeart && (
          <Animated.View
            style={[
              styles.floatingHeart,
              {
                transform: [{ scale: heartScaleAnim }],
              },
            ]}
          >
            <Typography style={styles.heartIcon}>💖</Typography>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Slim Bottom Loop Progress Bar */}
      <View style={styles.bottomProgressBarTrack}>
        <View style={[styles.bottomProgressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      {/* Audio Mute Toggle Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsMuted(!isMuted)}
        style={styles.muteButton}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={isMuted ? 'Unmute video audio' : 'Mute video audio'}
      >
        <Typography variant="body2">{isMuted ? '🔇' : '🔊'}</Typography>
      </TouchableOpacity>
    </View>
  );
};

export const ReelsVideoPlayer = memo(ReelsVideoPlayerComponent);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  nativeVideo: {
    ...StyleSheet.absoluteFill,
  },
  protocolBadge: {
    position: 'absolute',
    top: 75,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  speed2xBanner: {
    position: 'absolute',
    top: 75,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 45, 85, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 15,
  },
  touchArea: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSpinner: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    borderRadius: 30,
  },
  playStateIndicator: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingHeart: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 90,
  },
  bottomProgressBarTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    zIndex: 10,
  },
  bottomProgressBarFill: {
    height: '100%',
    backgroundColor: '#0A84FF',
  },
  muteButton: {
    position: 'absolute',
    top: 75,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
