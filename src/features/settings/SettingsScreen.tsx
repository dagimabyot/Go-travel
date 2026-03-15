import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Bell, Moon, Mail, Info, Share2, ChevronRight, 
  User as UserIcon, CreditCard, Shield, HelpCircle, FileText, LogOut, Globe, Camera, Check, Trash2, Plus, ExternalLink, Star, QrCode, Languages, Coins, Sun,
  ChevronLeft
} from 'lucide-react';
import { User, AppNotification } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../context/LanguageContext';
import { Avatar } from '../../components/ui/Avatar';

interface SettingsScreenProps {
  user: User;
  onLogout: () => void;
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
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const renderSubScreen = () => {
    switch (subScreen) {
      case 'profile':
        return <PersonalInformationSubScreen user={user} onSave={onUpdateUser} onBack={() => setSubScreen('main')} appearance={appearance} />;
      case 'payment':
        return <PaymentMethodsSubScreen appearance={appearance} onBack={() => setSubScreen('main')} />;
      case 'notifications':
        return <NotificationsSubScreen notifications={notifications} appearance={appearance} onBack={() => setSubScreen('main')} />;
      case 'privacy':
        return <PrivacySettingsSubScreen appearance={appearance} onBack={() => setSubScreen('main')} />;
      case 'help':
        return <HelpSupportSubScreen appearance={appearance} onBack={() => setSubScreen('main')} />;
      case 'contact':
        return <ContactUsSubScreen appearance={appearance} onBack={() => setSubScreen('main')} />;
      case 'language':
        return <LanguageSubScreen appearance={appearance} onBack={() => setSubScreen('main')} />;
      case 'about':
        return <AboutAppSubScreen onBack={() => setSubScreen('main')} appearance={appearance} />;
      case 'terms':
        return <TermsOfServiceSubScreen appearance={appearance} onBack={() => setSubScreen('main')} />;
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
                label={t('personalInfo')} 
                onClick={() => setSubScreen('profile')}
                appearance={appearance}
              />
              <SettingItem 
                label={t('language')} 
                onClick={() => setSubScreen('language')}
                appearance={appearance}
                value={language}
              />
              <SettingToggle 
                label={t('notifications')} 
                enabled={notificationsEnabled} 
                onToggle={() => setNotificationsEnabled(!notificationsEnabled)} 
                appearance={appearance}
              />
              <SettingToggle 
                label={t('darkMode')} 
                enabled={appearance === 'Dark Mode'} 
                onToggle={() => setAppearance(appearance === 'Dark Mode' ? 'Light Mode' : 'Dark Mode')} 
                appearance={appearance}
              />
              <SettingItem 
                label={t('privacySecurity')} 
                onClick={() => setSubScreen('privacy')}
                appearance={appearance}
              />
              <SettingItem 
                label={t('helpSupport')} 
                onClick={() => setSubScreen('help')}
                appearance={appearance}
              />
              <SettingItem 
                label={t('contactUs')} 
                onClick={() => setSubScreen('contact')}
                appearance={appearance}
              />
              <SettingItem 
                label={t('aboutApp')} 
                onClick={() => setSubScreen('about')}
                appearance={appearance}
              />
              <SettingItem 
                label={t('shareApp')} 
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
            <h3 className={`text-xl font-bold mb-2 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('logoutQuestion')}</h3>
            <p className="text-slate-500 text-sm mb-8">
              {t('logoutConfirmMsg')}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                {t('cancel')}
              </button>
              <button 
                onClick={onLogout}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-500/20"
              >
                {t('logout')}
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

const SettingItem = ({ label, onClick, appearance, value }: { label: string, onClick: () => void, appearance: string, value?: string }) => (
  <div onClick={onClick} className={`flex items-center justify-between py-6 border-b cursor-pointer group ${appearance === 'Dark Mode' ? 'border-slate-900' : 'border-slate-50'}`}>
    <span className={`font-bold ${appearance === 'Dark Mode' ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
    {value && <span className="text-sm font-medium text-slate-400">{value}</span>}
  </div>
);

// --- Sub-screens ---

const PersonalInformationSubScreen = ({ user, onSave, onBack, appearance }: { user: User, onSave: (updated: Partial<User>) => void, onBack: () => void, appearance: string }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState({
    name: user.name || '',
    email: user.email || '',
    dob: user.dob || '',
    gender: user.gender || '',
    phone: user.phone || '',
    country: user.country || '',
    zipCode: user.zipCode || '',
    bio: user.bio || ''
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
      bio: formData.bio
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
        <h1 className={`text-lg font-semibold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('personalInformation')}</h1>
        <button onClick={handleSave} className="text-blue-600 font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">{t('saveProfile')}</button>
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
          <div className={`rounded-3xl p-6 sm:p-8 space-y-6 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('fullName')}</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder={t('enterName')}
                className={`w-full text-base font-medium px-4 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('email')}</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                className={`w-full text-base font-medium px-4 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('phone')}</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                placeholder={t('enterPhone')}
                className={`w-full text-base font-medium px-4 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('birthDate')}</label>
              <input 
                type="date" 
                value={formData.dob} 
                onChange={e => setFormData({...formData, dob: e.target.value})} 
                className={`w-full text-base font-medium px-4 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('gender')}</label>
              <select 
                value={formData.gender} 
                onChange={e => setFormData({...formData, gender: e.target.value})} 
                className={`w-full text-base font-medium px-4 py-4 rounded-2xl border focus:outline-none transition-all appearance-none ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`}
              >
                <option value="">{t('selectGender')}</option>
                <option value="Male">{t('male')}</option>
                <option value="Female">{t('female')}</option>
                <option value="Other">{t('other')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('country')}</label>
              <input 
                type="text" 
                value={formData.country} 
                onChange={e => setFormData({...formData, country: e.target.value})} 
                placeholder={t('enterCountry')}
                className={`w-full text-base font-medium px-4 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('zipCode')}</label>
              <input 
                type="text" 
                value={formData.zipCode} 
                onChange={e => setFormData({...formData, zipCode: e.target.value})} 
                placeholder={t('enterZip')}
                className={`w-full text-base font-medium px-4 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('bio')}</label>
              <textarea 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                rows={3}
                placeholder={t('enterBio')}
                className={`w-full text-base font-medium px-4 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentMethodsSubScreen = ({ appearance, onBack }: { appearance: string, onBack: () => void }) => {
  const { t } = useTranslation();
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

const NotificationsSubScreen = ({ notifications, appearance, onBack }: { notifications: AppNotification[], appearance: string, onBack: () => void }) => {
  const { t } = useTranslation();
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

const PrivacySettingsSubScreen = ({ appearance, onBack }: { appearance: string, onBack: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className={`fixed inset-0 z-[210] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`flex items-center px-6 pt-12 pb-6 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white border-b border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
          <ChevronLeft size={20} />
        </button>
        <h1 className={`text-lg font-semibold ml-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('privacySecurityTitle')}</h1>
      </header>

      <div className="flex-1 px-6 pt-8 overflow-y-auto no-scrollbar pb-32">
        <div className="space-y-8">
          <section className="space-y-4">
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <div className="flex items-center gap-4 text-blue-600">
                <Shield size={24} />
                <h3 className="text-lg font-bold">{t('privacySecurity')}</h3>
              </div>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('privacyIntro')}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('privacyInfoCollect')}</h3>
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('privacyInfoCollectDesc')}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('privacyHowUse')}</h3>
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('privacyHowUseDesc')}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('privacyDataSecurity')}</h3>
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('privacyDataSecurityDesc')}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('privacyDataSharing')}</h3>
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('privacyDataSharingDesc')}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('privacyCookies')}</h3>
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('privacyCookiesDesc')}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('privacyYourRights')}</h3>
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('privacyYourRightsDesc')}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('privacyPolicyUpdates')}</h3>
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('privacyPolicyUpdatesDesc')}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('privacyContactUs')}</h3>
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('privacyContactUsDesc')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};


const HelpSupportSubScreen = ({ appearance, onBack }: { appearance: string, onBack: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className={`fixed inset-0 z-[210] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`flex items-center px-6 pt-12 pb-6 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white border-b border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'}`}>
          <ChevronLeft size={20} />
        </button>
        <h1 className={`text-lg font-semibold ml-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('helpSupportTitle')}</h1>
      </header>

      <div className="flex-1 px-6 pt-8 overflow-y-auto no-scrollbar pb-32">
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('bookingGuideTravelerInfo')}</h3>
            <div className={`rounded-3xl p-6 space-y-6 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-lg shadow-blue-600/20">1</div>
                  <div>
                    <p className="text-sm font-bold">{t('searchSelect')}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t('searchSelectDesc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-lg shadow-blue-600/20">2</div>
                  <div>
                    <p className="text-sm font-bold">{t('accurateTravelerDetails')}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t('accurateTravelerDetailsDesc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-lg shadow-blue-600/20">3</div>
                  <div>
                    <p className="text-sm font-bold">{t('securePaymentHandling')}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t('securePaymentHandlingDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('faqTitle')}</h3>
            <div className="space-y-3">
              {[
                { q: t('faq1Q'), a: t('faq1A') },
                { q: t('faq2Q'), a: t('faq2A') },
                { q: t('faq3Q'), a: t('faq3A') },
                { q: t('faq4Q'), a: t('faq4A') }
              ].map((faq, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <p className="text-sm font-bold mb-2">{faq.q}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-600/10">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">{t('needMoreHelp')}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{t('supportTeamAvailability')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactUsSubScreen = ({ appearance, onBack }: { appearance: string, onBack: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();
  return (
    <div className={`fixed inset-0 z-[210] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`flex items-center px-6 pt-12 pb-6 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white border-b border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
          <ChevronLeft size={20} />
        </button>
        <h1 className={`text-lg font-semibold ml-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('contactUsTitle')}</h1>
      </header>

      <div className="flex-1 px-6 pt-8 overflow-y-auto no-scrollbar pb-32">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-6 rounded-3xl text-center space-y-2 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto">
                <Mail size={20} />
              </div>
              <p className="text-xs font-bold">{t('emailUs')}</p>
              <p className="text-[10px] text-slate-400">support@gotravel.com</p>
            </div>
            <div className={`p-6 rounded-3xl text-center space-y-2 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto">
                <HelpCircle size={20} />
              </div>
              <p className="text-xs font-bold">{t('callUs')}</p>
              <p className="text-[10px] text-slate-400">+1 (800) 123-4567</p>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t('sendMessage')}</h3>
            <div className={`rounded-3xl p-6 space-y-6 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <Check size={32} />
                  </div>
                  <h4 className="font-bold">{t('messageSent')}</h4>
                  <p className="text-xs text-slate-400">{t('messageSentDesc')}</p>
                  <button onClick={() => setSubmitted(false)} className="text-blue-600 text-xs font-bold">{t('sendAnotherMessage')}</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('subject')}</label>
                    <select className={`w-full text-sm font-medium px-4 py-4 rounded-2xl border focus:outline-none transition-all ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`}>
                      <option>{t('generalInquiry')}</option>
                      <option>{t('bookingAssistance')}</option>
                      <option>{t('updateTravelerInfo')}</option>
                      <option>{t('reportIssue')}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('message')}</label>
                    <textarea rows={4} placeholder={t('typeYourMessage')} className={`w-full text-sm font-medium px-4 py-4 rounded-2xl border focus:outline-none transition-all resize-none ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white border-slate-800 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-blue-500'}`} />
                  </div>
                  <button onClick={() => setSubmitted(true)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">{t('sendInquiry')}</button>
                </div>
              )}
            </div>
          </section>

          <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-600/10">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">{t('tipsForSupport')}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{t('tipsForSupportDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LanguageSubScreen = ({ appearance, onBack }: { appearance: string, onBack: () => void }) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const languages = [
    { name: 'English', code: 'en', flag: '🇺🇸' },
    { name: 'العربية', code: 'ar', flag: '🇸🇦' },
    { name: 'አማርኛ', code: 'am', flag: '🇪🇹' },
    { name: 'Español', code: 'es', flag: '🇪🇸' },
    { name: 'Italiano', code: 'it', flag: '🇮🇹' },
    { name: 'Deutsch', code: 'de', flag: '🇩🇪' },
    { name: '中文', code: 'zh', flag: '🇨🇳' },
  ];

  return (
    <div className={`fixed inset-0 z-[210] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`flex items-center px-6 pt-12 pb-6 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white border-b border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
          <ChevronLeft size={20} />
        </button>
        <h1 className={`text-lg font-semibold ml-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('selectLanguage')}</h1>
      </header>

      <div className="flex-1 px-6 pt-8 overflow-y-auto no-scrollbar pb-32">
        <div className={`rounded-3xl overflow-hidden ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
          {languages.map((lang) => (
            <button 
              key={lang.code}
              onClick={() => { setLanguage(lang.code); onBack(); }}
              className={`w-full flex items-center justify-between p-6 border-b last:border-0 transition-colors ${appearance === 'Dark Mode' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-50 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{lang.flag}</span>
                <span className={`font-bold ${language === lang.code ? 'text-blue-600' : ''}`}>{lang.name}</span>
              </div>
              {language === lang.code && <Check size={20} className="text-blue-600" />}
            </button>
          ))}
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-8 font-medium uppercase tracking-widest px-8">{t('languageUpdateNotice')}</p>
      </div>
    </div>
  );
};

const AboutAppSubScreen = ({ onBack, appearance }: { onBack: () => void, appearance: string }) => {
  const { t } = useTranslation();
  return (
    <div className={`fixed inset-0 z-[210] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`flex items-center px-6 pt-12 pb-6 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white border-b border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
          <ChevronLeft size={20} />
        </button>
        <h1 className={`text-lg font-semibold ml-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('aboutApp')}</h1>
      </header>

      <div className="flex-1 px-6 pt-8 overflow-y-auto no-scrollbar pb-32">
        <div className="flex flex-col items-center mb-12">
          <div className={`w-24 h-24 rounded-[32px] bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/20 mb-6`}>
            <Globe size={48} className="text-white" />
          </div>
          <h2 className={`text-2xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>Go Travel</h2>
          <p className="text-slate-400 font-medium">Version 2.4.0</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <div className={`rounded-3xl p-6 space-y-4 ${appearance === 'Dark Mode' ? 'bg-slate-900' : 'bg-white shadow-sm border border-slate-100'}`}>
              <h3 className={`text-lg font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('aboutGoTravel')}</h3>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('aboutDesc1')}
              </p>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('aboutDesc2')}
              </p>
              <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('aboutDesc3')}
              </p>
            </div>
          </section>

          <div className="text-center px-8">
            <p className={`text-sm font-bold italic ${appearance === 'Dark Mode' ? 'text-blue-400' : 'text-blue-600'}`}>
              {t('aboutTagline')}
            </p>
          </div>

          <div className="pt-8 border-t border-slate-200/10 flex flex-col items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Go Travel Inc.</p>
            <div className="flex gap-6">
              <button className="text-slate-400 hover:text-blue-600 transition-colors"><Share2 size={18} /></button>
              <button className="text-slate-400 hover:text-blue-600 transition-colors"><Star size={18} /></button>
              <button className="text-slate-400 hover:text-blue-600 transition-colors"><Globe size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TermsOfServiceSubScreen = ({ appearance, onBack }: { appearance: string, onBack: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className={`fixed inset-0 z-[210] flex flex-col transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`flex items-center px-6 pt-12 pb-6 transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-950' : 'bg-white border-b border-slate-100'}`}>
        <button onClick={onBack} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
          <ChevronLeft size={20} />
        </button>
        <h1 className={`text-lg font-semibold ml-4 ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('termsOfServiceTitle')}</h1>
      </header>

      <div className="flex-1 px-6 pt-8 overflow-y-auto no-scrollbar pb-32">
        <div className="space-y-6">
          <div className={`border rounded-3xl p-6 ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
            <p className={`text-sm leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('termsOfServiceContent')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsItem = ({ icon, label, onClick, appearance }: any) => {
  const { t } = useTranslation();
  return (
    <div onClick={onClick} className={`p-5 border-b flex items-center justify-between cursor-pointer transition-colors ${appearance === 'Dark Mode' ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-50 hover:bg-slate-50'}`}>
      <div className="flex items-center gap-4">
        <div className="text-slate-400">{icon}</div>
        <p className={`font-bold ${appearance === 'Dark Mode' ? 'text-slate-200' : 'text-slate-700'}`}>{t(label)}</p>
      </div>
    </div>
  );
};
