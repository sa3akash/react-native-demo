import { aiModerationEngine } from '../src/core/moderation/AIModerationEngine';
import { useModerationStore } from '../src/store/useModerationStore';

describe('Enterprise Moderation & Trust & Safety Suite', () => {
  beforeEach(() => {
    // Reset state before each test
  });

  test('AIModerationEngine detects NSFW, Hate Speech, Spam, and Toxicity', () => {
    // 1. Spam detection
    const spamResult = aiModerationEngine.evaluateContent({
      text: 'Click here to win free 50,000 USDT! Telegram: t.me/freepump100x https://phish.io/free',
    });
    expect(spamResult.isSafe).toBe(false);
    expect(spamResult.scores.spam).toBeGreaterThan(0.7);
    expect(spamResult.flaggedCategories).toContain('spam');

    // 2. Hate speech detection
    const hateResult = aiModerationEngine.evaluateContent({
      text: 'Extreme racist slur terrorist hate attack',
    });
    expect(hateResult.isSafe).toBe(false);
    expect(hateResult.scores.hateSpeech).toBeGreaterThan(0.6);
    expect(hateResult.flaggedCategories).toContain('hate_speech');

    // 3. Toxicity detection
    const toxicResult = aiModerationEngine.evaluateContent({
      text: 'You are completely worthless and stupid, die you loser',
    });
    expect(toxicResult.isSafe).toBe(false);
    expect(toxicResult.scores.toxicity).toBeGreaterThan(0.6);
    expect(toxicResult.flaggedCategories).toContain('toxicity');

    // 4. NSFW detection
    const nsfwResult = aiModerationEngine.evaluateContent({
      mediaUrl: 'https://cdn.example.com/nsfw_adult_content.jpg',
    });
    expect(nsfwResult.isSafe).toBe(false);
    expect(nsfwResult.scores.nsfw).toBeGreaterThan(0.8);
    expect(nsfwResult.flaggedCategories).toContain('nsfw');

    // 5. Clean benign content
    const cleanResult = aiModerationEngine.evaluateContent({
      text: 'Excited to announce our new 120 FPS React Native New Architecture summit!',
    });
    expect(cleanResult.isSafe).toBe(true);
    expect(cleanResult.recommendedAction).toBe('allow');
  });

  test('Submits User, Post, and Comment reports with automated AI safety scanning', () => {
    const initialReports = useModerationStore.getState().reports.length;

    const ticket = useModerationStore.getState().submitReport({
      targetType: 'post',
      targetId: 'post_toxic_999',
      targetAuthorName: 'Troll_User',
      targetContentSnippet: 'You are a worthless loser and should die',
      reasonCategory: 'toxicity',
      additionalNotes: 'Severe death threats',
    });

    expect(ticket).toBeDefined();
    expect(ticket.targetType).toBe('post');
    expect(ticket.aiEvaluation.flaggedCategories).toContain('toxicity');
    expect(useModerationStore.getState().reports.length).toBe(initialReports + 1);

    // Verify auto-quarantine for severe violations
    expect(useModerationStore.getState().hiddenTargetIds).toContain('post_toxic_999');
  });

  test('Enforces admin moderation actions (Quarantine, Suspend User, Dismiss)', () => {
    const report = useModerationStore.getState().reports[0];

    // Suspend user
    useModerationStore.getState().enforceAction(report.id, 'suspend_user');
    const updated = useModerationStore.getState().reports.find((r) => r.id === report.id);
    expect(updated?.status).toBe('resolved');
    expect(useModerationStore.getState().suspendedUserIds).toContain(report.targetAuthorName);

    // Dismiss report
    useModerationStore.getState().enforceAction(report.id, 'dismiss');
    expect(useModerationStore.getState().reports.find((r) => r.id === report.id)?.status).toBe('dismissed');
  });
});
