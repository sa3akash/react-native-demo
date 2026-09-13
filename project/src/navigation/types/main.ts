/**
 * GoSeat Navigation System - Main Bottom Tab Param List
 */

export type MainTabParamList = {
  Home: undefined;
  Search: { query?: string; origin?: string; destination?: string };
  MyTickets: { highlightTicketId?: string };
  Profile: undefined;
  Showcase: undefined;
};
