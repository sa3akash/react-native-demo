import {
  StreamProtocolService,
  QUALITY_LADDER,
} from '../src/core/video/StreamProtocolService';
import { VideoPlayer } from '../src/shared/components/organisms/VideoPlayer';
import { ReelsVideoPlayer } from '../src/features/reels/ReelsVideoPlayer';

describe('Streaming Video Player & HLS/DASH Engine Suite', () => {
  test('VideoPlayer and ReelsVideoPlayer are properly defined and exportable', () => {
    expect(VideoPlayer).toBeDefined();
    expect(ReelsVideoPlayer).toBeDefined();
  });

  test('StreamProtocolService accurately detects HLS (.m3u8), DASH (.mpd), and Live streams', () => {
    const hlsUrl = 'https://stream.socialsphere.io/live/stream_1080p.m3u8';
    const dashUrl = 'https://stream.socialsphere.io/vod/manifest.mpd';
    const mp4Url = 'https://cdn.socialsphere.io/videos/clip.mp4';
    const liveUrl = 'https://stream.socialsphere.io/live/broadcaster_99';

    expect(StreamProtocolService.detectProtocol(hlsUrl)).toBe('hls');
    expect(StreamProtocolService.detectProtocol(dashUrl)).toBe('dash');
    expect(StreamProtocolService.detectProtocol(mp4Url)).toBe('mp4');
    expect(StreamProtocolService.detectProtocol(liveUrl)).toBe('live');
  });

  test('Adaptive Bitrate (ABR) selects optimal quality level based on network bandwidth', () => {
    // 6 Mbps -> 1080p
    const highBandwidth = StreamProtocolService.selectOptimalQuality(6500);
    expect(highBandwidth.id).toBe('1080p');

    // 3 Mbps -> 720p
    const medBandwidth = StreamProtocolService.selectOptimalQuality(3000);
    expect(medBandwidth.id).toBe('720p');

    // 1 Mbps -> 480p
    const lowBandwidth = StreamProtocolService.selectOptimalQuality(1100);
    expect(lowBandwidth.id).toBe('360p');

    // 300 kbps -> 240p
    const poorBandwidth = StreamProtocolService.selectOptimalQuality(300);
    expect(poorBandwidth.id).toBe('240p');
  });

  test('QUALITY_LADDER contains full range of streaming resolutions', () => {
    expect(QUALITY_LADDER.some((q) => q.id === 'auto')).toBe(true);
    expect(QUALITY_LADDER.some((q) => q.id === '1080p')).toBe(true);
    expect(QUALITY_LADDER.some((q) => q.id === '720p')).toBe(true);
    expect(QUALITY_LADDER.some((q) => q.id === '480p')).toBe(true);
  });

  test('StreamProtocolService creates tokenized playback headers', () => {
    const headers = StreamProtocolService.getPlaybackHeaders('jwt_secure_stream_token_889');
    expect(headers.Authorization).toBe('Bearer jwt_secure_stream_token_889');
    expect(headers['X-Playback-Client']).toBeDefined();
  });
});
