import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';
import { eventBus } from '../core/events/EventBus';

export type EventFormat = 'in_person' | 'online' | 'hybrid';
export type EventRsvpStatus = 'going' | 'interested' | 'not_going';

export interface EventTicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  availableQuantity: number;
  perks: string[];
}

export interface UserTicketPass {
  id: string;
  eventId: string;
  eventTitle: string;
  ticketTier: string;
  qrCode: string;
  attendeeName: string;
  purchaseDate: string;
  pricePaid: number;
  format: EventFormat;
  venueOrLink: string;
}

export interface EventAttendee {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'going' | 'interested';
}

export interface EventModel {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  format: EventFormat;
  category: string;
  venueOrLink: string;
  startDate: string;
  endDate: string;
  time: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostVerified: boolean;
  goingCount: number;
  interestedCount: number;
  userRsvp: EventRsvpStatus | null;
  isHost: boolean;
  isPaid: boolean;
  tickets: EventTicketTier[];
  attendees: EventAttendee[];
  invitedFriendIds: string[];
}

interface EventState {
  events: EventModel[];
  userPasses: UserTicketPass[];
  selectedCategory: string;
  searchQuery: string;
  selectedEventId: string | null;

  setSelectedEventId: (id: string | null) => void;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;

  createEvent: (params: {
    title: string;
    description: string;
    coverUrl?: string;
    format: EventFormat;
    category: string;
    venueOrLink: string;
    startDate: string;
    endDate: string;
    time: string;
    isPaid: boolean;
    tickets?: EventTicketTier[];
  }) => string;

  setRsvp: (eventId: string, status: EventRsvpStatus) => void;
  inviteFriends: (eventId: string, friendIds: string[]) => void;
  purchaseTicket: (eventId: string, ticketTierId: string, quantity?: number) => UserTicketPass;
  getFilteredEvents: (tab: 'discover' | 'attending' | 'hosted') => EventModel[];
}

const INITIAL_EVENTS: EventModel[] = [
  {
    id: 'evt_1',
    title: 'Global React Native & TurboModules Summit 2026 ⚛️',
    description: 'The world premier gathering for React Native core contributors, staff mobile architects, and JSI runtime engineers. Keynotes on Hermes 2.0, multi-threaded rendering, and on-device WebGPU.',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    format: 'hybrid',
    category: 'Tech Conference',
    venueOrLink: 'Moscone Center, San Francisco & Live 4K Stream',
    startDate: 'Sep 18, 2026',
    endDate: 'Sep 20, 2026',
    time: '09:00 AM - 06:00 PM PST',
    hostId: 'usr_meta_998',
    hostName: 'Alex Rivera',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    hostVerified: true,
    goingCount: 1420,
    interestedCount: 3850,
    userRsvp: 'going',
    isHost: true,
    isPaid: true,
    tickets: [
      {
        id: 't_early',
        name: 'Early Bird Pass',
        price: 299,
        currency: '$',
        availableQuantity: 150,
        perks: ['Full 3-Day Keynote Access', 'Networking Reception', 'Official Summit T-Shirt'],
      },
      {
        id: 't_vip',
        name: 'VIP Architect All-Access',
        price: 699,
        currency: '$',
        availableQuantity: 40,
        perks: ['Private Dinner with Core Contributors', 'Priority Front-Row Seating', 'Workshop Recordings'],
      },
    ],
    attendees: [
      { id: 'usr_1', name: 'Sarah Jenkins', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', status: 'going' },
      { id: 'usr_2', name: 'David Chen', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', status: 'going' },
      { id: 'usr_3', name: 'Elena Rostova', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', status: 'interested' },
    ],
    invitedFriendIds: ['usr_1', 'usr_2'],
  },
  {
    id: 'evt_2',
    title: 'Edge AI Hackathon: On-Device Foundation Models 🧠',
    description: '48-Hour intensive hackathon building sub-10ms multimodal neural pipelines on Snapdragon NPU and Apple Silicon.',
    coverUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    format: 'in_person',
    category: 'Hackathon',
    venueOrLink: 'Y Combinator HQ, Mountain View, CA',
    startDate: 'Oct 05, 2026',
    endDate: 'Oct 07, 2026',
    time: '10:00 AM PST',
    hostId: 'usr_1',
    hostName: 'Sarah Jenkins',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    hostVerified: true,
    goingCount: 480,
    interestedCount: 1200,
    userRsvp: 'interested',
    isHost: false,
    isPaid: false,
    tickets: [
      {
        id: 't_free_hack',
        name: 'Hacker Registration',
        price: 0,
        currency: '$',
        availableQuantity: 500,
        perks: ['48h Hacker Pass', 'Cloud GPUs & Food provided', 'Eligible for $50,000 Grand Prize'],
      },
    ],
    attendees: [
      { id: 'usr_1', name: 'Sarah Jenkins', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', status: 'going' },
    ],
    invitedFriendIds: [],
  },
  {
    id: 'evt_3',
    title: 'Distributed Systems & WebAssembly Masterclass 🌐',
    description: 'Deep dive into decentralized consensus, zero-knowledge rollups, and high-performance serverless WASM engines.',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    format: 'online',
    category: 'Webinar',
    venueOrLink: 'https://live.socialsphere.enterprise/wasm-masterclass',
    startDate: 'Nov 12, 2026',
    endDate: 'Nov 12, 2026',
    time: '02:00 PM EST',
    hostId: 'usr_2',
    hostName: 'David Chen',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    hostVerified: true,
    goingCount: 2800,
    interestedCount: 6400,
    userRsvp: null,
    isHost: false,
    isPaid: true,
    tickets: [
      {
        id: 't_stream',
        name: 'Live Stream Access Ticket',
        price: 49,
        currency: '$',
        availableQuantity: 5000,
        perks: ['Interactive Q&A Session', 'Source Code Repository Access', 'Lifetime Replay Video'],
      },
    ],
    attendees: [],
    invitedFriendIds: [],
  },
];

const INITIAL_PASSES: UserTicketPass[] = [
  {
    id: 'pass_101',
    eventId: 'evt_1',
    eventTitle: 'Global React Native & TurboModules Summit 2026',
    ticketTier: 'VIP Architect All-Access',
    qrCode: 'SOCIALSPHERE-EVT-1-VIP-PASS-99882',
    attendeeName: 'Alex Rivera',
    purchaseDate: 'Yesterday',
    pricePaid: 699,
    format: 'hybrid',
    venueOrLink: 'Moscone Center, San Francisco & Live 4K Stream',
  },
];

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: INITIAL_EVENTS,
      userPasses: INITIAL_PASSES,
      selectedCategory: 'all',
      searchQuery: '',
      selectedEventId: null,

      setSelectedEventId: (id) => set({ selectedEventId: id }),
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      createEvent: ({
        title,
        description,
        coverUrl = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        format,
        category,
        venueOrLink,
        startDate,
        endDate,
        time,
        isPaid,
        tickets = [],
      }) => {
        const id = `evt_${Date.now()}`;
        const newEvent: EventModel = {
          id,
          title,
          description,
          coverUrl,
          format,
          category,
          venueOrLink,
          startDate,
          endDate,
          time,
          hostId: 'usr_meta_998',
          hostName: 'Alex Rivera',
          hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          hostVerified: true,
          goingCount: 1,
          interestedCount: 0,
          userRsvp: 'going',
          isHost: true,
          isPaid,
          tickets: tickets.length > 0 ? tickets : [
            {
              id: `t_gen_${Date.now()}`,
              name: 'General Admission',
              price: isPaid ? 99 : 0,
              currency: '$',
              availableQuantity: 200,
              perks: ['Event Admission', 'Badge & Swag'],
            },
          ],
          attendees: [
            {
              id: 'usr_meta_998',
              name: 'Alex Rivera',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
              status: 'going',
            },
          ],
          invitedFriendIds: [],
        };

        set(
          produce((state: EventState) => {
            state.events.unshift(newEvent);
          })
        );

        eventBus.emit('FEED:POST_CREATED', { postId: id, authorId: 'usr_meta_998' });
        return id;
      },

      setRsvp: (eventId, status) => {
        set(
          produce((state: EventState) => {
            const evt = state.events.find((e) => e.id === eventId);
            if (!evt) return;

            const prevStatus = evt.userRsvp;
            if (prevStatus === status) return;

            if (prevStatus === 'going') evt.goingCount = Math.max(0, evt.goingCount - 1);
            if (prevStatus === 'interested') evt.interestedCount = Math.max(0, evt.interestedCount - 1);

            if (status === 'going') evt.goingCount += 1;
            if (status === 'interested') evt.interestedCount += 1;

            evt.userRsvp = status;

            // Update attendees list
            const existingIndex = evt.attendees.findIndex((a) => a.id === 'usr_meta_998');
            if (status === 'not_going') {
              if (existingIndex > -1) evt.attendees.splice(existingIndex, 1);
            } else {
              if (existingIndex > -1) {
                evt.attendees[existingIndex].status = status;
              } else {
                evt.attendees.push({
                  id: 'usr_meta_998',
                  name: 'Alex Rivera',
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
                  status,
                });
              }
            }
          })
        );
      },

      inviteFriends: (eventId, friendIds) => {
        set(
          produce((state: EventState) => {
            const evt = state.events.find((e) => e.id === eventId);
            if (evt) {
              const unique = Array.from(new Set([...evt.invitedFriendIds, ...friendIds]));
              evt.invitedFriendIds = unique;
            }
          })
        );
      },

      purchaseTicket: (eventId, ticketTierId, quantity = 1) => {
        const evt = get().events.find((e) => e.id === eventId);
        const tier = evt?.tickets.find((t) => t.id === ticketTierId);

        const newPass: UserTicketPass = {
          id: `pass_${Date.now()}`,
          eventId,
          eventTitle: evt?.title || 'Event Pass',
          ticketTier: tier?.name || 'General Admission',
          qrCode: `SOCIALSPHERE-PASS-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          attendeeName: 'Alex Rivera',
          purchaseDate: 'Just now',
          pricePaid: (tier?.price || 0) * quantity,
          format: evt?.format || 'in_person',
          venueOrLink: evt?.venueOrLink || 'Venue',
        };

        set(
          produce((state: EventState) => {
            state.userPasses.unshift(newPass);
            const targetEvt = state.events.find((e) => e.id === eventId);
            if (targetEvt && targetEvt.userRsvp !== 'going') {
              targetEvt.userRsvp = 'going';
              targetEvt.goingCount += 1;
            }
          })
        );

        return newPass;
      },

      getFilteredEvents: (tab) => {
        const { events, selectedCategory, searchQuery } = get();
        const q = searchQuery.toLowerCase().trim();

        let list = [...events];

        if (tab === 'attending') {
          list = list.filter((e) => e.userRsvp === 'going' || e.userRsvp === 'interested');
        } else if (tab === 'hosted') {
          list = list.filter((e) => e.isHost);
        }

        if (selectedCategory !== 'all') {
          list = list.filter((e) => e.category.toLowerCase().includes(selectedCategory.toLowerCase()));
        }

        if (q) {
          list = list.filter(
            (e) =>
              e.title.toLowerCase().includes(q) ||
              e.description.toLowerCase().includes(q) ||
              e.venueOrLink.toLowerCase().includes(q) ||
              e.category.toLowerCase().includes(q)
          );
        }

        return list;
      },
    }),
    {
      name: 'events-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        events: state.events,
        userPasses: state.userPasses,
      }),
    }
  )
);
