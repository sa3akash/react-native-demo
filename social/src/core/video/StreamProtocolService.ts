export type StreamProtocol = 'hls' | 'dash' | 'mp4' | 'live';

export interface VideoQualityLevel {
  id: string;
  label: string;
  resolution: string;
  bitrateKbps: number;
  width: number;
  height: number;
  index?: number;
}

export interface AudioTrackInfo {
  index: number;
  title: string;
  language: string;
  type?: string;
  selected?: boolean;
}

export interface SubtitleTrackInfo {
  index: number;
  title: string;
  language: string;
  type?: string;
  selected?: boolean;
}

export interface BufferConfig {
  minBufferMs: number;
  maxBufferMs: number;
  bufferForPlaybackMs: number;
  bufferForPlaybackAfterRebufferMs: number;
  maxHeapAllocationPercent?: number;
  minBackBufferMemoryReservePercent?: number;
}

export const LOW_LATENCY_BUFFER_CONFIG: BufferConfig = {
  minBufferMs: 15000,
  maxBufferMs: 50000,
  bufferForPlaybackMs: 2500,
  bufferForPlaybackAfterRebufferMs: 5000,
  maxHeapAllocationPercent: 0.8,
  minBackBufferMemoryReservePercent: 0.1,
};

export const QUALITY_LADDER: VideoQualityLevel[] = [
  { id: 'auto', label: 'Auto (ABR)', resolution: 'Adaptive', bitrateKbps: 0, width: 0, height: 0 },
  { id: '1080p', label: '1080p HD', resolution: '1920x1080', bitrateKbps: 6000, width: 1920, height: 1080 },
  { id: '720p', label: '720p HD', resolution: '1280x720', bitrateKbps: 3200, width: 1280, height: 720 },
  { id: '480p', label: '480p SD', resolution: '854x480', bitrateKbps: 1500, width: 854, height: 480 },
  { id: '360p', label: '360p Low', resolution: '640x360', bitrateKbps: 800, width: 640, height: 360 },
  { id: '240p', label: '240p Saver', resolution: '426x240', bitrateKbps: 400, width: 426, height: 240 },
];

export class StreamProtocolService {
  /**
   * Detect the stream protocol based on URL pattern or manifest extension
   */
  public static detectProtocol(url: string): StreamProtocol {
    if (!url) return 'mp4';
    const lower = url.toLowerCase();

    if (lower.includes('.m3u8') || lower.includes('/hls/')) {
      return 'hls';
    }
    if (lower.includes('.mpd') || lower.includes('/dash/')) {
      return 'dash';
    }
    if (lower.includes('/live/') || lower.includes('rtmp') || lower.includes('flv')) {
      return 'live';
    }
    return 'mp4';
  }

  /**
   * Determine best quality level based on estimated bandwidth (in kbps)
   */
  public static selectOptimalQuality(bandwidthKbps: number): VideoQualityLevel {
    if (bandwidthKbps >= 5500) return QUALITY_LADDER[1]; // 1080p
    if (bandwidthKbps >= 2800) return QUALITY_LADDER[2]; // 720p
    if (bandwidthKbps >= 1200) return QUALITY_LADDER[3]; // 480p
    if (bandwidthKbps >= 600) return QUALITY_LADDER[4];  // 360p
    return QUALITY_LADDER[5];                            // 240p
  }

  /**
   * Parse dynamic video tracks directly reported from server HLS/DASH manifest
   */
  public static parseManifestTracks(rawTracks: any[]): VideoQualityLevel[] {
    if (!Array.isArray(rawTracks) || rawTracks.length === 0) {
      return QUALITY_LADDER;
    }

    const parsed: VideoQualityLevel[] = [
      { id: 'auto', label: 'Auto (ABR)', resolution: 'Adaptive', bitrateKbps: 0, width: 0, height: 0 },
    ];

    rawTracks.forEach((track, idx) => {
      const height = track.height || (track.resolution ? parseInt(track.resolution.split('x')[1], 10) : 720);
      const width = track.width || (track.resolution ? parseInt(track.resolution.split('x')[0], 10) : 1280);
      const bitrate = Math.round((track.bitrate || 2000000) / 1000);

      const label = height >= 1080 ? `${height}p HD` : `${height}p`;

      parsed.push({
        id: `${height}p`,
        label: `${label} (${(bitrate / 1000).toFixed(1)} Mbps)`,
        resolution: `${width}x${height}`,
        bitrateKbps: bitrate,
        width,
        height,
        index: track.index ?? idx,
      });
    });

    return parsed.sort((a, b) => b.height - a.height);
  }

  /**
   * Generate required playback streaming request headers (token authentication & CORS)
   */
  public static getPlaybackHeaders(token?: string): Record<string, string> {
    return {
      'User-Agent': 'SocialSphere-Mobile/2.0 (React-Native-New-Arch)',
      Accept: '*/*',
      'X-Playback-Client': 'SocialSphere-ExoPlayer/AVPlayer',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }
}

export const streamProtocolService = StreamProtocolService;
