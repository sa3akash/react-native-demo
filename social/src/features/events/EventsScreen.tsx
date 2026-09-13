import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, SearchBar, Button, SegmentedControl, Avatar } from '../../shared/components';
import { useEventStore, EventModel, UserTicketPass } from '../../store/useEventStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { EventDetailScreen } from './EventDetailScreen';
import { CreateEventModal } from './CreateEventModal';
import { UserTicketPassModal } from './UserTicketPassModal';

export interface EventsScreenProps {
  onSelectEvent?: (eventId: string) => void;
}

const EVENT_TABS = [
  { id: 'discover', label: 'Discover 📅' },
  { id: 'attending', label: 'Attending ✓' },
  { id: 'hosted', label: 'Hosted 👑' },
  { id: 'passes', label: 'Passes 🎟️' },
];

export const EventsScreenComponent: React.FC<EventsScreenProps> = () => {
  const { colors, theme } = useTheme();
  const getFilteredEvents = useEventStore((state) => state.getFilteredEvents);
  const userPasses = useEventStore((state) => state.userPasses);
  const searchQuery = useEventStore((state) => state.searchQuery);
  const setSearchQuery = useEventStore((state) => state.setSearchQuery);
  const setRsvp = useEventStore((state) => state.setRsvp);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'discover' | 'attending' | 'hosted' | 'passes'>('discover');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activePass, setActivePass] = useState<UserTicketPass | null>(null);

  if (selectedEventId) {
    return <EventDetailScreen eventId={selectedEventId} onBack={() => setSelectedEventId(null)} />;
  }

  const events = activeTab !== 'passes' ? getFilteredEvents(activeTab) : [];

  const getFormatPill = (fmt: string) => {
    switch (fmt) {
      case 'in_person':
        return '📍 In-Person';
      case 'online':
        return '🌐 Online';
      case 'hybrid':
        return '⚡ Hybrid';
      default:
        return '📅 Event';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerTitleRow}>
          <Typography variant="h2" color={colors.text} bold>
            Events & Summits
          </Typography>
          <Button
            label="+ Create"
            variant="primary"
            size="sm"
            onPress={() => setIsCreateModalOpen(true)}
          />
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search summits, hackathons, webinars..."
        />

        <View style={{ marginTop: 8 }}>
          <SegmentedControl
            segments={EVENT_TABS}
            activeId={activeTab}
            onSelect={(id) => setActiveTab(id as any)}
            size="sm"
          />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'passes' ? (
          // My Passes Tab
          userPasses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Typography variant="h1" style={{ marginBottom: 12 }}>
                🎟️
              </Typography>
              <Typography variant="subtitle1" color={colors.text} bold>
                No Event Passes Found
              </Typography>
              <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
                When you register or purchase tickets for an event, your digital QR passes will appear here.
              </Typography>
            </View>
          ) : (
            userPasses.map((pass) => (
              <TouchableOpacity
                key={pass.id}
                activeOpacity={0.9}
                onPress={() => setActivePass(pass)}
                style={[styles.passCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg, borderColor: colors.borderSubtle }]}
              >
                <View style={styles.passCardLeft}>
                  <Typography variant="caption" color={colors.primary} bold>
                    {pass.ticketTier.toUpperCase()}
                  </Typography>
                  <Typography variant="subtitle1" color={colors.text} bold numberOfLines={2} style={{ marginTop: 2 }}>
                    {pass.eventTitle}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
                    📍 {pass.venueOrLink}
                  </Typography>
                </View>
                <View style={styles.passCardRight}>
                  <Typography variant="h2">🏁</Typography>
                  <Typography variant="caption" color={colors.primary} bold style={{ marginTop: 4, fontSize: 10 }}>
                    View QR →
                  </Typography>
                </View>
              </TouchableOpacity>
            ))
          )
        ) : (
          // Event Discovery List
          events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Typography variant="h1" style={{ marginBottom: 12 }}>
                📅
              </Typography>
              <Typography variant="subtitle1" color={colors.text} bold>
                No Events Found
              </Typography>
              <Typography variant="caption" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: 4 }}>
                {activeTab === 'attending'
                  ? "You haven't RSVP'd to any upcoming events yet."
                  : 'Try adjusting your search query or check back soon for new summits.'}
              </Typography>
            </View>
          ) : (
            events.map((evt) => (
              <TouchableOpacity
                key={evt.id}
                activeOpacity={0.9}
                onPress={() => setSelectedEventId(evt.id)}
                style={[styles.eventCard, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}
              >
                {/* Cover Image */}
                <Image source={{ uri: evt.coverUrl }} style={styles.cardCover} resizeMode="cover" />

                <View style={styles.cardBody}>
                  {/* Format & Category */}
                  <View style={styles.cardMetaRow}>
                    <View style={[styles.formatTag, { backgroundColor: colors.surfaceElevated }]}>
                      <Typography variant="caption" color={colors.primary} bold style={{ fontSize: 10 }}>
                        {getFormatPill(evt.format)}
                      </Typography>
                    </View>
                    <Typography variant="caption" color={colors.textSecondary} style={{ marginLeft: 6 }}>
                      {evt.category} • {evt.startDate}
                    </Typography>
                  </View>

                  {/* Title */}
                  <Typography variant="subtitle1" color={colors.text} bold numberOfLines={2} style={{ marginTop: 4 }}>
                    {evt.title}
                  </Typography>

                  {/* Location & Time */}
                  <Typography variant="caption" color={colors.textSecondary} numberOfLines={1} style={{ marginTop: 4 }}>
                    📍 {evt.venueOrLink}
                  </Typography>

                  {/* Footer Stats & Actions */}
                  <View style={styles.cardFooter}>
                    <View style={styles.attendeeStatRow}>
                      <Typography variant="caption" color={colors.textSecondary}>
                        👥 {evt.goingCount} going • {evt.interestedCount} interested
                      </Typography>
                    </View>

                    <Button
                      label={evt.userRsvp === 'going' ? 'Going ✓' : '+ RSVP'}
                      variant={evt.userRsvp === 'going' ? 'ghost' : 'primary'}
                      size="sm"
                      onPress={() => {
                        setRsvp(evt.id, evt.userRsvp === 'going' ? 'not_going' : 'going');
                        showToast({ message: evt.userRsvp === 'going' ? 'RSVP removed' : "You're going! 🎉", type: 'info' });
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )
        )}
      </ScrollView>

      {/* Create Event Modal */}
      <CreateEventModal
        visible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(id) => setSelectedEventId(id)}
      />

      {/* Pass QR Modal */}
      <UserTicketPassModal
        visible={Boolean(activePass)}
        pass={activePass}
        onClose={() => setActivePass(null)}
      />
    </View>
  );
};

export const EventsScreen = memo(EventsScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  eventCard: {
    overflow: 'hidden',
  },
  cardCover: {
    width: '100%',
    height: 140,
  },
  cardBody: {
    padding: 14,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formatTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  attendeeStatRow: {
    flex: 1,
  },
  passCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
  },
  passCardLeft: {
    flex: 1,
    paddingRight: 12,
  },
  passCardRight: {
    alignItems: 'center',
    paddingLeft: 12,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    width: '100%',
  },
});
