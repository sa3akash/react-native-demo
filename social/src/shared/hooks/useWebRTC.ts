import { useState, useEffect, useCallback, useMemo } from 'react';
import { webRTCManager, CallSession, CallParticipant } from '../../core/realtime/WebRTCManager';

export function useWebRTC() {
  const [session, setSession] = useState<CallSession | null>(webRTCManager.getSession());

  useEffect(() => {
    const unsub = webRTCManager.subscribe((updatedSession) => {
      setSession(updatedSession);
    });
    return unsub;
  }, []);

  const startCall = useCallback(
    async (params: {
      participant: CallParticipant;
      isVideo: boolean;
      isGroup?: boolean;
    }) => {
      return await webRTCManager.startCall(params);
    },
    []
  );

  const answerCall = useCallback(async (callId: string) => {
    await webRTCManager.answerCall(callId);
  }, []);

  const toggleMute = useCallback(() => {
    return webRTCManager.toggleMute();
  }, []);

  const toggleCamera = useCallback(() => {
    return webRTCManager.toggleCamera();
  }, []);

  const flipCamera = useCallback(() => {
    return webRTCManager.flipCamera();
  }, []);

  const toggleBackgroundBlur = useCallback(() => {
    return webRTCManager.toggleBackgroundBlur();
  }, []);

  const toggleScreenSharing = useCallback(async () => {
    return await webRTCManager.toggleScreenSharing();
  }, []);

  const endCall = useCallback((reason?: string) => {
    webRTCManager.endCall(reason);
  }, []);

  const formattedDuration = useMemo(() => {
    if (!session) return '00:00';
    const mins = Math.floor(session.durationSeconds / 60);
    const secs = session.durationSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [session?.durationSeconds]);

  return {
    session,
    isInCall: Boolean(session && session.status !== 'ended'),
    isConnected: session?.status === 'connected',
    isCalling: session?.status === 'calling',
    isRinging: session?.status === 'ringing',
    isMuted: session?.isMuted || false,
    isCameraOff: session?.isCameraOff || false,
    isFrontCamera: session?.isFrontCamera || true,
    isScreenSharing: session?.isScreenSharing || false,
    isBackgroundBlur: session?.isBackgroundBlur || false,
    localStream: session?.localStream || null,
    remoteStream: session?.remoteStream || null,
    durationSeconds: session?.durationSeconds || 0,
    formattedDuration,
    startCall,
    answerCall,
    toggleMute,
    toggleCamera,
    flipCamera,
    toggleBackgroundBlur,
    toggleScreenSharing,
    endCall,
  };
}
