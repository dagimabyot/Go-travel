import React from 'react';
import { Plane, Home, Compass, Search, Bookmark, Settings, Navigation } from 'lucide-react';
import { Screen, User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Avatar } from '../ui/Avatar';

interface NavbarProps {
  activeScreen: Screen;
  setScreen: (s: Screen) => void;
  language: string;
  appearance: string;
  user: User | null;
  setSettingsSubScreen: (s: string) => void;
}

export const Navbar = ({ activeScreen, setScreen, language, appearance, user, setSettingsSubScreen }: NavbarProps) => {
  if (activeScreen === 'splash' || (activeScreen as string).startsWith('auth-')) return null;
  const { t } = useLanguage();

  const isActive = (screen: Screen) => activeScreen === screen || (screen === 'my-trips' && activeScreen === 'trip-details');

  return (
    <>
      {/* Mobile Top Header */}
      <header className={`fixed top-0 left-0 right-0 border-b px-6 py-4 flex justify-between items-center z-[200] md:hidden transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setScreen('home')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Plane size={24} className="rotate-45" />
          </div>
          <span className={`font-bold text-xl tracking-tight ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>GoTravel</span>
        </div>
        <div 
          onClick={() => {
            setSettingsSubScreen('profile');
            setScreen('settings');
          }}
          className="cursor-pointer"
        >
          <Avatar user={user} size={40} />
        </div>
      </header>

      {/* Main Navigation */}
      <nav className={`fixed left-0 right-0 z-[200] transition-colors duration-300 
        bottom-0 border-t px-6 py-2 flex justify-around items-center
        md:top-0 md:bottom-auto md:border-b md:border-t-0 md:px-12 md:py-4 md:flex md:justify-between
        ${appearance === 'Dark Mode' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'}`}>
        
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center gap-3 cursor-pointer" onClick={() => setScreen('home')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Plane size={24} className="rotate-45" />
          </div>
          <span className={`font-bold text-xl md:text-2xl tracking-tight ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>GoTravel</span>
        </div>
        
        {/* Desktop Navigation & Avatar Grouped Right */}
        <div className="hidden md:flex items-center gap-12 ml-auto">
          <NavItem 
            icon={<Home size={22} />} 
            label={t('home')} 
            active={activeScreen === 'home'} 
            onClick={() => setScreen('home')} 
            appearance={appearance}
          />
          <NavItem 
            icon={<Navigation size={22} />} 
            label={t('trips')} 
            active={isActive('my-trips')} 
            onClick={() => setScreen('my-trips')} 
            appearance={appearance}
          />
          <NavItem 
            icon={<Search size={22} />} 
            label={t('search')} 
            active={activeScreen === 'flight-search'} 
            onClick={() => setScreen('flight-search')} 
            appearance={appearance}
          />
          <NavItem 
            icon={<Bookmark size={22} />} 
            label={t('saved')} 
            active={activeScreen === 'saved'} 
            onClick={() => setScreen('saved')} 
            appearance={appearance}
          />
          <NavItem 
            icon={<Settings size={22} />} 
            label={t('settings')} 
            active={activeScreen === 'settings'} 
            onClick={() => {
              setSettingsSubScreen('main');
              setScreen('settings');
            }} 
            appearance={appearance}
          />
          
          <div 
            onClick={() => {
              setSettingsSubScreen('profile');
              setScreen('settings');
            }}
            className="cursor-pointer hover:scale-105 transition-all ml-4"
          >
            <Avatar user={user} size={40} />
          </div>
        </div>

        {/* Mobile Navigation (Bottom) */}
        <div className="flex md:hidden justify-around w-full">
          <NavItem 
            icon={<Home size={22} />} 
            label={t('home')} 
            active={activeScreen === 'home'} 
            onClick={() => setScreen('home')} 
            appearance={appearance}
          />
          <NavItem 
            icon={<Navigation size={22} />} 
            label={t('trips')} 
            active={isActive('my-trips')} 
            onClick={() => setScreen('my-trips')} 
            appearance={appearance}
          />
          <NavItem 
            icon={<Search size={22} />} 
            label={t('search')} 
            active={activeScreen === 'flight-search'} 
            onClick={() => setScreen('flight-search')} 
            appearance={appearance}
          />
          <NavItem 
            icon={<Bookmark size={22} />} 
            label={t('saved')} 
            active={activeScreen === 'saved'} 
            onClick={() => setScreen('saved')} 
            appearance={appearance}
          />
          <NavItem 
            icon={<Settings size={22} />} 
            label={t('settings')} 
            active={activeScreen === 'settings'} 
            onClick={() => {
              setSettingsSubScreen('main');
              setScreen('settings');
            }} 
            appearance={appearance}
          />
        </div>
      </nav>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  appearance: string;
}

const NavItem = ({ icon, label, active, onClick, appearance }: NavItemProps) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all group ${active ? 'text-blue-600' : appearance === 'Dark Mode' ? 'text-slate-600 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20'}`}>
      {React.cloneElement(icon as React.ReactElement, { 
        size: 20,
        strokeWidth: active ? 2.5 : 2
      })}
    </div>
    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${active ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
  </button>
);
