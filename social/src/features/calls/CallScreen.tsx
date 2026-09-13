import React, { useState, useEffect, useRef, memo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar } from '../../shared/components';
import { useCallStore, CallParticipant } from '../../store/useCallStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { VirtualBackgroundModal } from './VirtualBackgroundModal';
import { GroupCallParticipantsModal } from './GroupCallParticipantsModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface CallScreenProps {
  onClose?: () => void;
}

export const CallScreenComponent: React.FC<CallScreenProps> = ({ onClose }) => {
  const { colors, theme } = useTheme();
  const {
    activeCallId,
    callStatus,
    callType,
    isGroup,
    title,
    participants,
    durationSeconds,
    isMuted,
    isCameraOff,
    isFrontCamera,
    isSpeakerOn,
    isScreenSharing,
    isRecording,
    virtualBackground,
    videoQuality,
    toggleMute,
    toggleCamera,
    switchCamera,
    toggleSpeaker,
    toggleScreenShare,
    startRecording,
    stopRecording,
    endCall,
    tickDuration,
  } = useCallStore();
  const { showToast } = useToast();

  const [isVirtualBgModalOpen, setIsVirtualBgModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);

  // Timer interval for call duration
  useEffect(() => {
    let interval: any = null;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        tickDuration();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStatus, tickDuration]);

  const handleEndCall = () => {
    endCall();
    showToast({ message: 'Call ended.', type: 'info' });
    onClose?.();
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      const metadata = await stopRecording();
      showToast({
        message: `Recording saved! (${Math.round((metadata?.fileSizeBytes || 0) / 1024 / 1024)} MB) 🔴`,
        type: 'success',
      });
    } else {
      startRecording();
      showToast({ message: 'Call recording started 🔴', type: 'info' });
    }
  };

  const formatDuration = (secs: number): string => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Floating Info Bar */}
      <View style={styles.topInfoBar}>
        <View>
          <Typography variant="subtitle1" color="#FFFFFF" bold>
            {title || 'Encrypted WebRTC Call'}
          </Typography>
          <View style={styles.durationRow}>
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              {formatDuration(durationSeconds)}
            </Typography>
            <View style={styles.qualityPill}>
              <Typography variant="caption" color="#0A84FF" bold style={{ fontSize: 10 }}>
                {videoQuality === '1080p_fhd' ? '1080p HD' : videoQuality.toUpperCase()}
              </Typography>
            </View>
            {isRecording && (
              <View style={styles.recordingBadge}>
                <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 10 }}>
                  🔴 REC
                </Typography>
              </View>
            )}
          </View>
        </View>

        {/* Participants Button (for Group Calls) */}
        {isGroup && (
          <TouchableOpacity
            onPress={() => setIsParticipantsModalOpen(true)}
            style={styles.participantsBtn}
          >
            <Typography variant="caption" color="#FFFFFF" bold>
              👥 {participants.length + 1}
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Video Viewport (1-on-1 or Group Grid) */}
      <View style={styles.mainStreamContainer}>
        {callType === 'audio' ? (
          // Voice Call Avatar View
          <View style={styles.voiceCallCenter}>
            <Avatar
              uri={participants[0]?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'}
              name={participants[0]?.name || title}
              size="lg"
            />
            <Typography variant="h3" color="#FFFFFF" bold style={{ marginTop: 16 }}>
              {participants[0]?.name || title}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)" style={{ marginTop: 6 }}>
              {isMuted ? 'Microphone Muted 🔇' : 'Speaking... 🎙️'}
            </Typography>
          </View>
        ) : (
          // Video Call Grid / Single View
          <View style={styles.videoGrid}>
            {participants.length <= 1 ? (
              // 1-on-1 Remote Stream
              <View style={styles.remoteVideoCanvas}>
                {participants[0]?.isCameraOff ? (
                  <View style={styles.cameraOffPlaceholder}>
                    <Avatar uri={participants[0]?.avatarUrl} name={participants[0]?.name} size="lg" />
                    <Typography variant="subtitle2" color="#FFFFFF" style={{ marginTop: 8 }}>
                      Camera Off
                    </Typography>
                  </View>
                ) : (
                  <Image
                    source={{
                      uri:
                        virtualBackground === 'virtual_office'
                          ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'
                          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
                    }}
                    style={styles.fullVideo}
                    resizeMode="cover"
                  />
                )}

                {/* Remote Participant Label */}
                <View style={styles.participantOverlayTag}>
                  <Typography variant="caption" color="#FFFFFF" bold>
                    {participants[0]?.name || 'Remote Peer'} {participants[0]?.isMuted ? '🔇' : ''}
                  </Typography>
                </View>
              </View>
            ) : (
              // Group Call Grid (2x2)
              <View style={styles.groupGrid}>
                {participants.map((p, idx) => (
                  <View
                    key={p.id || idx}
                    style={[
                      styles.groupTile,
                      p.isSpeaking && { borderColor: '#34C759', borderWidth: 2 },
                    ]}
                  >
                    <Image source={{ uri: p.avatarUrl }} style={styles.tileImage} resizeMode="cover" />
                    <View style={styles.tileLabel}>
                      <Typography variant="caption" color="#FFFFFF" bold numberOfLines={1}>
                        {p.name}
                      </Typography>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Local PiP (Picture-in-Picture) Stream Thumbnail */}
            <View style={styles.localPipContainer}>
              {isCameraOff ? (
                <View style={styles.localCameraOff}>
                  <Typography variant="caption" color="#FFFFFF">
                    Camera Off
                  </Typography>
                </View>
              ) : (
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' }}
                  style={styles.localPipVideo}
                  resizeMode="cover"
                />
              )}
              <View style={styles.localPipTag}>
                <Typography variant="caption" color="#FFFFFF" style={{ fontSize: 9 }}>
                  You {isFrontCamera ? '(Front)' : '(Back)'}
                </Typography>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Screen Sharing Banner */}
      {isScreenSharing && (
        <View style={styles.screenShareBanner}>
          <Typography variant="caption" color="#FFFFFF" bold>
            🖥️ You are sharing your screen with the call
          </Typography>
        </View>
      )}

      {/* Bottom Floating Control Bar */}
      <View style={styles.bottomControlTray}>
        {/* Mic Toggle */}
        <TouchableOpacity
          onPress={toggleMute}
          style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          <Typography variant="h3">{isMuted ? '🔇' : '🎙️'}</Typography>
        </TouchableOpacity>

        {/* Camera Toggle */}
        {callType === 'video' && (
          <TouchableOpacity
            onPress={toggleCamera}
            style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
          >
            <Typography variant="h3">{isCameraOff ? '🚫' : '📹'}</Typography>
          </TouchableOpacity>
        )}

        {/* Flip Camera */}
        {callType === 'video' && (
          <TouchableOpacity
            onPress={switchCamera}
            style={styles.controlBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Switch camera"
          >
            <Typography variant="h3">🔄</Typography>
          </TouchableOpacity>
        )}

        {/* Speakerphone */}
        <TouchableOpacity
          onPress={toggleSpeaker}
          style={[styles.controlBtn, isSpeakerOn && { backgroundColor: 'rgba(255,255,255,0.3)' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Toggle speaker"
        >
          <Typography variant="h3">{isSpeakerOn ? '🔊' : '🔈'}</Typography>
        </TouchableOpacity>

        {/* Screen Share */}
        {callType === 'video' && (
          <TouchableOpacity
            onPress={toggleScreenShare}
            style={[styles.controlBtn, isScreenSharing && styles.controlBtnActive]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Toggle screen share"
          >
            <Typography variant="h3">🖥️</Typography>
          </TouchableOpacity>
        )}

        {/* Virtual Background & Blur */}
        {callType === 'video' && (
          <TouchableOpacity
            onPress={() => setIsVirtualBgModalOpen(true)}
            style={styles.controlBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Virtual background effects"
          >
            <Typography variant="h3">✨</Typography>
          </TouchableOpacity>
        )}

        {/* Call Recording */}
        <TouchableOpacity
          onPress={handleToggleRecording}
          style={[styles.controlBtn, isRecording && { backgroundColor: '#FF3B30' }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <Typography variant="h3">⏺️</Typography>
        </TouchableOpacity>

        {/* End Call (Red) */}
        <TouchableOpacity
          onPress={handleEndCall}
          style={styles.endCallBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="End call"
        >
          <Typography variant="h2" color="#FFFFFF">
            📞
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Virtual Background Modal */}
      <VirtualBackgroundModal
        visible={isVirtualBgModalOpen}
        onClose={() => setIsVirtualBgModalOpen(false)}
      />

      {/* Group Call Participants Modal */}
      <GroupCallParticipantsModal
        visible={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
      />
    </SafeAreaView>
  );
};

export const CallScreen = memo(CallScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topInfoBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  qualityPill: {
    backgroundColor: 'rgba(0,122,255,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recordingBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  participantsBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  mainStreamContainer: {
    flex: 1,
  },
  voiceCallCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoGrid: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoCanvas: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#111111',
  },
  fullVideo: {
    ...StyleSheet.absoluteFill,
  },
  cameraOffPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
  },
  participantOverlayTag: {
    position: 'absolute',
    bottom: 110,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  groupGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 90,
    paddingBottom: 110,
    gap: 8,
    paddingHorizontal: 8,
  },
  groupTile: {
    width: (SCREEN_WIDTH - 24) / 2,
    height: (SCREEN_HEIGHT - 240) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#222222',
  },
  tileImage: {
    ...StyleSheet.absoluteFill,
  },
  tileLabel: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  localPipContainer: {
    position: 'absolute',
    top: 100,
    right: 16,
    width: 100,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#222222',
    zIndex: 30,
  },
  localPipVideo: {
    ...StyleSheet.absoluteFill,
  },
  localCameraOff: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
  },
  localPipTag: {
    position: 'absolute',
    bottom: 4,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  screenShareBanner: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    backgroundColor: 'rgba(10, 132, 255, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    zIndex: 20,
  },
  bottomControlTray: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(30,30,30,0.85)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
    zIndex: 20,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  controlBtnActive: {
    backgroundColor: '#FF3B30',
  },
  endCallBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
  },
});
