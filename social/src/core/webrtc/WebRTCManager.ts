import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';
import { eventBus } from '../events/EventBus';

export type VideoResolutionProfile = '480p' | '720p_hd' | '1080p_fhd' | '4k_uhd';

export interface WebRTCConfig {
  iceServers: Array<{
    urls: string | string[];
    username?: string;
    credential?: string;
  }>;
}

export const DEFAULT_WEBRTC_CONFIG: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:turn.socialsphere.enterprise:3478',
      username: 'socialsphere_webrtc_user',
      credential: 'secure_turn_token_99182',
    },
  ],
};

export const RESOLUTION_CONSTRAINTS: Record<VideoResolutionProfile, { width: number; height: number; frameRate: number }> = {
  '480p': { width: 640, height: 480, frameRate: 24 },
  '720p_hd': { width: 1280, height: 720, frameRate: 30 },
  '1080p_fhd': { width: 1920, height: 1080, frameRate: 60 },
  '4k_uhd': { width: 3840, height: 2160, frameRate: 60 },
};

export class WebRTCManager {
  private static instance: WebRTCManager;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private isAudioMuted: boolean = false;
  private isVideoMuted: boolean = false;

  private constructor() {}

  public static getInstance(): WebRTCManager {
    if (!WebRTCManager.instance) {
      WebRTCManager.instance = new WebRTCManager();
    }
    return WebRTCManager.instance;
  }

  /**
   * Acquire local user media with hardware-level noise suppression & echo cancellation
   */
  public async initializeLocalStream(
    isVideo: boolean,
    resolution: VideoResolutionProfile = '1080p_fhd'
  ): Promise<MediaStream> {
    const videoConstraints = isVideo
      ? {
          width: RESOLUTION_CONSTRAINTS[resolution].width,
          height: RESOLUTION_CONSTRAINTS[resolution].height,
          frameRate: RESOLUTION_CONSTRAINTS[resolution].frameRate,
          facingMode: 'user',
        }
      : false;

    const audioConstraints = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000,
    };

    try {
      const stream = await mediaDevices.getUserMedia({
        audio: audioConstraints as any,
        video: videoConstraints,
      });

      this.localStream = stream;
      this.isAudioMuted = false;
      this.isVideoMuted = !isVideo;
      return stream;
    } catch (err) {
      console.error('[WebRTCManager] Failed to get user media:', err);
      throw err;
    }
  }

  /**
   * Create or retrieve PeerConnection for a remote peer
   */
  public createPeerConnection(peerId: string, onRemoteStream: (stream: any) => void): RTCPeerConnection {
    if (this.peerConnections.has(peerId)) {
      return this.peerConnections.get(peerId)!;
    }

    const pc = new RTCPeerConnection(DEFAULT_WEBRTC_CONFIG as any);

    pc.onicecandidate = (event: any) => {
      if (event.candidate) {
        eventBus.emit('WEBRTC:ICE_CANDIDATE', {
          peerId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event: any) => {
      if (event.streams && event.streams[0]) {
        onRemoteStream(event.streams[0]);
      }
    };

    const currentLocal = this.localStream;
    if (currentLocal) {
      currentLocal.getTracks().forEach((track: any) => {
        pc.addTrack(track, currentLocal);
      });
    }

    this.peerConnections.set(peerId, pc);
    return pc;
  }

  /**
   * Create SDP Offer
   */
  public async createOffer(peerId: string): Promise<any> {
    const pc = this.peerConnections.get(peerId);
    if (!pc) throw new Error(`No PeerConnection found for ${peerId}`);

    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    } as any);

    await pc.setLocalDescription(offer);
    return offer;
  }

  /**
   * Handle incoming remote SDP Offer and produce Answer
   */
  public async handleOfferAndCreateAnswer(peerId: string, offer: any): Promise<any> {
    const pc = this.peerConnections.get(peerId);
    if (!pc) throw new Error(`No PeerConnection found for ${peerId}`);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  /**
   * Set remote answer
   */
  public async handleAnswer(peerId: string, answer: any): Promise<void> {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  /**
   * Add ICE candidate from remote peer
   */
  public async addIceCandidate(peerId: string, candidate: any): Promise<void> {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  /**
   * Toggle local microphone
   */
  public toggleMicrophone(): boolean {
    if (!this.localStream) return false;
    const audioTracks = this.localStream.getAudioTracks();
    if (audioTracks.length > 0) {
      this.isAudioMuted = !this.isAudioMuted;
      audioTracks[0].enabled = !this.isAudioMuted;
    }
    return this.isAudioMuted;
  }

  /**
   * Toggle local camera
   */
  public toggleCamera(): boolean {
    if (!this.localStream) return false;
    const videoTracks = this.localStream.getVideoTracks();
    if (videoTracks.length > 0) {
      this.isVideoMuted = !this.isVideoMuted;
      videoTracks[0].enabled = !this.isVideoMuted;
    }
    return this.isVideoMuted;
  }

  /**
   * Switch between front and rear cameras
   */
  public switchCamera(): void {
    if (!this.localStream) return;
    const videoTracks = this.localStream.getVideoTracks();
    if (videoTracks.length > 0 && typeof (videoTracks[0] as any)._switchCamera === 'function') {
      (videoTracks[0] as any)._switchCamera();
    }
  }

  /**
   * Close all active WebRTC connections and release media streams
   */
  public endAllConnections(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((t: any) => t.stop());
      this.localStream = null;
    }

    this.peerConnections.forEach((pc) => {
      pc.close();
    });
    this.peerConnections.clear();
  }
}

export const webrtcManager = WebRTCManager.getInstance();
