import { telemetryEngine } from '../src/core/analytics/TelemetryEngine';
import { mediaCacheManager } from '../src/core/media/MediaCacheManager';

describe('Enterprise Telemetry, APM, Sentry, Crashlytics & Media Cache Suite', () => {
  beforeEach(() => {
    telemetryEngine.clearCrashReports();
    mediaCacheManager.clear();
  });

  test('Computes User Analytics (DAU, MAU, Retention, Engagement)', () => {
    const userMetrics = telemetryEngine.getUserAnalytics();
    expect(userMetrics.dauCount).toBeGreaterThan(0);
    expect(userMetrics.mauCount).toBeGreaterThan(userMetrics.dauCount);
    expect(userMetrics.avgSessionMinutes).toBeGreaterThan(0);
    expect(userMetrics.retention7dPercent).toBeGreaterThan(0);
  });

  test('Tracks APM Screen Render & Network Request Latency Traces', () => {
    const stopTrace = telemetryEngine.startTrace('FeedScreen_Mount_Duration');
    const elapsedMs = stopTrace();

    expect(elapsedMs).toBeGreaterThanOrEqual(0);
    const metrics = telemetryEngine.getPerformanceMetrics();
    expect(metrics.some((m) => m.metricName === 'FeedScreen_Mount_Duration')).toBe(true);
  });

  test('Captures Sentry & Firebase Crashlytics exceptions with breadcrumbs', () => {
    telemetryEngine.addBreadcrumb('User tapped on Reel item #42');
    telemetryEngine.addBreadcrumb('Audio engine connected to JSI WebAudio');

    const err = new Error('Simulated Memory Pressure Spike');
    const report = telemetryEngine.captureException(err);

    expect(report).toBeDefined();
    expect(report.errorMessage).toBe('Simulated Memory Pressure Spike');
    expect(report.breadcrumbs.length).toBeGreaterThanOrEqual(2);
    expect(telemetryEngine.getCrashReports().length).toBe(1);
  });

  test('Manages LRU Image & Chunked Video Caching with Hit Ratios', () => {
    const videoUrl = 'https://cdn.socialsphere.enterprise/reels/vid_101.mp4';
    const imageUrl = 'https://cdn.socialsphere.enterprise/covers/img_101.webp';

    // Prefetch video
    const localVideo = mediaCacheManager.prefetchVideo(videoUrl);
    expect(localVideo).toContain('file:///cache/videos/');

    // Prefetch image
    const localImage = mediaCacheManager.prefetchImage(imageUrl);
    expect(localImage).toContain('file:///cache/images/');

    // Secondary access (Cache Hit)
    const cachedVideo = mediaCacheManager.prefetchVideo(videoUrl);
    expect(cachedVideo).toBe(localVideo);

    const metrics = mediaCacheManager.getCacheMetrics();
    expect(metrics.cachedItemsCount).toBe(2);
    expect(metrics.hitsCount).toBeGreaterThan(0);
    expect(metrics.hitRatioPercent).toBeGreaterThan(0);
  });
});
