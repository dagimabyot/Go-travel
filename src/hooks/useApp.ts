import { useState, useEffect } from 'react';
import { Screen, User, Flight, Booking, AppNotification, Package, Hotel } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { authService } from '../services/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  query,
  where,
  deleteDoc
} from 'firebase/firestore';

export const useApp = () => {
  const [screen, setScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const [authEmail, setAuthEmail] = useState('dagim045@gmail.com');
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

  // Auth Listener
  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await authService.getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            fullName: firebaseUser.displayName || '',
            role: 'user',
            createdAt: new Date().toISOString()
          };
          setUser(newUser);
        }

        if (firebaseUser.emailVerified && screen === 'auth-verify') {
          setScreen('home');
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [screen]);

  const handleResendVerification = async () => {
    try {
      await authService.sendVerification();
      showToast('Verification email resent!');
    } catch (err: any) {
      showToast(err.message, 'info');
    }
  };

  const handleCheckVerification = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          setScreen('home');
          showToast('Email verified successfully!');
        } else {
          showToast('Email not verified yet. Please check your inbox.', 'info');
        }
      } catch (err: any) {
        showToast(err.message, 'info');
      }
    }
  };

  // Fetch Packages (Destinations)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'destinations'), (snapshot) => {
      const pkgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
      setPackages(pkgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'destinations');
    });
    return () => unsubscribe();
  }, []);

  // Fetch Hotels
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'hotels'), (snapshot) => {
      const htls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hotel));
      setHotels(htls);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'hotels');
    });
    return () => unsubscribe();
  }, []);

  // Fetch Bookings
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }
    const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(bks);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (email: string, pass: string) => {
    try {
      await authService.login(email, pass);
      setAuthEmail(email);
      setScreen('home');
      showToast('Welcome back!');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        showToast('Email/Password auth not enabled. Please check Firebase console.', 'info');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        showToast('Invalid email or password. Please try again.', 'info');
      } else {
        showToast(err.message, 'info');
      }
      throw err;
    }
  };

  const handleSignup = async (name: string, email: string, pass: string, phone: string) => {
    try {
      const newUser = await authService.signup(name, email, pass, phone);
      setAuthEmail(email);
      setUser(newUser);
      setScreen('auth-verify');
      showToast('Account created! Please verify your email.');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        showToast('Email/Password auth not enabled. Please check Firebase console.', 'info');
      } else if (err.code === 'auth/email-already-in-use') {
        showToast('This email is already in use. Please try logging in instead.', 'info');
      } else {
        showToast(err.message, 'info');
      }
      throw err;
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
      showToast('Password reset email sent!');
      setScreen('auth-email');
    } catch (err: any) {
      showToast(err.message, 'info');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const profile = await authService.signInWithGoogle();
      setUser(profile);
      setScreen('home');
      showToast('Logged in with Google!');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        showToast('Google auth not enabled. Please check Firebase console.', 'info');
      } else if (err.code === 'auth/popup-closed-by-user') {
        showToast('Login cancelled', 'info');
      } else {
        showToast(err.message, 'info');
      }
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
    
    const bookingId = Math.random().toString(36).substring(7);
    let bookingData: Partial<Booking> = {
      userId: user.uid,
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
      const travelDate = new Date();
      travelDate.setMonth(travelDate.getMonth() + 1);
      
      bookingData = {
        ...bookingData,
        type: 'package',
        itemId: selectedPackage.id,
        name: selectedPackage.name,
        location: selectedPackage.location,
        image: selectedPackage.image,
        rating: selectedPackage.rating,
        price: selectedPackage.price,
        date: travelDate.toISOString()
      };
    } else if (selectedHotel) {
      const stayDate = new Date();
      stayDate.setDate(stayDate.getDate() + 14);
      
      bookingData = {
        ...bookingData,
        type: 'hotel',
        itemId: selectedHotel.id,
        name: selectedHotel.name,
        location: selectedHotel.location,
        image: selectedHotel.image,
        rating: selectedHotel.rating,
        price: selectedHotel.price,
        date: stayDate.toISOString()
      };
    }

    try {
      await setDoc(doc(db, 'bookings', bookingId), bookingData);
      
      const title = 'Booking Confirmed! ✈️';
      const body = selectedFlight 
        ? `Your flight to ${selectedFlight.to} has been successfully booked.`
        : selectedPackage 
          ? `Your trip to ${selectedPackage.name} has been successfully booked.`
          : `Your stay at ${selectedHotel!.name} has been successfully booked.`;
      
      addNotification(title, body, 'booking');
      showToast(body);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'bookings');
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      showToast('Booking cancelled', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `bookings/${id}`);
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

  const onUpdateUser = async (updatedData: Partial<User>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { ...user, ...updatedData }, { merge: true });
      setUser(prev => prev ? { ...prev, ...updatedData } : null);
      showToast('Profile updated successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setScreen('auth-welcome');
      showToast('Logged out successfully');
    } catch (err: any) {
      showToast(err.message, 'info');
    }
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
    handleLogin, handleSignup, handleSearch, handleBooking, handleCancelBooking, handleForgotPassword, handleGoogleLogin,
    handleResendVerification, handleCheckVerification, handleLogout,
    onClearNotifications, toggleSavedPackage, toggleSavedHotel, toggleSavedBooking, handleSearchHotels, onUpdateUser
  };
};
