import { api } from './api';
import { Flight } from '../types';

export const flightService = {
  search: (from: string, to: string, date: string, flightClass: string) => 
    api.get<Flight[]>(`/api/flights/search?from=${from}&to=${to}&date=${date}&class=${flightClass}`),
};
