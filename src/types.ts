export interface User {
  uid: string;
  email: string;
  fullName: string;
  name?: string; // For backward compatibility with UI
  birthDate?: string;
  dob?: string; // For backward compatibility with UI
  gender?: string;
  phoneNumber?: string;
  phone?: string; // For backward compatibility with UI
  country?: string;
  address?: string;
  zipCode?: string; // For backward compatibility with UI
  preferredDestinations?: string[];
  travelHistory?: string[];
  role: 'user' | 'admin';
  createdAt: string;
  avatar?: string;
  bio?: string;
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
  id: string;
  userId: string;
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
  itemId?: string;
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
  travelers?: Traveler[];
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
  meals?: string;
  transportation?: string;
  weather?: string;
}

export interface Hotel {
  id: string;
  name: string;
  destinationId: string;
  location: string;
  city?: string;
  country?: string;
  contact?: string;
  price: number;
  rating: number;
  image: string;
  images?: string[];
  description: string;
  amenities: string[];
  highlights?: PackageHighlight[];
}

export interface Traveler {
  fullName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  passportExpiration: string;
  gender: 'Male' | 'Female' | 'Other' | '';
}

export type Screen = 
  | 'splash' 
  | 'auth-welcome' | 'auth-email' | 'auth-password' | 'auth-signup' | 'auth-forgot' | 'auth-verify' 
  | 'home' | 'packages-list' | 'package-details' | 'place-list' | 'flight-search' | 'flight-results' | 'flight-details' 
  | 'hotel-search' | 'hotel-results' | 'hotel-details' | 'hotel-confirmation' | 'location-picker'
  | 'seat-selection' | 'check-availability' | 'payment' | 'confirmation' | 'traveler-info' | 'ticket' | 'success'
  | 'my-trips' | 'trip-details' | 'saved' | 'profile' | 'settings' | 'alerts' | 'privacy';
