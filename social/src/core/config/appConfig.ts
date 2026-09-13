export interface AppConfig {
  readonly appName: string;
  readonly version: string;
  readonly environment: 'development' | 'staging' | 'production';
  readonly apiBaseUrl: string;
  readonly wsBaseUrl: string;
  readonly timeoutMs: number;
  readonly rtcIceServers: Array<{ urls: string | string[]; username?: string; credential?: string }>;
  readonly features: {
    readonly enableReels: boolean;
    readonly enableMarketplace: boolean;
    readonly enableLiveStreaming: boolean;
    readonly enableWebRTCCalling: boolean;
    readonly enableBiometrics: boolean;
    readonly enableAiModeration: boolean;
    readonly enableOfflineSync: boolean;
    readonly enableCreatorStudio: boolean;
  };
  readonly limits: {
    readonly maxUploadSizeMb: number;
    readonly maxStoryDurationSec: number;
    readonly maxReelDurationSec: number;
    readonly postCharacterLimit: number;
    readonly feedPageSize: number;
    readonly commentsPageSize: number;
  };
}

export const APP_CONFIG: AppConfig = {
  appName: 'SocialSphere Enterprise',
  version: '1.0.0',
  environment: 'development',
  apiBaseUrl: 'https://api.socialsphere.enterprise/v1',
  wsBaseUrl: 'wss://realtime.socialsphere.enterprise/ws',
  timeoutMs: 15000,
  rtcIceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  features: {
    enableReels: true,
    enableMarketplace: true,
    enableLiveStreaming: true,
    enableWebRTCCalling: true,
    enableBiometrics: true,
    enableAiModeration: true,
    enableOfflineSync: true,
    enableCreatorStudio: true,
  },
  limits: {
    maxUploadSizeMb: 50,
    maxStoryDurationSec: 30,
    maxReelDurationSec: 90,
    postCharacterLimit: 3000,
    feedPageSize: 10,
    commentsPageSize: 20,
  },
};
