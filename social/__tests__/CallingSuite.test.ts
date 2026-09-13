import { webrtcManager } from '../src/core/webrtc/WebRTCManager';
import { callRecordingService } from '../src/core/webrtc/CallRecordingService';
import { virtualBackgroundService } from '../src/core/webrtc/VirtualBackgroundService';
import { useCallStore } from '../src/store/useCallStore';

describe('Enterprise WebRTC Audio & Video Calling Suite', () => {
  beforeEach(() => {
    useCallStore.setState({
      activeCallId: null,
      callStatus: 'idle',
      durationSeconds: 0,
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
      isRecording: false,
    });
  });

  test('WebRTCManager initializes local stream with HD video and audio constraints', async () => {
    const stream = await webrtcManager.initializeLocalStream(true, '1080p_fhd');
    expect(stream).toBeDefined();

    // Toggle mic and camera
    const isMuted = webrtcManager.toggleMicrophone();
    expect(typeof isMuted).toBe('boolean');

    const isCameraOff = webrtcManager.toggleCamera();
    expect(typeof isCameraOff).toBe('boolean');
  });

  test('WebRTCManager creates PeerConnection and handles SDP offer/answer', async () => {
    const onStream = jest.fn();
    const pc = webrtcManager.createPeerConnection('peer_998', onStream);
    expect(pc).toBeDefined();

    const offer = await webrtcManager.createOffer('peer_998');
    expect(offer).toBeDefined();
    expect(offer.type).toBe('offer');

    const answer = await webrtcManager.handleOfferAndCreateAnswer('peer_998', offer);
    expect(answer).toBeDefined();
  });

  test('CallRecordingService tracks duration and exports MP4 metadata', async () => {
    callRecordingService.startRecording('call_alpha_1');
    expect(callRecordingService.getRecordingState()).toBe('recording');

    callRecordingService.pauseRecording();
    expect(callRecordingService.getRecordingState()).toBe('paused');

    callRecordingService.resumeRecording();
    expect(callRecordingService.getRecordingState()).toBe('recording');

    const metadata = await callRecordingService.stopAndSaveRecording(3);
    expect(metadata.callId).toBe('call_alpha_1');
    expect(metadata.resolution).toBe('1920x1080');
    expect(metadata.participantsCount).toBe(3);
    expect(metadata.filePath).toContain('.mp4');
  });

  test('VirtualBackgroundService manages blur and virtual scenery presets', () => {
    virtualBackgroundService.applyBackground('blur_light');
    expect(virtualBackgroundService.getCurrentBackground()).toBe('blur_light');

    virtualBackgroundService.applyBackground('virtual_office');
    expect(virtualBackgroundService.getCurrentBackground()).toBe('virtual_office');
  });

  test('useCallStore initiates 1-on-1 and Group calls with screen sharing', async () => {
    await useCallStore.getState().startCall({
      callType: 'video',
      title: 'Sprint Planning Call',
      participants: [
        { id: 'usr_1', name: 'Sarah Jenkins', avatarUrl: '' },
        { id: 'usr_2', name: 'David Chen', avatarUrl: '' },
      ],
      isGroup: true,
    });

    expect(useCallStore.getState().callStatus).toBe('connected');
    expect(useCallStore.getState().isGroup).toBe(true);
    expect(useCallStore.getState().participants.length).toBe(2);

    // Toggle screen share
    useCallStore.getState().toggleScreenShare();
    expect(useCallStore.getState().isScreenSharing).toBe(true);

    // End call
    useCallStore.getState().endCall();
    expect(useCallStore.getState().callStatus).toBe('ended');
    expect(useCallStore.getState().callHistory.length).toBeGreaterThan(0);
  });
});
