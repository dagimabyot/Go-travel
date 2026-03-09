import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Bell, Moon, Mail, Info, Share2, ChevronRight, 
  User as UserIcon, CreditCard, Shield, HelpCircle, FileText, LogOut, Globe, Camera, Check, Trash2, Plus, ExternalLink, Star, QrCode, Languages, Coins, Sun,
  ChevronLeft
} from 'lucide-react';
import { User, AppNotification } from '../../types';
import { translations } from '../../constants/translations';
import { Avatar } from '../../components/ui/Avatar';

interface SettingsScreenProps {
  user: User;
  onLogout: () => void;
  language: string;
  setLanguage: (l: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
  appearance: string;
  setAppearance: (a: string) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (e: boolean) => void;
  emailNotificationsEnabled: boolean;
  setEmailNotificationsEnabled: (e: boolean) => void;
  notifications: AppNotification[];
  onUpdateUser: (updated: Partial<User>) => void;
  subScreen: string;
  setSubScreen: (s: string) => void;
}

export const SettingsScreen = ({ 
  user, 
  onLogout, 
  language, 
  setLanguage, 
  currency, 
  setCurrency, 
  appearance, 
  setAppearance,
  notificationsEnabled,
  setNotificationsEnabled,
  emailNotificationsEnabled,
  setEmailNotificationsEnabled,
  notifications,
  onUpdateUser,
  subScreen,
  setSubScreen
}: SettingsScreenProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];

  const renderSubScreen = () => {
    switch (subScreen) {
      case 'profile':
        return <PersonalInformationSubScreen user={user} onSave={onUpdateUser} language={language} onBack={() => setSubScreen('main')} appearance={appearance} />;
      case 'payment':
        return <PaymentMethodsSubScreen language={language} appearance={appearance} />;
      case 'notifications':
        return <NotificationsSubScreen notifications={notifications} language={language} appearance={appearance} />;
      case 'privacy':
        return <PrivacySettingsSubScreen language={language} appearance={appearance} />;
      case 'help':
        return <HelpSupportSubScreen language={language} appearance={appearance} />;
      case 'about':
        return <AboutAppSubScreen onBack={() => setSubScreen('main')} appearance={appearance} />;
      case 'terms':
        return <TermsOfServiceSubScreen appearance={appearance} />;
      default:
        return (
          <>
            <div className="flex flex-col items-center mb-10 pt-4">
              <div className="relative">
                <div className={`rounded-full p-1 border-2 ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-white shadow-lg'}`}>
                  <Avatar user={user} size={110} />
                </div>
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white">
                  <Camera size={14} />
                </div>
              </div>
              <div className="mt-4 text-center">
                <h2 className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{user.name}</h2>
                <p className="text-slate-400 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="space-y-0">
              <SettingItem 
                label="Personal Information" 
                onClick={() => setSubScreen('profile')}
                appearance={appearance}
              />
              <SettingToggle 
                label="Notification" 
                enabled={notificationsEnabled} 
                onToggle={() => setNotificationsEnabled(!notificationsEnabled)} 
                appearance={appearance}
              />
              <SettingToggle 
                label="Dark Mode" 
                enabled={appearance === 'Dark Mode'} 
                onToggle={() => setAppearance(appearance === 'Dark Mode' ? 'Light Mode' : 'Dark Mode')} 
                appearance={appearance}
              />
              <SettingToggle 
                label="Email Notification" 
                enabled={emailNotificationsEnabled} 
                onToggle={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)} 
                appearance={appearance}
              />
              <SettingItem 
                label="About App" 
                onClick={() => setSubScreen('about')}
                appearance={appearance}
              />
              <SettingItem 
                label="Share App" 
                appearance={appearance}
                onClick={() => {
                  const shareData = {
                    title: 'GoTravel',
                    text: 'Check out this awesome travel app!',
                    url: window.location.href,
                  };
                  if (navigator.share) {
                    navigator.share(shareData).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('App link copied to clipboard!');
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('App link copied to clipboard!');
                  }
                }}
              />
              
              <div className="mt-12">
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className={`w-full flex items-center justify-center gap-3 py-5 rounded-[24px] font-bold active:scale-95 transition-all ${appearance === 'Dark Mode' ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                >
                  <LogOut size={20} />
                  {t('logout')}
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  const renderLogoutModal = () => (
    <AnimatePresence>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white'}`}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${appearance === 'Dark Mode' ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <LogOut size={40} className="text-red-500" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Logout?</h3>
            <p className="text-slate-500 text-sm mb-8">
              Are you sure you want to log out of your account? You will need to sign in again to access your bookings.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                Cancel
              </button>
              <button 
                onClick={onLogout}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-500/20"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`min-h-screen pb-24 pt-2 px-6 max-w-4xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex justify-between items-center mb-6">
        {subScreen !== 'main' ? (
          <button onClick={() => setSubScreen('main')} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 border'}`}>
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-12" />
        )}
      </header>

      <h1 className={`text-2xl font-bold mb-6 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
        {subScreen === 'main' ? 'Settings' : t(subScreen === 'profile' ? 'personalInfo' : subScreen)}
      </h1>

      {renderSubScreen()}
      {renderLogoutModal()}
    </div>
  );
};

const SettingToggle = ({ label, enabled, onToggle, appearance }: { label: string, enabled: boolean, onToggle: () => void, appearance: string }) => (
  <div className={`flex items-center justify-between py-6 border-b ${appearance === 'Dark Mode' ? 'border-slate-900' : 'border-slate-50'}`}>
    <span className={`font-bold ${appearance === 'Dark Mode' ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-blue-600' : appearance === 'Dark Mode' ? 'bg-slate-800' : 'bg-slate-200'}`}
    >
      <motion.div 
        animate={{ x: enabled ? 26 : 2 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);

const SettingItem = ({ label, onClick, appearance }: { label: string, onClick: () => void, appearance: string }) => (
  <div onClick={onClick} className={`flex items-center justify-between py-6 border-b cursor-pointer group ${appearance === 'Dark Mode' ? 'border-slate-900' : 'border-slate-50'}`}>
    <span className={`font-bold ${appearance === 'Dark Mode' ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
    <ChevronRight size={20} className="text-slate-400" />
  </div>
);

// --- Sub-screens ---

const PersonalInformationSubScreen = ({ user, onSave, language, onBack, appearance }: { user: User, onSave: (updated: Partial<User>) => void, language: string, onBack: () => void, appearance: string }) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  const [formData, setFormData] = React.useState({
    name: user.name || '',
    email: user.email || '',
    dob: user.dob || '1/11/2000',
    gender: user.gender || 'Male',
    phone: user.phone || '+1-123-345-678',
    country: user.country || 'BD',
    zipCode: user.zipCode || '5699',
    bio: user.bio || 'Travel enthusiast exploring the world one city at a time.',
    passport: user.passport || ''
  });
  const [isSaved, setIsSaved] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave({ 
      name: formData.name, 
      email: formData.email,
      dob: formData.dob,
      gender: formData.gender,
      phone: formData.phone,
      country: formData.country,
      zipCode: formData.zipCode,
      bio: formData.bio,
      passport: formData.passport
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onBack();
    }, 1000);
  };

  return (
    <div className={`fixed inset-0 z-[210] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`flex items-center justify-between px-6 pt-12 pb-6 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white border-b border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
          <ChevronLeft size={20} />
        </button>
        <h1 className={`text-lg font-semibold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Edit Profile</h1>
        <button onClick={handleSave} className="text-blue-600 font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">Save</button>
      </header>

      <div className="flex-1 px-6 pt-8 overflow-y-auto no-scrollbar pb-32">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className={`rounded-full p-1 border-2 transition-all ${appearance === 'Dark Mode' ? 'border-slate-800' : 'border-white shadow-md'}`}>
              <Avatar user={user} size={100} />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-blue-700 transition-all"
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onSave({ avatar: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <h2 className={`text-xl font-semibold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{formData.name}</h2>
            <p className="text-slate-400 text-sm">{formData.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Basic Information</h3>
            <div className={`rounded-3xl p-6 space-y-6 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className={`w-full text-base font-medium px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">Bio</label>
                <textarea 
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})} 
                  rows={3}
                  className={`w-full text-base font-medium px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Birth Date</label>
                  <input 
                    type="text" 
                    value={formData.dob} 
                    onChange={e => setFormData({...formData, dob: e.target.value})} 
                    className={`w-full text-base font-medium px-4 py-3 rounded-xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Gender</label>
                  <input 
                    type="text" 
                    value={formData.gender} 
                    onChange={e => setFormData({...formData, gender: e.target.value})} 
                    className={`w-full text-base font-medium px-4 py-3 rounded-xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">Passport Number</label>
                <input 
                  type="text" 
                  value={formData.passport} 
                  onChange={e => setFormData({...formData, passport: e.target.value})} 
                  placeholder="A12345678"
                  className={`w-full text-base font-medium px-4 py-3 rounded-xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Contact Details</h3>
            <div className={`rounded-3xl p-6 space-y-6 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className={`w-full text-base font-medium px-4 py-3 rounded-xl border focus:outline-none transition-all pr-12 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                    <Check size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className={`w-full text-base font-medium px-4 py-3 rounded-xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Country</label>
                  <input 
                    type="text" 
                    value={formData.country} 
                    onChange={e => setFormData({...formData, country: e.target.value})} 
                    className={`w-full text-base font-medium px-4 py-3 rounded-xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Zip Code</label>
                  <input 
                    type="text" 
                    value={formData.zipCode} 
                    onChange={e => setFormData({...formData, zipCode: e.target.value})} 
                    className={`w-full text-base font-medium px-4 py-3 rounded-xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const PaymentMethodsSubScreen = ({ language, appearance }: { language: string, appearance: string }) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  const [cards, setCards] = React.useState<any[]>([]);
  const [showAddCard, setShowAddCard] = React.useState(false);
  const [newCard, setNewCard] = React.useState({ number: '', holder: '', expiry: '' });

  const handleAddCard = () => {
    setCards([...cards, { ...newCard, id: Date.now() }]);
    setShowAddCard(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center ml-1">
        <h3 className={`text-sm font-bold ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-700'}`}>{t('savedMethods')}</h3>
        <button onClick={() => setShowAddCard(true)} className="text-primary text-xs font-bold flex items-center gap-1">
          <Plus size={14} /> {t('addCard')}
        </button>
      </div>

      {cards.map(card => (
        <div key={card.id} className={`border rounded-2xl p-4 flex items-center gap-4 ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <CreditCard size={20} />
          </div>
          <div className="flex-1">
            <p className={`text-sm font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Visa ending in {card.number.slice(-4)}</p>
            <p className="text-xs text-slate-400">{card.holder}</p>
          </div>
          <button onClick={() => setCards(cards.filter(c => c.id !== card.id))} className={`p-2 rounded-full transition-colors ${appearance === 'Dark Mode' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`}>
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      
      <a 
        href="https://buy.stripe.com/test_9B6eV7faW19u4cTeWr6Zy01" 
        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-colors ${appearance === 'Dark Mode' ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-black'}`}
      >
        <ExternalLink size={18} />
        {t('connectStripe')}
      </a>

      <AnimatePresence>
        {showAddCard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-3xl p-8 shadow-2xl ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white'}`}>
              <h3 className={`text-xl font-bold mb-6 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Add New Card</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Card Number" value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} className={`w-full py-4 border-b outline-none transition-colors bg-transparent ${appearance === 'Dark Mode' ? 'border-slate-800 text-white focus:border-primary' : 'border-slate-100 text-slate-800 focus:border-primary'}`} />
                <input type="text" placeholder="Card Holder" value={newCard.holder} onChange={e => setNewCard({...newCard, holder: e.target.value})} className={`w-full py-4 border-b outline-none transition-colors bg-transparent ${appearance === 'Dark Mode' ? 'border-slate-800 text-white focus:border-primary' : 'border-slate-100 text-slate-800 focus:border-primary'}`} />
                <input type="text" placeholder="Expiry Date" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} className={`w-full py-4 border-b outline-none transition-colors bg-transparent ${appearance === 'Dark Mode' ? 'border-slate-800 text-white focus:border-primary' : 'border-slate-100 text-slate-800 focus:border-primary'}`} />
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowAddCard(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-400">Cancel</button>
                <button onClick={handleAddCard} className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold">Add Card</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NotificationsSubScreen = ({ notifications, language, appearance }: { notifications: AppNotification[], language: string, appearance: string }) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className={`text-sm font-bold ml-1 ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-700'}`}>{t('recentAlerts')}</h3>
        {notifications.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-12 rounded-3xl border border-dashed ${appearance === 'Dark Mode' ? 'text-slate-600 bg-slate-900 border-slate-800' : 'text-slate-300 bg-slate-50 border-slate-200'}`}>
            <Bell size={32} className="mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">{t('noAlerts')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 5).map(notif => (
              <div key={notif.id} className={`border rounded-2xl p-4 ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">{notif.type}</p>
                  <p className="text-[10px] text-slate-300">{notif.time}</p>
                </div>
                <p className={`text-sm font-bold mb-1 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{notif.title}</p>
                <p className={`text-xs leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-500'}`}>{notif.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`border rounded-3xl overflow-hidden ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <NotificationToggle label={t('bookingConfirmations')} description={t('bookingConfirmationsDesc')} defaultChecked={true} appearance={appearance} />
        <NotificationToggle label={t('flightReminders')} description={t('flightRemindersDesc')} defaultChecked={true} appearance={appearance} />
        <NotificationToggle label={t('promotionalOffers')} description={t('promotionalOffersDesc')} defaultChecked={false} appearance={appearance} />
        <NotificationToggle label={t('travelAlerts')} description={t('travelAlertsDesc')} defaultChecked={true} appearance={appearance} />
      </div>
    </div>
  );
};

const NotificationToggle = ({ label, description, defaultChecked, appearance }: any) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className={`p-5 border-b flex items-center justify-between transition-colors ${appearance === 'Dark Mode' ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-50 hover:bg-slate-50'}`}>
      <div className="flex-1 pr-4">
        <p className={`font-bold ${appearance === 'Dark Mode' ? 'text-slate-200' : 'text-slate-700'}`}>{label}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-primary' : appearance === 'Dark Mode' ? 'bg-slate-700' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-7' : 'left-1'}`}></div>
      </button>
    </div>
  );
};

const PrivacySettingsSubScreen = ({ language, appearance }: { language: string, appearance: string }) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  return (
    <div className="space-y-6">
      <div className={`border rounded-3xl overflow-hidden ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <NotificationToggle label={t('profileVisibility')} description="Make your profile visible to other travelers." defaultChecked={false} appearance={appearance} />
        <NotificationToggle label={t('dataSharing')} description="Share your travel data with our partners for better deals." defaultChecked={false} appearance={appearance} />
        <NotificationToggle label={t('locationTracking')} description="Allow us to track your location for real-time alerts." defaultChecked={true} appearance={appearance} />
      </div>
    </div>
  );
};

const HelpSupportSubScreen = ({ language, appearance }: { language: string, appearance: string }) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  return (
    <div className="space-y-6">
      <div className={`border rounded-3xl overflow-hidden ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <SettingsItem icon={<Info size={18} />} label="FAQ" onClick={() => window.open('https://google.com/search?q=travel+faq', '_blank')} language={language} appearance={appearance} />
        <SettingsItem icon={<Shield size={18} />} label="Troubleshooting" onClick={() => window.open('https://google.com/search?q=travel+troubleshooting', '_blank')} language={language} appearance={appearance} />
        <SettingsItem icon={<Bell size={18} />} label="Ticket Tracking" onClick={() => window.open('https://google.com/search?q=flight+tracking', '_blank')} language={language} appearance={appearance} />
      </div>
    </div>
  );
};

const AboutAppSubScreen = ({ onBack, appearance }: { onBack: () => void, appearance: string }) => (
  <div className={`fixed inset-0 z-[210] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
    <header className={`flex items-center px-6 pt-12 pb-6 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white'}`}>
      <button onClick={onBack} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 border'}`}>
        <ChevronLeft size={24} />
      </button>
      <h1 className={`text-xl font-bold ml-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>About App</h1>
    </header>

    <div className="flex-1 px-8 pt-6 overflow-y-auto no-scrollbar pb-32">
      <div className={`space-y-6 leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
        <h2 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>About Go Travel</h2>
        
        <p>
          Go Travel is a modern travel platform designed to help people discover, explore, and plan amazing journeys around the world. Our goal is to make travel simple, accessible, and enjoyable for everyone.
        </p>
        
        <p>
          With Go Travel, users can easily search for destinations, explore popular attractions, book flights and hotels, and organize their travel plans in one convenient place. We combine smart technology with a user-friendly design to create a smooth and reliable travel experience.
        </p>
        
        <p>
          Our mission is to inspire travelers to explore new places, experience different cultures, and create unforgettable memories. Whether you are planning a short getaway, a business trip, or a dream vacation, Go Travel is here to guide you every step of the way.
        </p>
        
        <p className={`font-bold mt-8 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
          Go Travel — Explore the world with confidence.
        </p>
      </div>
    </div>
  </div>
);

const TermsOfServiceSubScreen = ({ appearance }: { appearance: string }) => (
  <div className="space-y-6">
    <div className={`border rounded-3xl p-6 ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
  </div>
);

const SettingsItem = ({ icon, label, onClick, language, appearance }: any) => {
  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  return (
    <div onClick={onClick} className={`p-5 border-b flex items-center justify-between cursor-pointer transition-colors ${appearance === 'Dark Mode' ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-50 hover:bg-slate-50'}`}>
      <div className="flex items-center gap-4">
        <div className="text-slate-400">{icon}</div>
        <p className={`font-bold ${appearance === 'Dark Mode' ? 'text-slate-200' : 'text-slate-700'}`}>{t(label)}</p>
      </div>
      <ChevronRight size={16} className="text-slate-300" />
    </div>
  );
};
