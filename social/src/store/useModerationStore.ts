import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';
import {
  aiModerationEngine,
  ModerationCategory,
  ModerationEnforcementAction,
  AIModerationResult,
} from '../core/moderation/AIModerationEngine';

export interface ModerationReportTicket {
  id: string;
  targetType: 'user' | 'post' | 'comment';
  targetId: string;
  targetAuthorName: string;
  targetAuthorAvatar?: string;
  targetContentSnippet: string;
  reporterId: string;
  reasonCategory: ModerationCategory;
  additionalNotes?: string;
  status: 'pending' | 'quarantined' | 'resolved' | 'dismissed';
  createdAt: string;
  aiEvaluation: AIModerationResult;
}

interface ModerationState {
  reports: ModerationReportTicket[];
  hiddenTargetIds: string[];
  suspendedUserIds: string[];

  submitReport: (params: {
    targetType: 'user' | 'post' | 'comment';
    targetId: string;
    targetAuthorName: string;
    targetAuthorAvatar?: string;
    targetContentSnippet: string;
    reasonCategory: ModerationCategory;
    additionalNotes?: string;
    mediaUrl?: string;
  }) => ModerationReportTicket;

  enforceAction: (
    reportId: string,
    action: 'quarantine' | 'suspend_user' | 'dismiss' | 'resolve'
  ) => void;

  dismissReport: (reportId: string) => void;
  unhideTarget: (targetId: string) => void;
}

const INITIAL_REPORTS: ModerationReportTicket[] = [
  {
    id: 'rep_101',
    targetType: 'comment',
    targetId: 'cm_99',
    targetAuthorName: 'CryptoBot_247',
    targetAuthorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    targetContentSnippet: 'CLICK HERE TO WIN FREE 50,000 USDT AIRDROP! Telegram: t.me/freepump100x',
    reporterId: 'usr_meta_998',
    reasonCategory: 'spam',
    additionalNotes: 'Phishing bot spamming every thread',
    status: 'quarantined',
    createdAt: '15m ago',
    aiEvaluation: {
      isSafe: false,
      scores: { nsfw: 0.02, hateSpeech: 0.05, spam: 0.98, toxicity: 0.1 },
      flaggedCategories: ['spam'],
      highestConfidenceScore: 0.98,
      recommendedAction: 'block',
      explanation: 'High confidence phishing and link farming spam signature detected.',
    },
  },
  {
    id: 'rep_102',
    targetType: 'post',
    targetId: 'post_88',
    targetAuthorName: 'Anonymous_User_42',
    targetContentSnippet: 'You are completely worthless and should die for writing that code.',
    reporterId: 'usr_1',
    reasonCategory: 'toxicity',
    additionalNotes: 'Severe death threat in comment section',
    status: 'pending',
    createdAt: '1h ago',
    aiEvaluation: {
      isSafe: false,
      scores: { nsfw: 0.02, hateSpeech: 0.2, spam: 0.05, toxicity: 0.92 },
      flaggedCategories: ['toxicity'],
      highestConfidenceScore: 0.92,
      recommendedAction: 'block',
      explanation: 'Severe harassment, toxicity, and threat pattern detected.',
    },
  },
];

export const useModerationStore = create<ModerationState>()(
  persist(
    (set, get) => ({
      reports: INITIAL_REPORTS,
      hiddenTargetIds: ['cm_99'],
      suspendedUserIds: [],

      submitReport: ({
        targetType,
        targetId,
        targetAuthorName,
        targetAuthorAvatar,
        targetContentSnippet,
        reasonCategory,
        additionalNotes,
        mediaUrl,
      }) => {
        // Run AI real-time safety evaluation
        const aiEvaluation = aiModerationEngine.evaluateContent({
          text: `${targetContentSnippet} ${additionalNotes || ''}`,
          mediaUrl,
          targetType,
        });

        const id = `rep_${Date.now()}`;
        const newTicket: ModerationReportTicket = {
          id,
          targetType,
          targetId,
          targetAuthorName,
          targetAuthorAvatar,
          targetContentSnippet,
          reporterId: 'usr_meta_998',
          reasonCategory,
          additionalNotes,
          status: aiEvaluation.recommendedAction === 'block' ? 'quarantined' : 'pending',
          createdAt: 'Just now',
          aiEvaluation,
        };

        set(
          produce((state: ModerationState) => {
            state.reports.unshift(newTicket);
            if (aiEvaluation.recommendedAction === 'block') {
              state.hiddenTargetIds.push(targetId);
            }
          })
        );

        return newTicket;
      },

      enforceAction: (reportId, action) => {
        set(
          produce((state: ModerationState) => {
            const report = state.reports.find((r) => r.id === reportId);
            if (!report) return;

            if (action === 'quarantine') {
              report.status = 'quarantined';
              if (!state.hiddenTargetIds.includes(report.targetId)) {
                state.hiddenTargetIds.push(report.targetId);
              }
            } else if (action === 'suspend_user') {
              report.status = 'resolved';
              state.suspendedUserIds.push(report.targetAuthorName);
              if (!state.hiddenTargetIds.includes(report.targetId)) {
                state.hiddenTargetIds.push(report.targetId);
              }
            } else if (action === 'dismiss') {
              report.status = 'dismissed';
            } else if (action === 'resolve') {
              report.status = 'resolved';
            }
          })
        );
      },

      dismissReport: (reportId) => {
        set(
          produce((state: ModerationState) => {
            const report = state.reports.find((r) => r.id === reportId);
            if (report) {
              report.status = 'dismissed';
            }
          })
        );
      },

      unhideTarget: (targetId) => {
        set(
          produce((state: ModerationState) => {
            state.hiddenTargetIds = state.hiddenTargetIds.filter((id) => id !== targetId);
          })
        );
      },
    }),
    {
      name: 'moderation-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        reports: state.reports,
        hiddenTargetIds: state.hiddenTargetIds,
        suspendedUserIds: state.suspendedUserIds,
      }),
    }
  )
);
