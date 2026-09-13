import React from 'react';
import { View } from 'react-native';

export class RTCPeerConnection {
  connectionState = 'connected';
  onicecandidate: any = null;
  ontrack: any = null;
  onconnectionstatechange: any = null;

  addTrack = jest.fn();
  removeTrack = jest.fn();
  getSenders = jest.fn(() => []);
  createOffer = jest.fn(async () => ({ type: 'offer', sdp: 'mock_offer_sdp' }));
  createAnswer = jest.fn(async () => ({ type: 'answer', sdp: 'mock_answer_sdp' }));
  setLocalDescription = jest.fn(async () => {});
  setRemoteDescription = jest.fn(async () => {});
  addIceCandidate = jest.fn(async () => {});
  close = jest.fn(() => {
    this.connectionState = 'closed';
  });
}

export class RTCIceCandidate {
  candidate: string;
  constructor(info: any) {
    this.candidate = info.candidate || '';
  }
}

export class RTCSessionDescription {
  type: string;
  sdp: string;
  constructor(info: any) {
    this.type = info.type || '';
    this.sdp = info.sdp || '';
  }
}

export class MediaStreamTrack {
  enabled = true;
  kind = 'video';
  stop = jest.fn();
  _switchCamera = jest.fn();
}

export class MediaStream {
  getTracks = jest.fn(() => [new MediaStreamTrack()]);
  getVideoTracks = jest.fn(() => [new MediaStreamTrack()]);
  getAudioTracks = jest.fn(() => [new MediaStreamTrack()]);
}

export const mediaDevices = {
  getUserMedia: jest.fn(async () => new MediaStream()),
  getDisplayMedia: jest.fn(async () => new MediaStream()),
};

export const RTCView: React.FC<any> = (props: any) => React.createElement(View, props);
