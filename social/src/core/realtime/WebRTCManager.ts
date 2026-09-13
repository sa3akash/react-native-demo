import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
  RTCView,
} from 'react-native-webrtc';
import { eventBus } from '../events/EventBus';
import { webSocketManager } from './WebSocketManager';

export interface CallParticipant {
  userId: string;
  userName: string;
  avatarUrl: string;
}

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'reconnecting' | 'ended';

export interface CallSession {
  callId: string;
  status: CallStatus;
  isVideo: boolean;
  isGroup: boolean;
  participant: CallParticipant;
  isMuted: boolean;
  isCameraOff: boolean;
  isFrontCamera: boolean;
  isBackgroundBlur: boolean;
  isScreenSharing: boolean;
  startTime?: number;
  durationSeconds: number;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export interface WebRTCConfiguration {
  iceServers: Array<{ urls: string | string[]; username?: string; credential?: string }>;
}

const DEFAULT_RTC_CONFIG: WebRTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
  ],
};

class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null;
  private currentSession: CallSession | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private listeners: Set<(session: CallSession | null) => void> = new Set();
  private durationTimer: any = null;

  constructor() {
    this.setupSignalingListeners();
  }

  /**
   * Listen to incoming WebRTC signaling messages via WebSocket
   */
  private setupSignalingListeners() {
    webSocketManager.subscribe('call:offer', async (data: { callId: string; sdp: any; from: CallParticipant; isVideo: boolean }) => {
      this.handleIncomingOffer(data);
    });

    webSocketManager.subscribe('call:answer', async (data: { callId: string; sdp: any }) => {
      this.handleIncomingAnswer(data.sdp);
    });

    webSocketManager.subscribe('call:ice-candidate', async (data: { callId: string; candidate: any }) => {
      this.handleIncomingIceCandidate(data.candidate);
    });

    webSocketManager.subscribe('call:end', (data: { callId: string; reason?: string }) => {
      if (this.currentSession && this.currentSession.callId === data.callId) {
        this.endCall(data.reason || 'Remote peer hung up');
      }
    });
  }

  /**
   * Initializes local audio/video media stream from device hardware
   */
  public async getLocalMediaStream(isVideo = true, isFrontCamera = true): Promise<MediaStream | null> {
    try {
      if (this.localStream) {
        this.stopMediaStream(this.localStream);
      }

      const mediaConstraints = {
        audio: true,
        video: isVideo
          ? {
              facingMode: isFrontCamera ? 'user' : 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
            }
          : false,
      };

      const stream = (await mediaDevices.getUserMedia(mediaConstraints)) as unknown as MediaStream;
      this.localStream = stream;
      return stream;
    } catch (error) {
      console.warn('[WebRTCManager] Failed to get local media stream:', error);
      return null;
    }
  }

  /**
   * Create RTCPeerConnection with ICE handlers and track attachment
   */
  private createPeerConnection(callId: string): RTCPeerConnection {
    if (this.peerConnection) {
      this.peerConnection.close();
    }

    const pc = new RTCPeerConnection(DEFAULT_RTC_CONFIG);

    // Add local tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: MediaStreamTrack) => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // ICE Candidate generator
    pc.onicecandidate = (event: any) => {
      if (event.candidate) {
        webSocketManager.send('call:ice-candidate', {
          callId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    // Remote track receiver
    pc.ontrack = (event: any) => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        if (this.currentSession) {
          this.currentSession.remoteStream = this.remoteStream;
          this.notifySessionUpdate();
        }
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      if (!this.currentSession) return;

      switch (pc.connectionState) {
        case 'connected':
          this.currentSession.status = 'connected';
          this.startDurationTimer();
          eventBus.emit('CALL:CONNECTED', { callId });
          break;
        case 'disconnected':
        case 'failed':
          this.currentSession.status = 'reconnecting';
          break;
        case 'closed':
          this.currentSession.status = 'ended';
          break;
      }
      this.notifySessionUpdate();
    };

    this.peerConnection = pc;
    return pc;
  }

  /**
   * Initiate Outgoing Call (1:1 or Group)
   */
  public async startCall(params: {
    participant: CallParticipant;
    isVideo: boolean;
    isGroup?: boolean;
  }): Promise<CallSession> {
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    await this.getLocalMediaStream(params.isVideo, true);
    const pc = this.createPeerConnection(callId);

    this.currentSession = {
      callId,
      status: 'calling',
      isVideo: params.isVideo,
      isGroup: Boolean(params.isGroup),
      participant: params.participant,
      isMuted: false,
      isCameraOff: !params.isVideo,
      isFrontCamera: true,
      isBackgroundBlur: false,
      isScreenSharing: false,
      durationSeconds: 0,
      localStream: this.localStream,
      remoteStream: null,
    };

    this.notifySessionUpdate();

    try {
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: params.isVideo,
      });
      await pc.setLocalDescription(offer);

      // Send SDP Offer via WebSocket signaling
      webSocketManager.send('call:offer', {
        callId,
        to: params.participant.userId,
        sdp: offer,
        isVideo: params.isVideo,
      });

      eventBus.emit('CALL:OUTGOING_STARTED', { callId, participant: params.participant });
    } catch (err) {
      console.warn('[WebRTCManager] Failed to create call offer:', err);
    }

    return this.currentSession;
  }

  /**
   * Answer incoming Call
   */
  public async answerCall(callId: string): Promise<void> {
    if (!this.currentSession || !this.peerConnection) return;

    this.currentSession.status = 'connected';
    this.currentSession.startTime = Date.now();
    this.startDurationTimer();
    this.notifySessionUpdate();

    try {
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      webSocketManager.send('call:answer', {
        callId,
        sdp: answer,
      });

      eventBus.emit('CALL:CONNECTED', { callId });
    } catch (err) {
      console.warn('[WebRTCManager] Failed to create call answer:', err);
    }
  }

  /**
   * Handle incoming offer from signaling
   */
  private async handleIncomingOffer(data: { callId: string; sdp: any; from: CallParticipant; isVideo: boolean }) {
    await this.getLocalMediaStream(data.isVideo, true);
    const pc = this.createPeerConnection(data.callId);

    this.currentSession = {
      callId: data.callId,
      status: 'ringing',
      isVideo: data.isVideo,
      isGroup: false,
      participant: data.from,
      isMuted: false,
      isCameraOff: !data.isVideo,
      isFrontCamera: true,
      isBackgroundBlur: false,
      isScreenSharing: false,
      durationSeconds: 0,
      localStream: this.localStream,
      remoteStream: null,
    };

    this.notifySessionUpdate();

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      eventBus.emit('CALL:INCOMING', {
        callId: data.callId,
        callerName: data.from.userName,
        callerAvatar: data.from.avatarUrl,
        isVideo: data.isVideo,
        channelName: data.callId,
      });
    } catch (err) {
      console.warn('[WebRTCManager] Failed to set remote description on offer:', err);
    }
  }

  /**
   * Handle incoming answer from remote peer
   */
  private async handleIncomingAnswer(sdp: any) {
    if (this.peerConnection) {
      try {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      } catch (err) {
        console.warn('[WebRTCManager] Failed to set remote description on answer:', err);
      }
    }
  }

  /**
   * Handle incoming trickle ICE candidate
   */
  private async handleIncomingIceCandidate(candidate: any) {
    if (this.peerConnection && candidate) {
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('[WebRTCManager] Failed to add ICE candidate:', err);
      }
    }
  }

  /**
   * Toggle local microphone mute
   */
  public toggleMute(): boolean {
    if (!this.currentSession) return false;

    this.currentSession.isMuted = !this.currentSession.isMuted;
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks();
      audioTracks.forEach((track: MediaStreamTrack) => {
        track.enabled = !this.currentSession!.isMuted;
      });
    }

    this.notifySessionUpdate();
    return this.currentSession.isMuted;
  }

  /**
   * Toggle local camera on/off
   */
  public toggleCamera(): boolean {
    if (!this.currentSession) return false;

    this.currentSession.isCameraOff = !this.currentSession.isCameraOff;
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach((track: MediaStreamTrack) => {
        track.enabled = !this.currentSession!.isCameraOff;
      });
    }

    this.notifySessionUpdate();
    return this.currentSession.isCameraOff;
  }

  /**
   * Flip between front and rear camera
   */
  public flipCamera(): boolean {
    if (!this.currentSession || !this.localStream) return false;

    this.currentSession.isFrontCamera = !this.currentSession.isFrontCamera;
    const videoTracks = this.localStream.getVideoTracks();
    videoTracks.forEach((track: any) => {
      if (typeof track._switchCamera === 'function') {
        track._switchCamera();
      }
    });

    this.notifySessionUpdate();
    return this.currentSession.isFrontCamera;
  }

  /**
   * Toggle background AI blur
   */
  public toggleBackgroundBlur(): boolean {
    if (!this.currentSession) return false;
    this.currentSession.isBackgroundBlur = !this.currentSession.isBackgroundBlur;
    this.notifySessionUpdate();
    return this.currentSession.isBackgroundBlur;
  }

  /**
   * Toggle mobile screen sharing
   */
  public async toggleScreenSharing(): Promise<boolean> {
    if (!this.currentSession) return false;

    try {
      if (!this.currentSession.isScreenSharing) {
        const displayStream = (await mediaDevices.getDisplayMedia({ video: true } as any)) as unknown as MediaStream;
        if (displayStream && this.peerConnection) {
          const screenTrack = displayStream.getVideoTracks()[0];
          const senders = this.peerConnection.getSenders();
          const videoSender = senders.find((s: any) => s.track?.kind === 'video');

          if (videoSender && screenTrack) {
            videoSender.replaceTrack(screenTrack);
          }

          this.currentSession.isScreenSharing = true;
        }
      } else {
        // Revert to camera track
        if (this.localStream && this.peerConnection) {
          const cameraTrack = this.localStream.getVideoTracks()[0];
          const senders = this.peerConnection.getSenders();
          const videoSender = senders.find((s: any) => s.track?.kind === 'video');

          if (videoSender && cameraTrack) {
            videoSender.replaceTrack(cameraTrack);
          }
        }
        this.currentSession.isScreenSharing = false;
      }
    } catch (err) {
      console.warn('[WebRTCManager] Screen sharing toggle failed:', err);
      this.currentSession.isScreenSharing = false;
    }

    this.notifySessionUpdate();
    return this.currentSession.isScreenSharing;
  }

  /**
   * Terminate active call and free all native hardware tracks
   */
  public endCall(reason = 'Call ended'): void {
    if (this.currentSession) {
      webSocketManager.send('call:end', {
        callId: this.currentSession.callId,
        reason,
      });

      this.currentSession.status = 'ended';
      this.notifySessionUpdate();
      eventBus.emit('CALL:ENDED', { callId: this.currentSession.callId, reason });
    }

    this.stopDurationTimer();

    if (this.localStream) {
      this.stopMediaStream(this.localStream);
      this.localStream = null;
    }

    if (this.remoteStream) {
      this.stopMediaStream(this.remoteStream);
      this.remoteStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }

  private stopMediaStream(stream: MediaStream) {
    try {
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    } catch (e) {
      console.warn('[WebRTCManager] Error stopping media stream track:', e);
    }
  }

  private startDurationTimer() {
    this.stopDurationTimer();
    this.durationTimer = setInterval(() => {
      if (this.currentSession && this.currentSession.status === 'connected') {
        this.currentSession.durationSeconds += 1;
        this.notifySessionUpdate();
      }
    }, 1000);
  }

  private stopDurationTimer() {
    if (this.durationTimer) {
      clearInterval(this.durationTimer);
      this.durationTimer = null;
    }
  }

  public getSession(): CallSession | null {
    return this.currentSession;
  }

  public subscribe(listener: (session: CallSession | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentSession);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifySessionUpdate(): void {
    this.listeners.forEach((listener) => {
      listener(this.currentSession ? { ...this.currentSession } : null);
    });
  }
}

export const webRTCManager = new WebRTCManager();
export { RTCView };
