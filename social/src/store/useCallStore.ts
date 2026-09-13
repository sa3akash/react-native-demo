import { create } from 'zustand';
import { produce } from 'immer';
import { eventBus } from '../core/events/EventBus';
import { webrtcManager, VideoResolutionProfile } from '../core/webrtc/WebRTCManager';
import { callRecordingService, CallRecordingMetadata } from '../core/webrtc/CallRecordingService';
import {
  virtualBackgroundService,
  VirtualBackgroundType,
} from '../core/webrtc/VirtualBackgroundService';

export type CallStatus =
  | 'idle'
  | 'initiating'
  | 'ringing'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'ended';

export type CallType = 'audio' | 'video';

export interface CallParticipant {
  id: string;
  name: string;
  avatarUrl: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
  networkQuality: 1 | 2 | 3 | 4 | 5; // 5 = excellent
}

export interface CallHistoryItem {
  id: string;
  callType: CallType;
  direction: 'incoming' | 'outgoing' | 'missed';
  participants: Array<{ id: string; name: string; avatarUrl: string }>;
  durationSeconds: number;
  createdAt: string;
  recordingUrl?: string;
}

interface CallState {
  activeCallId: string | null;
  callStatus: CallStatus;
  callType: CallType;
  isGroup: boolean;
  title: string;
  participants: CallParticipant[];
  durationSeconds: number;

  // Local Controls
  isMuted: boolean;
  isCameraOff: boolean;
  isFrontCamera: boolean;
  isSpeakerOn: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  recordedFileUrl?: string;

  // Visual & Quality
  virtualBackground: VirtualBackgroundType;
  videoQuality: VideoResolutionProfile;

  // History Log
  callHistory: CallHistoryItem[];

  // Actions
  startCall: (params: {
    callType: CallType;
    title: string;
    participants: Array<{ id: string; name: string; avatarUrl: string }>;
    isGroup?: boolean;
  }) => Promise<void>;
  answerCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  switchCamera: () => void;
  toggleSpeaker: () => void;
  toggleScreenShare: () => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => Promise<CallRecordingMetadata | null>;
  setVirtualBackground: (bg: VirtualBackgroundType, customUrl?: string) => void;
  setVideoQuality: (quality: VideoResolutionProfile) => void;
  tickDuration: () => void;
}

const INITIAL_HISTORY: CallHistoryItem[] = [
  {
    id: 'hist_1',
    callType: 'video',
    direction: 'incoming',
    participants: [{ id: 'usr_1', name: 'Sarah Jenkins', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }],
    durationSeconds: 1240,
    createdAt: 'Today, 10:30 AM',
    recordingUrl: 'file:///storage/recordings/call_20260825_103000.mp4',
  },
  {
    id: 'hist_2',
    callType: 'audio',
    direction: 'outgoing',
    participants: [{ id: 'usr_2', name: 'David Chen', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }],
    durationSeconds: 310,
    createdAt: 'Yesterday, 04:15 PM',
  },
  {
    id: 'hist_3',
    callType: 'video',
    direction: 'missed',
    participants: [{ id: 'usr_3', name: 'Elena Rostova', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' }],
    durationSeconds: 0,
    createdAt: 'Aug 23, 08:20 PM',
  },
];

export const useCallStore = create<CallState>()((set, get) => ({
  activeCallId: null,
  callStatus: 'idle',
  callType: 'video',
  isGroup: false,
  title: '',
  participants: [],
  durationSeconds: 0,

  isMuted: false,
  isCameraOff: false,
  isFrontCamera: true,
  isSpeakerOn: true,
  isScreenSharing: false,
  isRecording: false,
  recordedFileUrl: undefined,

  virtualBackground: 'none',
  videoQuality: '1080p_fhd',
  callHistory: INITIAL_HISTORY,

  startCall: async ({ callType, title, participants, isGroup = false }) => {
    const callId = `call_${Date.now()}`;
    const initialParticipants: CallParticipant[] = participants.map((p) => ({
      ...p,
      isMuted: false,
      isCameraOff: callType === 'audio',
      isSpeaking: false,
      isScreenSharing: false,
      networkQuality: 5,
    }));

    set({
      activeCallId: callId,
      callStatus: 'connecting',
      callType,
      title,
      isGroup,
      participants: initialParticipants,
      durationSeconds: 0,
      isMuted: false,
      isCameraOff: callType === 'audio',
      isScreenSharing: false,
      isRecording: false,
    });

    try {
      await webrtcManager.initializeLocalStream(callType === 'video', get().videoQuality);
      set({ callStatus: 'connected' });
      eventBus.emit('CALL:CONNECTED', { callId, callType });
    } catch {
      set({ callStatus: 'ended' });
    }
  },

  answerCall: async () => {
    const { callType, videoQuality } = get();
    set({ callStatus: 'connecting' });
    try {
      await webrtcManager.initializeLocalStream(callType === 'video', videoQuality);
      set({ callStatus: 'connected' });
    } catch {
      set({ callStatus: 'ended' });
    }
  },

  endCall: () => {
    const { activeCallId, callType, durationSeconds, participants, callHistory } = get();
    webrtcManager.endAllConnections();

    if (get().isRecording) {
      callRecordingService.stopAndSaveRecording();
    }

    if (activeCallId) {
      const historyItem: CallHistoryItem = {
        id: `hist_${Date.now()}`,
        callType,
        direction: 'outgoing',
        participants: participants.map((p) => ({ id: p.id, name: p.name, avatarUrl: p.avatarUrl })),
        durationSeconds,
        createdAt: 'Just now',
        recordingUrl: get().recordedFileUrl,
      };

      set({
        activeCallId: null,
        callStatus: 'ended',
        callHistory: [historyItem, ...callHistory],
      });
    } else {
      set({ activeCallId: null, callStatus: 'idle' });
    }

    eventBus.emit('CALL:ENDED', { callId: activeCallId || 'call_ended' });
  },

  toggleMute: () => {
    const isMuted = webrtcManager.toggleMicrophone();
    set({ isMuted });
  },

  toggleCamera: () => {
    const isCameraOff = webrtcManager.toggleCamera();
    set({ isCameraOff });
  },

  switchCamera: () => {
    webrtcManager.switchCamera();
    set((state) => ({ isFrontCamera: !state.isFrontCamera }));
  },

  toggleSpeaker: () => {
    set((state) => ({ isSpeakerOn: !state.isSpeakerOn }));
  },

  toggleScreenShare: () => {
    set((state) => ({ isScreenSharing: !state.isScreenSharing }));
  },

  startRecording: () => {
    const callId = get().activeCallId;
    if (callId) {
      callRecordingService.startRecording(callId);
      set({ isRecording: true });
    }
  },

  pauseRecording: () => {
    callRecordingService.pauseRecording();
  },

  resumeRecording: () => {
    callRecordingService.resumeRecording();
  },

  stopRecording: async () => {
    const metadata = await callRecordingService.stopAndSaveRecording(get().participants.length);
    set({ isRecording: false, recordedFileUrl: metadata.filePath });
    return metadata;
  },

  setVirtualBackground: (bg, customUrl) => {
    virtualBackgroundService.applyBackground(bg, customUrl);
    set({ virtualBackground: bg });
  },

  setVideoQuality: (quality) => {
    set({ videoQuality: quality });
  },

  tickDuration: () => {
    set((state) => ({ durationSeconds: state.durationSeconds + 1 }));
  },
}));
