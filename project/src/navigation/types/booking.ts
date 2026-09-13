/**
 * GoSeat Navigation System - Booking Flow Param List
 */

export type BookingStackParamList = {
  SeatSelection: {
    busId: string;
    busName: string;
    origin: string;
    destination: string;
    departureTime: string;
    pricePerSeat: number;
  };
  PassengerInfo: {
    busId: string;
    busName: string;
    selectedSeats: string[];
    totalAmount: number;
  };
  Confirmation: {
    bookingId: string;
    busName: string;
    seats: string[];
    totalAmount: number;
    passengerName: string;
    qrCodeData: string;
  };
};
