import { useState, useEffect } from 'react';
import { Screen, User, Flight, Booking, AppNotification, Package, Hotel } from '../types';

export const useApp = () => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('travel_user');
    if (saved) return JSON.parse(saved);
    return { 
      id: 1, 
      email: '', 
      name: '',
      avatar: ''
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('travel_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('travel_user');
    }
  }, [user]);
  const [currency, setCurrency] = useState('USD ($)');
  const [appearance, setAppearance] = useState('Light Mode');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('12A');
  const [packages, setPackages] = useState<Package[]>([]);
  const [savedPackages, setSavedPackages] = useState<Package[]>([]);
  const [savedBookings, setSavedBookings] = useState<Booking[]>([]);
  const [authEmail, setAuthEmail] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [settingsSubScreen, setSettingsSubScreen] = useState('main');
  const [guestCount, setGuestCount] = useState(1);
  const [travelers, setTravelers] = useState<import('../types').Traveler[]>([]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const addNotification = (title: string, body: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substring(7),
      title,
      body,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/bookings/${user.id}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  };

  useEffect(() => {
    fetch('/api/packages/search').then(res => res.json()).then(data => {
      setPackages(data);
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setScreen('home');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignup = async (name: string, email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setScreen('home');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (from: string, to: string, date: string, flightClass: string) => {
    try {
      const res = await fetch(`/api/flights/search?from=${from}&to=${to}&date=${date}&class=${flightClass}`);
      const data = await res.json();
      setFlights(data);
      setScreen('flight-results');
    } catch (err) {
      console.error(err);
    }
  };

  const [savedHotels, setSavedHotels] = useState<Hotel[]>([]);

  const toggleSavedHotel = (hotel: Hotel) => {
    setSavedHotels(prev => {
      const exists = prev.find(h => h.id === hotel.id);
      if (exists) {
        return prev.filter(h => h.id !== hotel.id);
      }
      return [...prev, hotel];
    });
  };

  const handleSearchHotels = async () => {
    try {
      const res = await fetch('/api/hotels/search');
      const data = await res.json();
      setHotels(data);
      setScreen('hotel-results');
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async (seat: string) => {
    if (!user || (!selectedFlight && !selectedPackage && !selectedHotel)) return;
    
    let bookingData: Partial<Booking> = {
      user_id: user.id,
      status: 'confirmed',
      date: new Date().toISOString(),
      guests: guestCount.toString(),
      travelers: travelers
    };

    if (selectedFlight) {
      bookingData = {
        ...bookingData,
        type: 'flight',
        flight_id: selectedFlight.id,
        from_city: selectedFlight.from,
        to_city: selectedFlight.to,
        departure_time: selectedFlight.departure,
        arrival_time: selectedFlight.arrival,
        airline: selectedFlight.airline,
        price: selectedFlight.price,
        seat
      };
    } else if (selectedPackage) {
      // Set a travel date 1 month in the future for demo purposes
      const travelDate = new Date();
      travelDate.setMonth(travelDate.getMonth() + 1);
      
      bookingData = {
        ...bookingData,
        type: 'package',
        item_id: selectedPackage.id,
        name: selectedPackage.name,
        location: selectedPackage.location,
        image: selectedPackage.image,
        rating: selectedPackage.rating,
        price: selectedPackage.price,
        date: travelDate.toISOString()
      };
    } else if (selectedHotel) {
      // Set a stay date 2 weeks in the future for demo purposes
      const stayDate = new Date();
      stayDate.setDate(stayDate.getDate() + 14);
      
      bookingData = {
        ...bookingData,
        type: 'hotel',
        item_id: selectedHotel.id,
        name: selectedHotel.name,
        location: selectedHotel.location,
        image: selectedHotel.image,
        rating: selectedHotel.rating,
        price: selectedHotel.price,
        date: stayDate.toISOString()
      };
    }

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (res.ok) {
        await fetchBookings();
        // Removed setScreen('confirmation') to allow caller to handle transition

        const title = 'Booking Confirmed! ✈️';
        const body = selectedFlight 
          ? `Your flight to ${selectedFlight.to} has been successfully booked.`
          : selectedPackage 
            ? `Your trip to ${selectedPackage.name} has been successfully booked.`
            : `Your stay at ${selectedHotel!.name} has been successfully booked.`;
        
        addNotification(title, body, 'booking');
        showToast(body);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBooking = async (id: number) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const onClearNotifications = () => {
    setNotifications([]);
  };

  const toggleSavedPackage = (pkg: Package) => {
    setSavedPackages(prev => {
      const isSaved = prev.find(p => p.id === pkg.id);
      if (isSaved) {
        showToast('Removed from saved items', 'info');
        return prev.filter(p => p.id !== pkg.id);
      } else {
        showToast('Added to saved items', 'success');
        return [...prev, pkg];
      }
    });
  };

  const toggleSavedBooking = (booking: Booking) => {
    setSavedBookings(prev => {
      const isSaved = prev.find(b => b.id === booking.id);
      if (isSaved) {
        showToast('Removed from saved items', 'info');
        return prev.filter(b => b.id !== booking.id);
      } else {
        showToast('Added to saved items', 'success');
        return [...prev, booking];
      }
    });
  };

  return {
    screen, setScreen,
    user, setUser,
    currency, setCurrency,
    appearance, setAppearance,
    notificationsEnabled, setNotificationsEnabled,
    emailNotificationsEnabled, setEmailNotificationsEnabled,
    notifications, setNotifications,
    flights, setFlights,
    hotels, setHotels,
    bookings, setBookings,
    selectedFlight, setSelectedFlight,
    selectedHotel, setSelectedHotel,
    selectedBooking, setSelectedBooking,
    selectedPackage, setSelectedPackage,
    selectedSeat, setSelectedSeat,
    packages, setPackages,
    savedPackages, setSavedPackages,
    savedHotels, setSavedHotels,
    savedBookings, setSavedBookings,
    authEmail, setAuthEmail,
    toast, setToast,
    settingsSubScreen, setSettingsSubScreen,
    guestCount, setGuestCount,
    travelers, setTravelers,
    handleLogin, handleSignup, handleSearch, handleBooking, handleCancelBooking,
    onClearNotifications, toggleSavedPackage, toggleSavedHotel, toggleSavedBooking, handleSearchHotels
  };
};
