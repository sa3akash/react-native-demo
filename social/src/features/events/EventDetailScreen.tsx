import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Avatar, Button } from '../../shared/components';
import { useEventStore, EventModel, UserTicketPass } from '../../store/useEventStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { InviteFriendsModal } from './InviteFriendsModal';
import { TicketPurchaseModal } from './TicketPurchaseModal';
import { UserTicketPassModal } from './UserTicketPassModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface EventDetailScreenProps {
  eventId: string;
  onBack: () => void;
}

const EventDetailScreenComponent: React.FC<EventDetailScreenProps> = ({
  eventId,
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const event = useEventStore((state) => state.events.find((e) => e.id === eventId));
  const setRsvp = useEventStore((state) => state.setRsvp);
  const userPasses = useEventStore((state) => state.userPasses);
  const { showToast } = useToast();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [activePassModal, setActivePassModal] = useState<UserTicketPass | null>(null);

  const isRTL = I18nManager.isRTL;

  if (!event) return null;

  const existingPass = userPasses.find((p) => p.eventId === event.id);

  const getFormatPill = (fmt: string) => {
    switch (fmt) {
      case 'in_person':
        return '📍 In-Person';
      case 'online':
        return '🌐 Online Stream';
      case 'hybrid':
        return '⚡ Hybrid (In-Person & Online)';
      default:
        return '📅 Event';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: event.coverUrl }} style={styles.heroCover} resizeMode="cover" />

          <TouchableOpacity onPress={onBack} style={styles.floatingBackBtn}>
            <Typography variant="h3" color="#FFFFFF">
              {isRTL ? '➡️' : '⬅️'}
            </Typography>
          </TouchableOpacity>

          <View style={[styles.dateBadge, { backgroundColor: colors.primary }]}>
            <Typography variant="caption" color="#FFFFFF" bold style={{ fontSize: 11 }}>
              {event.startDate}
            </Typography>
          </View>
        </View>

        {/* Header Details */}
        <View style={[styles.headerCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.formatRow}>
            <View style={[styles.formatPill, { backgroundColor: colors.surfaceElevated }]}>
              <Typography variant="caption" color={colors.primary} bold>
                {getFormatPill(event.format)}
              </Typography>
            </View>
            <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 8 }}>
              {event.category}
            </Typography>
          </View>

          <Typography variant="h2" color={colors.text} bold style={styles.titleText}>
            {event.title}
          </Typography>

          <View style={styles.timeLocationSection}>
            <View style={styles.infoRow}>
              <Typography variant="body1">🕒</Typography>
              <Typography variant="caption" color={colors.text} style={{ marginLeft: 8 }}>
                {event.startDate} • {event.time}
              </Typography>
            </View>
            <View style={styles.infoRow}>
              <Typography variant="body1">📍</Typography>
              <Typography variant="caption" color={colors.text} bold style={{ marginLeft: 8, flex: 1 }}>
                {event.venueOrLink}
              </Typography>
            </View>
          </View>

          {/* Host Card */}
          <View style={[styles.hostCard, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md }]}>
            <Avatar uri={event.hostAvatar} name={event.hostName} size="md" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Typography variant="caption" color={colors.textSecondary}>
                HOSTED BY
              </Typography>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="subtitle2" color={colors.text} bold>
                  {event.hostName}
                </Typography>
                {event.hostVerified && (
                  <Typography variant="caption" color="#0A84FF" style={{ marginLeft: 4 }}>
                    ☑️
                  </Typography>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* RSVP & Invite Action Bar */}
        <View style={[styles.rsvpCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
          <Typography variant="subtitle2" color={colors.text} bold style={{ marginBottom: 8 }}>
            Your RSVP Response
          </Typography>
          <View style={styles.rsvpBtnRow}>
            <TouchableOpacity
              onPress={() => {
                setRsvp(event.id, 'going');
                showToast({ message: "You're going to this event! 🎉", type: 'success' });
              }}
              style={[
                styles.rsvpBtn,
                {
                  backgroundColor: event.userRsvp === 'going' ? colors.primary : colors.surfaceElevated,
                  borderColor: event.userRsvp === 'going' ? colors.primary : colors.borderSubtle,
                },
              ]}
            >
              <Typography variant="caption" color={event.userRsvp === 'going' ? '#FFFFFF' : colors.text} bold>
                ✓ Going ({event.goingCount})
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setRsvp(event.id, 'interested');
                showToast({ message: 'Marked as interested ⭐', type: 'info' });
              }}
              style={[
                styles.rsvpBtn,
                {
                  backgroundColor: event.userRsvp === 'interested' ? colors.primaryLight : colors.surfaceElevated,
                  borderColor: event.userRsvp === 'interested' ? colors.primary : colors.borderSubtle,
                },
              ]}
            >
              <Typography variant="caption" color={event.userRsvp === 'interested' ? colors.primary : colors.text} bold>
                ⭐ Interested ({event.interestedCount})
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsInviteModalOpen(true)}
              style={[styles.rsvpBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderSubtle }]}
            >
              <Typography variant="caption" color={colors.text} bold>
                ✉️ Invite
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description & Agenda */}
        <View style={[styles.descCard, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 8 }}>
            About this Event
          </Typography>
          <Typography variant="body2" color={colors.textSecondary} style={{ lineHeight: 22 }}>
            {event.description}
          </Typography>
        </View>

        {/* Attendees Preview */}
        <View style={[styles.attendeesCard, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 10 }}>
            Who's Attending ({event.goingCount + event.interestedCount})
          </Typography>
          <View style={styles.attendeesList}>
            {event.attendees.map((att) => (
              <View key={att.id} style={styles.attendeePill}>
                <Avatar uri={att.avatarUrl} name={att.name} size="sm" />
                <Typography variant="caption" color={colors.text} style={{ marginLeft: 6 }}>
                  {att.name}
                </Typography>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.borderSubtle }]}>
        {existingPass ? (
          <Button
            label="View Digital QR Pass 🎟️"
            variant="primary"
            size="lg"
            onPress={() => setActivePassModal(existingPass)}
            fullWidth
          />
        ) : (
          <Button
            label={event.isPaid ? 'Get Tickets (From $99) 🎟️' : 'Register Free Pass 🎟️'}
            variant="primary"
            size="lg"
            onPress={() => setIsTicketModalOpen(true)}
            fullWidth
          />
        )}
      </View>

      {/* Invite Friends Modal */}
      <InviteFriendsModal
        visible={isInviteModalOpen}
        eventId={event.id}
        onClose={() => setIsInviteModalOpen(false)}
      />

      {/* Ticket Purchase Modal */}
      <TicketPurchaseModal
        visible={isTicketModalOpen}
        event={event}
        onClose={() => setIsTicketModalOpen(false)}
        onSuccess={(pass) => setActivePassModal(pass)}
      />

      {/* User Pass QR Modal */}
      <UserTicketPassModal
        visible={Boolean(activePassModal)}
        pass={activePassModal}
        onClose={() => setActivePassModal(null)}
      />
    </View>
  );
};

export const EventDetailScreen = memo(EventDetailScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  coverContainer: {
    width: SCREEN_WIDTH,
    height: 240,
    position: 'relative',
  },
  heroCover: {
    width: '100%',
    height: '100%',
  },
  floatingBackBtn: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  dateBadge: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerCard: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  formatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formatPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  titleText: {
    marginTop: 8,
    lineHeight: 28,
  },
  timeLocationSection: {
    marginVertical: 12,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 6,
  },
  rsvpCard: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rsvpBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rsvpBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  descCard: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  attendeesCard: {
    padding: 16,
  },
  attendeesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  attendeePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingVertical: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
