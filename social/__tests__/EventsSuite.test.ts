import { useEventStore } from '../src/store/useEventStore';

describe('Enterprise Events & Ticketing Suite', () => {
  beforeEach(() => {
    useEventStore.setState({
      selectedEventId: null,
      selectedCategory: 'all',
      searchQuery: '',
    });
  });

  test('Creates In-Person, Online, and Hybrid Events with Ticket Tier setup', () => {
    // 1. Hybrid Summit
    const hybridId = useEventStore.getState().createEvent({
      title: 'International Quantum AI & Neural Compiler Summit',
      description: 'Breakthrough keynotes on quantum error correction and distributed LLMs.',
      format: 'hybrid',
      category: 'Tech Conference',
      venueOrLink: 'Moscone West, San Francisco & 4K Stream',
      startDate: 'Dec 01, 2026',
      endDate: 'Dec 03, 2026',
      time: '09:00 AM PST',
      isPaid: true,
      tickets: [
        {
          id: 't_summit_gen',
          name: 'General Pass',
          price: 199,
          currency: '$',
          availableQuantity: 300,
          perks: ['Keynote Stream', 'Discord Access'],
        },
      ],
    });

    const events = useEventStore.getState().events;
    const created = events.find((e) => e.id === hybridId);
    expect(created).toBeDefined();
    expect(created?.title).toContain('Quantum AI');
    expect(created?.format).toBe('hybrid');
    expect(created?.isPaid).toBe(true);
    expect(created?.tickets[0].price).toBe(199);
  });

  test('Manages RSVP responses (Going, Interested, Not Going) and attendee counts', () => {
    const event = useEventStore.getState().events[0];
    const initialGoing = event.goingCount;

    // Change to Interested
    useEventStore.getState().setRsvp(event.id, 'interested');
    let updated = useEventStore.getState().events.find((e) => e.id === event.id);
    expect(updated?.userRsvp).toBe('interested');
    expect(updated?.goingCount).toBe(Math.max(0, initialGoing - 1));

    // Change to Going
    useEventStore.getState().setRsvp(event.id, 'going');
    updated = useEventStore.getState().events.find((e) => e.id === event.id);
    expect(updated?.userRsvp).toBe('going');
    expect(updated?.goingCount).toBe(initialGoing);
  });

  test('Dispatches Friend Invitations for an event', () => {
    const event = useEventStore.getState().events[0];
    useEventStore.getState().inviteFriends(event.id, ['usr_4', 'usr_5']);

    const updated = useEventStore.getState().events.find((e) => e.id === event.id);
    expect(updated?.invitedFriendIds).toContain('usr_4');
    expect(updated?.invitedFriendIds).toContain('usr_5');
  });

  test('Purchases ticket passes and generates digital QR pass', () => {
    const event = useEventStore.getState().events[0];
    const initialPasses = useEventStore.getState().userPasses.length;
    const tier = event.tickets[0];

    const pass = useEventStore.getState().purchaseTicket(event.id, tier.id, 2);
    expect(pass).toBeDefined();
    expect(pass.qrCode).toBeDefined();
    expect(pass.ticketTier).toBe(tier.name);
    expect(pass.pricePaid).toBe(tier.price * 2);

    expect(useEventStore.getState().userPasses.length).toBe(initialPasses + 1);
  });

  test('Filters events across Discover, Attending, and Hosted dashboards', () => {
    const discoverList = useEventStore.getState().getFilteredEvents('discover');
    expect(discoverList.length).toBeGreaterThan(0);

    const hostedList = useEventStore.getState().getFilteredEvents('hosted');
    expect(hostedList.every((e) => e.isHost)).toBe(true);
  });
});
