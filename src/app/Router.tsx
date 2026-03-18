import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Screen, User, Flight, Booking, AppNotification, Package, Hotel } from '../types';
import { SplashScreen } from '../components/ui/SplashScreen';
import { WelcomeScreen } from '../features/auth/WelcomeScreen';
import { LoginScreen } from '../features/auth/LoginScreen';
import { SignupScreen } from '../features/auth/SignupScreen';
import { ForgotScreen } from '../features/auth/ForgotScreen';
import { VerifyScreen } from '../features/auth/VerifyScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { PackagesListScreen } from '../features/home/PackagesListScreen';
import { PackageDetailsScreen } from '../features/home/PackageDetailsScreen';
import { PlaceListScreen } from '../features/home/PlaceListScreen';
import { HotelListScreen } from '../features/home/HotelListScreen';
import { HotelDetailsScreen } from '../features/home/HotelDetailsScreen';
import { HotelConfirmationScreen } from '../features/home/HotelConfirmationScreen';
import { LocationPickerScreen } from '../features/home/LocationPickerScreen';
import { FlightSearchScreen } from '../features/flights/FlightSearchScreen';
import { FlightListScreen } from '../features/flights/FlightListScreen';
import { SeatSelectionScreen } from '../features/flights/SeatSelectionScreen';
import { FlightConfirmationScreen } from '../features/flights/FlightConfirmationScreen';
import { TravelerInformationScreen } from '../features/flights/TravelerInformationScreen';
import { PaymentScreen } from '../features/flights/PaymentScreen';
import { SuccessScreen } from '../features/bookings/SuccessScreen';
import { HistoryScreen } from '../features/bookings/HistoryScreen';
import { TripDetailsScreen } from '../features/bookings/TripDetailsScreen';
import { TicketScreen } from '../features/flights/TicketScreen';
import { FlightBookingDetailsScreen } from '../features/flights/FlightBookingDetailsScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { AlertsScreen } from '../features/settings/AlertsScreen';
import { PrivacyScreen } from '../features/settings/PrivacyScreen';
import { SavedScreen } from '../features/home/SavedScreen';
import { Navbar } from '../components/layout/Navbar';

interface RouterProps {
  screen: Screen;
  setScreen: (s: Screen) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  currency: string;
  setCurrency: (c: string) => void;
  appearance: string;
  setAppearance: (a: string) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (e: boolean) => void;
  emailNotificationsEnabled: boolean;
  setEmailNotificationsEnabled: (e: boolean) => void;
  notifications: AppNotification[];
  setNotifications: (n: AppNotification[]) => void;
  flights: Flight[];
  setFlights: (f: Flight[]) => void;
  hotels: Hotel[];
  setHotels: (h: Hotel[]) => void;
  bookings: Booking[];
  setBookings: (b: Booking[]) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: (f: Flight | null) => void;
  selectedHotel: Hotel | null;
  setSelectedHotel: (h: Hotel | null) => void;
  selectedBooking: Booking | null;
  setSelectedBooking: (b: Booking | null) => void;
  selectedPackage: Package | null;
  setSelectedPackage: (p: Package | null) => void;
  selectedSeat: string;
  setSelectedSeat: (s: string) => void;
  packages: Package[];
  setPackages: (p: Package[]) => void;
  savedPackages: Package[];
  toggleSavedPackage: (p: Package) => void;
  savedHotels: Hotel[];
  toggleSavedHotel: (h: Hotel) => void;
  savedBookings: Booking[];
  toggleSavedBooking: (b: Booking) => void;
  authEmail: string;
  setAuthEmail: (e: string) => void;
  handleLogin: (email: string, pass: string) => void;
  handleSignup: (name: string, email: string, pass: string, phone: string) => void;
  handleGoogleLogin: () => void;
  handleSearch: (from: string, to: string, date: string, flightClass: string) => void;
  handleSearchHotels: () => void;
  handleBooking: (seat: string) => void;
  handleCancelBooking: (id: string) => void;
  onClearNotifications: () => void;
  onUpdateUser: (updated: Partial<User>) => void;
  handleForgotPassword: (email: string) => void;
  handleResendVerification: () => void;
  handleCheckVerification: () => void;
  handleLogout: () => void;
  settingsSubScreen: string;
  setSettingsSubScreen: (s: string) => void;
  guestCount: number;
  setGuestCount: (c: number) => void;
  travelers: import('../types').Traveler[];
  setTravelers: (t: import('../types').Traveler[]) => void;
}

export const Router = (props: RouterProps) => {
  const { 
    screen, setScreen, user, setUser, 
    currency, setCurrency, appearance, setAppearance, 
    notificationsEnabled, setNotificationsEnabled,
    emailNotificationsEnabled, setEmailNotificationsEnabled,
    notifications, flights, hotels, bookings, selectedFlight, 
    setSelectedFlight, selectedHotel, setSelectedHotel, selectedBooking, setSelectedBooking, 
    selectedPackage, setSelectedPackage, selectedSeat, setSelectedSeat, packages, savedPackages, toggleSavedPackage,
    savedHotels, toggleSavedHotel,
    savedBookings, toggleSavedBooking,
    authEmail, setAuthEmail,
    handleLogin, handleSignup, handleGoogleLogin, handleSearch, handleSearchHotels, handleBooking, 
    handleCancelBooking, onClearNotifications,
    onUpdateUser, handleForgotPassword,
    handleResendVerification, handleCheckVerification, handleLogout,
    settingsSubScreen, setSettingsSubScreen,
    guestCount, setGuestCount,
    travelers, setTravelers
  } = props;

  const { language, setLanguage } = useLanguage();

  React.useEffect(() => {
    if (window.location.pathname === '/success') {
      setScreen('success');
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, [setScreen]);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen onNext={() => setScreen('auth-welcome')} />;
      case 'auth-welcome':
        return <WelcomeScreen onSignup={() => setScreen('auth-signup')} onLogin={() => setScreen('auth-email')} onGoogleLogin={handleGoogleLogin} />;
      case 'auth-email':
        return <LoginScreen onLogin={handleLogin} onSignup={() => setScreen('auth-signup')} onForgot={() => setScreen('auth-forgot')} onGoogleLogin={handleGoogleLogin} onBack={() => setScreen('auth-welcome')} initialEmail={authEmail} />;
      case 'auth-signup':
        return <SignupScreen onSignup={handleSignup} onLogin={() => setScreen('auth-email')} onGoogleLogin={handleGoogleLogin} onBack={() => setScreen('auth-welcome')} />;
      case 'auth-forgot':
        return <ForgotScreen onSend={handleForgotPassword} onBack={() => setScreen('auth-email')} />;
      case 'auth-verify':
        return <VerifyScreen email={authEmail} onVerify={handleCheckVerification} onResend={handleResendVerification} onBack={() => setScreen('auth-email')} />;
      case 'home':
        return <HomeScreen user={user} packages={packages} hotels={hotels} onSelectPackage={(p) => { setSelectedPackage(p); setScreen('package-details'); }} onSeeAllPackages={() => setScreen('place-list')} onSearchFlights={() => setScreen('flight-search')} onSearchHotels={handleSearchHotels} onSelectHotel={(h) => { setSelectedHotel(h); setScreen('hotel-details'); }} onProfile={() => setScreen('settings')} savedPackages={savedPackages} toggleSavedPackage={toggleSavedPackage} savedHotels={savedHotels} toggleSavedHotel={toggleSavedHotel} appearance={appearance} />;
      case 'place-list':
        return <PlaceListScreen places={packages} onBack={() => setScreen('home')} onSelectPlace={(p) => { setSelectedPackage(p); setScreen('package-details'); }} toggleSaved={toggleSavedPackage} isSaved={(id) => savedPackages.some(p => p.id === id)} appearance={appearance} />;
      case 'packages-list':
        return <PackagesListScreen user={user} packages={packages} onBack={() => setScreen('home')} onSelect={(p) => { setSelectedPackage(p); setScreen('package-details'); }} savedPackages={savedPackages} toggleSavedPackage={toggleSavedPackage} appearance={appearance} />;
      case 'package-details':
        return selectedPackage ? (
          <PackageDetailsScreen 
            pkg={selectedPackage} 
            user={user} 
            onBack={() => setScreen('home')} 
            onBook={() => setScreen('location-picker')} 
            appearance={appearance}
            toggleSaved={toggleSavedPackage}
            isSaved={savedPackages.some(p => p.id === selectedPackage.id)}
          />
        ) : null;
      case 'location-picker':
        return <LocationPickerScreen onBack={() => setScreen('package-details')} onSelect={(loc) => { console.log(loc); setScreen('flight-search'); }} appearance={appearance} />;
      case 'hotel-results':
        return <HotelListScreen hotels={hotels} onBack={() => setScreen('home')} onSelectHotel={(h) => { setSelectedHotel(h); setScreen('hotel-details'); }} savedHotels={savedHotels} toggleSavedHotel={toggleSavedHotel} appearance={appearance} />;
      case 'hotel-details':
        return selectedHotel ? <HotelDetailsScreen hotel={selectedHotel} onBack={() => setScreen('hotel-results')} onBook={() => setScreen('hotel-confirmation')} toggleSaved={toggleSavedHotel} isSaved={savedHotels.some(h => h.id === selectedHotel.id)} appearance={appearance} /> : null;
      case 'hotel-confirmation':
        return selectedHotel ? <HotelConfirmationScreen hotel={selectedHotel} onBack={() => setScreen('hotel-details')} onContinue={() => setScreen('payment')} onEdit={(field) => { console.log('Edit', field); setScreen('hotel-details'); }} appearance={appearance} /> : null;
      case 'saved':
        return <SavedScreen savedPackages={savedPackages} savedHotels={savedHotels} savedBookings={savedBookings} user={user} onSelectPackage={(p) => { setSelectedPackage(p); setScreen('package-details'); }} onSelectHotel={(h) => { setSelectedHotel(h); setScreen('hotel-details'); }} toggleSavedPackage={toggleSavedPackage} toggleSavedHotel={toggleSavedHotel} toggleSavedBooking={toggleSavedBooking} appearance={appearance} />;
      case 'flight-search':
        return <FlightSearchScreen onBack={() => setScreen('home')} onSearch={() => setScreen('flight-results')} appearance={appearance} />;
      case 'flight-results':
        return <FlightListScreen onBack={() => setScreen('flight-search')} onSelectFlight={(f) => { setSelectedFlight(f); setScreen('seat-selection'); }} appearance={appearance} />;
      case 'seat-selection':
        return <SeatSelectionScreen onBack={() => setScreen('flight-results')} onContinue={(seat) => { setSelectedSeat(seat); setScreen('confirmation'); }} appearance={appearance} flight={selectedFlight} />;
      case 'payment':
        return <PaymentScreen 
          flight={selectedFlight || undefined} 
          pkg={selectedPackage || undefined} 
          onConfirm={async () => {
            await handleBooking(selectedSeat);
            setScreen('success');
          }} 
          onBack={() => setScreen('traveler-info')} 
          appearance={appearance}
        />;
      case 'confirmation':
        return <FlightConfirmationScreen 
          flight={selectedFlight || undefined} 
          user={user}
          onBack={() => setScreen('seat-selection')} 
          onContinue={(guests) => {
            setGuestCount(guests);
            setScreen('traveler-info');
          }} 
          onEdit={(field) => { console.log('Edit', field); setScreen('flight-search'); }} 
          appearance={appearance} 
        />;
      case 'traveler-info':
        return <TravelerInformationScreen 
          guestCount={guestCount}
          user={user}
          onBack={() => setScreen('confirmation')}
          onContinue={(t) => {
            setTravelers(t);
            setScreen('payment');
          }}
          appearance={appearance}
          initialTravelers={travelers}
        />;
      case 'success':
        return <SuccessScreen onBackToHome={() => setScreen('home')} onViewTrips={() => setScreen('my-trips')} appearance={appearance} />;
      case 'my-trips':
        return <HistoryScreen bookings={bookings} user={user} onCancel={handleCancelBooking} onSelect={(b) => { setSelectedBooking(b); setScreen('trip-details'); }} onBack={() => setScreen('home')} onProfile={() => setScreen('settings')} appearance={appearance} savedBookings={savedBookings} toggleSavedBooking={toggleSavedBooking} />;
      case 'trip-details':
        if (!selectedBooking) return null;
        if (selectedBooking.type === 'flight') {
          return (
            <FlightBookingDetailsScreen 
              booking={selectedBooking} 
              user={user} 
              onBack={() => setScreen('my-trips')} 
              onCancel={handleCancelBooking} 
              onDownload={() => setScreen('ticket')}
              appearance={appearance} 
              isSaved={savedBookings.some(b => b.id === selectedBooking.id)}
              toggleSaved={() => toggleSavedBooking(selectedBooking)}
            />
          );
        }
        return (
          <TripDetailsScreen 
            booking={selectedBooking} 
            user={user} 
            onBack={() => setScreen('my-trips')} 
            onCancel={handleCancelBooking} 
            appearance={appearance} 
            isSaved={savedBookings.some(b => b.id === selectedBooking.id)}
            toggleSaved={() => toggleSavedBooking(selectedBooking)}
          />
        );
      case 'ticket':
        return <TicketScreen onBack={() => setScreen('home')} onDownload={() => setScreen('home')} appearance={appearance} flight={selectedFlight || (selectedBooking?.type === 'flight' ? selectedBooking as any : null)} user={user} seat={selectedSeat || selectedBooking?.seat || '17'} />;
      case 'settings':
        return user ? <SettingsScreen user={user} onLogout={handleLogout} currency={currency} setCurrency={setCurrency} appearance={appearance} setAppearance={setAppearance} notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} emailNotificationsEnabled={emailNotificationsEnabled} setEmailNotificationsEnabled={setEmailNotificationsEnabled} notifications={notifications} onUpdateUser={onUpdateUser} subScreen={settingsSubScreen} setSubScreen={setSettingsSubScreen} /> : null;
      case 'alerts':
        return <AlertsScreen notifications={notifications} onClear={onClearNotifications} appearance={appearance} />;
      case 'privacy':
        return <PrivacyScreen onBack={() => setScreen('settings')} appearance={appearance} />;
      default:
        return <HomeScreen user={user} packages={packages} hotels={hotels} onSelectPackage={(p) => { setSelectedPackage(p); setScreen('package-details'); }} onSeeAllPackages={() => setScreen('place-list')} onSearchFlights={() => setScreen('flight-search')} onSearchHotels={handleSearchHotels} onSelectHotel={(h) => { setSelectedHotel(h); setScreen('hotel-details'); }} onProfile={() => setScreen('settings')} savedPackages={savedPackages} toggleSavedPackage={toggleSavedPackage} savedHotels={savedHotels} toggleSavedHotel={toggleSavedHotel} appearance={appearance} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${appearance === 'Dark Mode' ? 'dark bg-slate-950' : 'bg-white'}`}>
      <div className={`${(screen === 'splash' || screen.startsWith('auth-')) ? '' : 'pt-24 pb-24 md:pb-0'}`}>
        {renderScreen()}
      </div>
      <Navbar activeScreen={screen} setScreen={setScreen} appearance={appearance} user={user} setSettingsSubScreen={setSettingsSubScreen} />
    </div>
  );
};
