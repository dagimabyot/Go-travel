export interface User {
  id: number;
  email: string;
  name: string;
  frequent_flyer_no?: string;
  saved_payment_methods?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  country?: string;
  zipCode?: string;
  avatar?: string;
  bio?: string;
  passport?: string;
}

export interface Flight {
  id: string;
  airline: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  price: number;
  duration: string;
  class: string;
  status?: 'On Time' | 'Delayed' | 'Cancelled';
}

export interface Booking {
  id: number;
  user_id: number;
  type: 'package' | 'flight' | 'hotel';
  // Flight specific
  flight_id?: string;
  from_city?: string;
  to_city?: string;
  departure_time?: string;
  arrival_time?: string;
  airline?: string;
  seat?: string;
  // Package/Hotel specific
  item_id?: string;
  name?: string;
  location?: string;
  image?: string;
  rating?: number;
  // Common
  price: number;
  status: string;
  date?: string;
  description?: string;
  guests?: string;
  isFavorite?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'booking' | 'reminder' | 'system';
}

export interface PackageHighlight {
  title: string;
  description: string;
}

export interface Package {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  images?: string[];
  description: string;
  included: string[];
  duration: string;
  category?: string;
  weKnowWhatYouWant?: string;
  weKnowWhatYouWantSecondary?: string;
  highlights?: PackageHighlight[];
  sunsetTitle?: string;
  sunsetDescription?: string;
  sunsetDescriptionSecondary?: string;
  sunsetImage?: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  images?: string[];
  description: string;
  amenities: string[];
}

export type Screen = 
  | 'splash' 
  | 'auth-welcome' | 'auth-email' | 'auth-password' | 'auth-signup' | 'auth-forgot' | 'auth-verify' 
  | 'home' | 'packages-list' | 'package-details' | 'place-list' | 'flight-search' | 'flight-results' | 'flight-details' 
  | 'hotel-search' | 'hotel-results' | 'hotel-details' | 'hotel-confirmation' | 'location-picker'
  | 'seat-selection' | 'check-availability' | 'payment' | 'confirmation' | 'ticket' | 'success'
  | 'my-trips' | 'trip-details' | 'saved' | 'profile' | 'settings' | 'alerts';
