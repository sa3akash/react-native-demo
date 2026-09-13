import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Card, Button, SegmentedControl, Avatar } from '../../shared/components';
import { useModerationStore, ModerationReportTicket } from '../../store/useModerationStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface ModerationDashboardScreenProps {
  onBack?: () => void;
}

const DASHBOARD_TABS = [
  { id: 'all', label: 'All 📋' },
  { id: 'pending', label: 'Pending 🚩' },
  { id: 'quarantined', label: 'AI Quarantined 🤖' },
  { id: 'resolved', label: 'Resolved ✅' },
];

export const ModerationDashboardScreenComponent: React.FC<ModerationDashboardScreenProps> = ({
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const reports = useModerationStore((state) => state.reports);
  const enforceAction = useModerationStore((state) => state.enforceAction);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const isRTL = I18nManager.isRTL;

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'pending' && r.status !== 'pending') return false;
    if (activeTab === 'quarantined' && r.status !== 'quarantined') return false;
    if (activeTab === 'resolved' && r.status !== 'resolved' && r.status !== 'dismissed') return false;
    return true;
  });

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'nsfw':
        return '🔞 NSFW Adult Content';
      case 'hate_speech':
        return '🚨 Hate Speech';
      case 'toxicity':
        return '🛑 Harassment & Toxicity';
      case 'spam':
        return '🎣 Phishing & Spam';
      case 'impersonation':
        return '🎭 Impersonation';
      default:
        return '⚠️ Safety Violation';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Typography variant="h3" color={colors.text}>
              {isRTL ? '➡️' : '⬅️'}
            </Typography>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Typography variant="h2" color={colors.text} bold>
            Trust & Safety Center
          </Typography>
          <Typography variant="caption" color={colors.primary} bold>
            Automated AI Moderation & Enforcement
          </Typography>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabSection}>
        <SegmentedControl
          segments={DASHBOARD_TABS}
          activeId={activeTab}
          onSelect={setActiveTab}
          size="sm"
        />
      </View>

      {/* Reports List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredReports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Typography variant="h1" style={{ marginBottom: 12 }}>
              🛡️
            </Typography>
            <Typography variant="subtitle1" color={colors.text} bold>
              No Flagged Reports in this Category
            </Typography>
            <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
              All user reports and AI-quarantined content have been processed.
            </Typography>
          </View>
        ) : (
          filteredReports.map((report) => {
            const { aiEvaluation } = report;

            return (
              <Card
                key={report.id}
                variant="elevated"
                style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}
              >
                {/* Header */}
                <View style={styles.ticketHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Typography variant="caption" color={colors.textSecondary} bold>
                      TICKET #{report.id.toUpperCase()} • {report.createdAt}
                    </Typography>
                    <Typography variant="subtitle2" color={colors.primary} bold style={{ marginTop: 2 }}>
                      {getCategoryEmoji(report.reasonCategory)}
                    </Typography>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          report.status === 'quarantined'
                            ? '#FF3B3020'
                            : report.status === 'pending'
                            ? '#FF950020'
                            : '#34C75920',
                      },
                    ]}
                  >
                    <Typography
                      variant="caption"
                      color={
                        report.status === 'quarantined'
                          ? '#FF3B30'
                          : report.status === 'pending'
                          ? '#FF9500'
                          : '#34C759'
                      }
                      bold
                      style={{ fontSize: 10 }}
                    >
                      {report.status.toUpperCase()}
                    </Typography>
                  </View>
                </View>

                {/* Target Author */}
                <View style={styles.authorRow}>
                  <Avatar uri={report.targetAuthorAvatar} name={report.targetAuthorName} size="sm" />
                  <Typography variant="caption" color={colors.text} bold style={{ marginLeft: 8 }}>
                    Author: {report.targetAuthorName} ({report.targetType})
                  </Typography>
                </View>

                {/* Content Snippet */}
                <View style={[styles.snippetBox, { backgroundColor: colors.inputBg, borderRadius: theme.radius.sm }]}>
                  <Typography variant="body2" color={colors.text}>
                    "{report.targetContentSnippet}"
                  </Typography>
                </View>

                {/* AI Safety Evaluation Radar */}
                <View style={[styles.aiRadarBox, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md }]}>
                  <View style={styles.aiTitleRow}>
                    <Typography variant="caption" color={colors.primary} bold>
                      🤖 AI MULTI-VECTOR SAFETY CLASSIFIER
                    </Typography>
                    <Typography variant="caption" color={colors.text} bold>
                      {(aiEvaluation.highestConfidenceScore * 100).toFixed(0)}% Confidence
                    </Typography>
                  </View>

                  <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
                    {aiEvaluation.explanation}
                  </Typography>

                  {/* Confidence Breakdown Bars */}
                  <View style={styles.barsContainer}>
                    <View style={styles.barItem}>
                      <Typography variant="caption" style={{ fontSize: 10 }}>NSFW: {(aiEvaluation.scores.nsfw * 100).toFixed(0)}%</Typography>
                      <View style={styles.barBg}>
                        <View style={[styles.barFill, { width: `${aiEvaluation.scores.nsfw * 100}%`, backgroundColor: '#FF2D55' }]} />
                      </View>
                    </View>

                    <View style={styles.barItem}>
                      <Typography variant="caption" style={{ fontSize: 10 }}>Hate: {(aiEvaluation.scores.hateSpeech * 100).toFixed(0)}%</Typography>
                      <View style={styles.barBg}>
                        <View style={[styles.barFill, { width: `${aiEvaluation.scores.hateSpeech * 100}%`, backgroundColor: '#FF9500' }]} />
                      </View>
                    </View>

                    <View style={styles.barItem}>
                      <Typography variant="caption" style={{ fontSize: 10 }}>Spam: {(aiEvaluation.scores.spam * 100).toFixed(0)}%</Typography>
                      <View style={styles.barBg}>
                        <View style={[styles.barFill, { width: `${aiEvaluation.scores.spam * 100}%`, backgroundColor: '#0A84FF' }]} />
                      </View>
                    </View>

                    <View style={styles.barItem}>
                      <Typography variant="caption" style={{ fontSize: 10 }}>Toxicity: {(aiEvaluation.scores.toxicity * 100).toFixed(0)}%</Typography>
                      <View style={styles.barBg}>
                        <View style={[styles.barFill, { width: `${aiEvaluation.scores.toxicity * 100}%`, backgroundColor: '#AF52DE' }]} />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Admin Enforcement Actions */}
                {report.status !== 'resolved' && report.status !== 'dismissed' && (
                  <View style={styles.enforceBtnRow}>
                    <Button
                      label="Dismiss (False Positive)"
                      variant="ghost"
                      size="sm"
                      onPress={() => {
                        enforceAction(report.id, 'dismiss');
                        showToast({ message: 'Report dismissed', type: 'info' });
                      }}
                      style={{ flex: 1 }}
                    />
                    <Button
                      label="Quarantine / Hide 🛑"
                      variant="primary"
                      size="sm"
                      onPress={() => {
                        enforceAction(report.id, 'quarantine');
                        showToast({ message: 'Content quarantined and masked', type: 'warning' });
                      }}
                      style={{ flex: 1 }}
                    />
                    <Button
                      label="Suspend User 🚫"
                      variant="primary"
                      size="sm"
                      onPress={() => {
                        enforceAction(report.id, 'suspend_user');
                        showToast({ message: `User ${report.targetAuthorName} suspended`, type: 'warning' });
                      }}
                      style={{ flex: 1 }}
                    />
                  </View>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export const ModerationDashboardScreen = memo(ModerationDashboardScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  tabSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  ticketCard: {
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  snippetBox: {
    padding: 10,
  },
  aiRadarBox: {
    padding: 12,
  },
  aiTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  barItem: {
    flex: 1,
  },
  barBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 3,
  },
  barFill: {
    height: '100%',
  },
  enforceBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
});
