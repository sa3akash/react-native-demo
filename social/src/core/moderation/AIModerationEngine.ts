export type ModerationCategory =
  | 'nsfw'
  | 'hate_speech'
  | 'spam'
  | 'toxicity'
  | 'harassment'
  | 'impersonation'
  | 'misinformation';

export type ModerationEnforcementAction = 'allow' | 'warn' | 'quarantine' | 'block';

export interface AIModerationScore {
  nsfw: number; // 0.0 - 1.0
  hateSpeech: number; // 0.0 - 1.0
  spam: number; // 0.0 - 1.0
  toxicity: number; // 0.0 - 1.0
}

export interface AIModerationResult {
  isSafe: boolean;
  scores: AIModerationScore;
  flaggedCategories: ModerationCategory[];
  highestConfidenceScore: number;
  recommendedAction: ModerationEnforcementAction;
  explanation: string;
}

const HATE_SPEECH_KEYWORDS = [
  'hate', 'slur', 'nazi', 'racist', 'terrorist', 'genocide', 'extremist',
];

const TOXIC_PATTERNS = [
  'kill yourself', 'idiot', 'stupid', 'garbage', 'worthless', 'loser', 'die',
];

const SPAM_PATTERNS = [
  'click here to win', 'free crypto giveaway', 'telegram:', 'whatsapp +1', 'dm for signals',
  '100x pump', 'claim air drop', 't.me/',
];

export class AIModerationEngine {
  private static instance: AIModerationEngine;

  private constructor() {}

  public static getInstance(): AIModerationEngine {
    if (!AIModerationEngine.instance) {
      AIModerationEngine.instance = new AIModerationEngine();
    }
    return AIModerationEngine.instance;
  }

  /**
   * Evaluate text and media for NSFW, Hate Speech, Spam, and Toxicity
   */
  public evaluateContent(params: {
    text?: string;
    mediaUrl?: string;
    targetType?: 'post' | 'comment' | 'user';
  }): AIModerationResult {
    const text = (params.text || '').toLowerCase();
    const mediaUrl = params.mediaUrl || '';

    // 1. Hate speech detection
    let hateSpeechScore = 0.05;
    for (const kw of HATE_SPEECH_KEYWORDS) {
      if (text.includes(kw)) {
        hateSpeechScore = Math.min(1.0, hateSpeechScore + 0.45);
      }
    }

    // 2. Toxicity detection
    let toxicityScore = 0.05;
    for (const pat of TOXIC_PATTERNS) {
      if (text.includes(pat)) {
        toxicityScore = Math.min(1.0, toxicityScore + 0.4);
      }
    }

    // 3. Spam detection
    let spamScore = 0.05;
    for (const sp of SPAM_PATTERNS) {
      if (text.includes(sp)) {
        spamScore = Math.min(1.0, spamScore + 0.5);
      }
    }
    // High link density heuristic
    const urlMatches = text.match(/https?:\/\/[^\s]+/g);
    if (urlMatches && urlMatches.length > 2) {
      spamScore = Math.min(1.0, spamScore + 0.4);
    }

    // 4. NSFW detection
    let nsfwScore = 0.02;
    if (mediaUrl.includes('nsfw') || mediaUrl.includes('adult') || mediaUrl.includes('explicit')) {
      nsfwScore = 0.95;
    }

    const scores: AIModerationScore = {
      nsfw: Number(nsfwScore.toFixed(2)),
      hateSpeech: Number(hateSpeechScore.toFixed(2)),
      spam: Number(spamScore.toFixed(2)),
      toxicity: Number(toxicityScore.toFixed(2)),
    };

    const flaggedCategories: ModerationCategory[] = [];
    if (scores.nsfw >= 0.7) flaggedCategories.push('nsfw');
    if (scores.hateSpeech >= 0.6) flaggedCategories.push('hate_speech');
    if (scores.toxicity >= 0.6) flaggedCategories.push('toxicity');
    if (scores.spam >= 0.7) flaggedCategories.push('spam');

    const highestConfidenceScore = Math.max(
      scores.nsfw,
      scores.hateSpeech,
      scores.spam,
      scores.toxicity
    );

    let recommendedAction: ModerationEnforcementAction = 'allow';
    let explanation = 'Content meets community safety guidelines.';

    if (highestConfidenceScore >= 0.85) {
      recommendedAction = 'block';
      explanation = `Automated violation detected for [${flaggedCategories.join(', ')}]. Immediate quarantine applied.`;
    } else if (highestConfidenceScore >= 0.6) {
      recommendedAction = 'quarantine';
      explanation = `Flagged for potential [${flaggedCategories.join(', ')}]. Queued for safety moderation review.`;
    } else if (highestConfidenceScore >= 0.4) {
      recommendedAction = 'warn';
      explanation = 'Content may contain sensitive or aggressive language.';
    }

    return {
      isSafe: recommendedAction === 'allow',
      scores,
      flaggedCategories,
      highestConfidenceScore,
      recommendedAction,
      explanation,
    };
  }
}

export const aiModerationEngine = AIModerationEngine.getInstance();
