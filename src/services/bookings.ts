import { api } from './api';
import { Booking } from '../types';

export const bookingService = {
  getUserBookings: (userId: number) => 
    api.get<Booking[]>(`/api/bookings/${userId}`),
  
  createBooking: (bookingData: any) => 
    api.post<Booking>('/api/bookings', bookingData),
  
  cancelBooking: (bookingId: number) => 
    api.delete(`/api/bookings/${bookingId}`),
};
