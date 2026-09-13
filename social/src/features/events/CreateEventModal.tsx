import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Switch,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Modal, Input, Button, SegmentedControl } from '../../shared/components';
import { useEventStore, EventFormat } from '../../store/useEventStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (eventId: string) => void;
}

const FORMAT_OPTIONS = [
  { id: 'in_person', label: '📍 In-Person' },
  { id: 'online', label: '🌐 Online' },
  { id: 'hybrid', label: '⚡ Hybrid' },
];

const CreateEventModalComponent: React.FC<CreateEventModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const { colors } = useTheme();
  const createEvent = useEventStore((state) => state.createEvent);
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [format, setFormat] = useState<EventFormat>('hybrid');
  const [category, setCategory] = useState('Tech Conference');
  const [startDate, setStartDate] = useState('Oct 15, 2026');
  const [endDate, setEndDate] = useState('Oct 17, 2026');
  const [time, setTime] = useState('10:00 AM - 05:00 PM PST');
  const [venueOrLink, setVenueOrLink] = useState('San Francisco Convention Center');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [ticketPrice, setTicketPrice] = useState('99');

  const isRTL = I18nManager.isRTL;

  const handleCreate = () => {
    if (!title.trim()) {
      showToast({ message: 'Please enter an event title.', type: 'warning' });
      return;
    }

    const eventId = createEvent({
      title: title.trim(),
      description: description.trim(),
      format,
      category,
      venueOrLink: venueOrLink.trim(),
      startDate,
      endDate,
      time,
      isPaid,
      tickets: [
        {
          id: `tier_${Date.now()}`,
          name: isPaid ? 'General Admission Pass' : 'Free Registration',
          price: isPaid ? parseFloat(ticketPrice) || 0 : 0,
          currency: '$',
          availableQuantity: 500,
          perks: ['Event Admission', 'Live Q&A Session', 'Digital Badge'],
        },
      ],
    });

    showToast({ message: `Event "${title}" published! 🎉`, type: 'success' });
    setTitle('');
    setDescription('');
    onClose();
    onCreated?.(eventId);
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Create New Event 📅">
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Input
          label="Event Title"
          placeholder="e.g. Next-Gen Mobile Architecture Summit 2026"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Format Selector */}
        <Typography variant="subtitle2" color={colors.text} bold style={{ marginTop: 6, marginBottom: 4 }}>
          Event Format
        </Typography>
        <SegmentedControl
          segments={FORMAT_OPTIONS}
          activeId={format}
          onSelect={(id) => setFormat(id as EventFormat)}
          size="sm"
        />

        {/* Category */}
        <Input
          label="Category"
          placeholder="e.g. Tech Conference, Hackathon, Webinar, Meetup"
          value={category}
          onChangeText={setCategory}
        />

        {/* Date & Time */}
        <Input
          label="Dates"
          placeholder="e.g. Oct 15 - Oct 17, 2026"
          value={startDate}
          onChangeText={setStartDate}
        />

        <Input
          label="Time & Timezone"
          placeholder="e.g. 10:00 AM - 05:00 PM PST"
          value={time}
          onChangeText={setTime}
        />

        {/* Venue or Stream URL */}
        <Input
          label={format === 'online' ? 'Live Stream / Webinar Link' : 'Venue Location / Address'}
          placeholder={format === 'online' ? 'https://live.socialsphere.enterprise/...' : 'e.g. Moscone Center, San Francisco, CA'}
          value={venueOrLink}
          onChangeText={setVenueOrLink}
        />

        {/* Description */}
        <Input
          label="Event Description & Keynotes"
          placeholder="Describe speakers, workshops, agenda, and expectations..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Paid Ticket Switch */}
        <View
          style={[
            styles.switchRow,
            {
              borderTopColor: colors.borderSubtle,
              borderBottomColor: colors.borderSubtle,
              flexDirection: isRTL ? 'row-reverse' : 'row',
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Typography variant="subtitle2" color={colors.text} bold>
              Require Paid Tickets 🎟️
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Monetize event with ticketing checkout
            </Typography>
          </View>
          <Switch
            value={isPaid}
            onValueChange={setIsPaid}
            trackColor={{ false: colors.borderSubtle, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {isPaid && (
          <Input
            label="General Admission Price ($ USD)"
            placeholder="99"
            value={ticketPrice}
            onChangeText={setTicketPrice}
            keyboardType="numeric"
          />
        )}

        <Button
          label="Publish Event"
          variant="primary"
          size="lg"
          onPress={handleCreate}
          fullWidth
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </Modal>
  );
};

export const CreateEventModal = memo(CreateEventModalComponent);

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
    gap: 8,
  },
  switchRow: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
});
