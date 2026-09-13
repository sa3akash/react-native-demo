import { useState, useEffect, useCallback } from 'react';
import { eventBus } from '../../core/events/EventBus';
import { webRTCManager } from '../../core/realtime/WebRTCManager';
import { NavigationShortcuts } from '../../navigation/NavigationShortcuts';

export interface IncomingCallData {
  callId: string;
  callerName: string;
  callerAvatar: string;
  isVideo: boolean;
}

export function useRealtimeCalls() {
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);

  useEffect(() => {
    const unsubIncoming = eventBus.on('CALL:INCOMING', (call) => {
      setIncomingCall(call);
    });

    const unsubEnded = eventBus.on('CALL:ENDED', () => {
      setIncomingCall(null);
    });

    return () => {
      unsubIncoming();
      unsubEnded();
    };
  }, []);

  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;

    await webRTCManager.answerCall(incomingCall.callId);
    setIncomingCall(null);
  }, [incomingCall]);

  const declineCall = useCallback(() => {
    if (!incomingCall) return;

    webRTCManager.endCall('Declined by user');
    setIncomingCall(null);
  }, [incomingCall]);

  const initiateCall = useCallback(
    async (participant: { userId: string; userName: string; avatarUrl: string }, isVideo = true) => {
      NavigationShortcuts.startVideoCall(participant.userId, participant.userName, participant.avatarUrl);
      return await webRTCManager.startCall({
        participant,
        isVideo,
      });
    },
    []
  );

  return {
    incomingCall,
    hasIncomingCall: Boolean(incomingCall),
    acceptCall,
    declineCall,
    initiateCall,
  };
}
