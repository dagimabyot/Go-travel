import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Loader2, Building2, CheckCircle2 } from 'lucide-react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { Flight, Package } from '../../types';
import { translations } from '../../constants/translations';

interface PaymentScreenProps {
  flight?: Flight;
  pkg?: Package;
  onConfirm: () => Promise<void> | void;
  onBack: () => void;
  language: string;
  appearance: string;
}

export const PaymentScreen = ({ flight, pkg, onConfirm, onBack, language, appearance }: PaymentScreenProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [view, setView] = useState<'selection' | 'form'>('selection');
  const [method, setMethod] = useState<'card' | 'paypal' | 'stripe' | 'bank'>('card');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    country: 'BD',
    zipCode: '',
    email: '',
    cardHolder: '',
    accountHolder: '',
    accountNumber: ''
  });

  const t = (key: string) => translations[language]?.[key] || translations['English'][key];
  const price = flight?.price || pkg?.price || 700;

  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_9B6eV7faW19u4cTeWr6Zy01";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMethodSelect = (m: 'card' | 'paypal' | 'stripe' | 'bank') => {
    setMethod(m);
    setView('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Await the booking creation to ensure it's saved before redirecting
    await onConfirm();
    
    if (method === 'stripe') {
      setTimeout(() => {
        window.location.href = STRIPE_PAYMENT_LINK;
      }, 1500);
      return;
    }

    // Simulate processing for other methods
    setTimeout(() => {
      setLoading(false);
      // Removed window.location.href = "/"; to prevent automatic logout/reload
    }, 2000);
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '18px',
        color: appearance === 'Dark Mode' ? '#ffffff' : '#0f172a',
        fontWeight: '600',
        '::placeholder': {
          color: appearance === 'Dark Mode' ? '#64748b' : '#94a3b8',
        },
      },
    },
  };

  if (view === 'selection') {
    return (
      <div className={`min-h-screen pb-24 pt-8 px-6 max-w-4xl mx-auto transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
        <header className="flex items-center justify-center mb-12 relative">
          <button onClick={onBack} className={`absolute left-0 w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
            <ChevronLeft size={24} />
          </button>
          <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('paymentMethod')}</h1>
        </header>

        <div className="space-y-4">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 px-2">{t('selectPreferredMethod')}</p>
          
          <button 
            onClick={() => handleMethodSelect('card')}
            className={`w-full flex items-center gap-4 p-6 rounded-[32px] border transition-all group ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 hover:border-blue-600 hover:bg-blue-900/20' : 'bg-white border-slate-100 hover:border-blue-600 hover:bg-blue-50/30'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
              <CreditCard size={28} />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('creditDebitCard')}</p>
              <p className="text-xs text-slate-400">{t('visaMastercardAmex')}</p>
            </div>
            <ChevronLeft size={20} className="text-slate-300 rotate-180" />
          </button>

          <button 
            onClick={() => handleMethodSelect('paypal')}
            className={`w-full flex items-center gap-4 p-6 rounded-[32px] border transition-all group ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 hover:border-blue-600 hover:bg-blue-900/20' : 'bg-white border-slate-100 hover:border-blue-600 hover:bg-blue-50/30'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 group-hover:bg-white' : 'bg-slate-50 group-hover:bg-white group-hover:border group-hover:border-slate-100'}`}>
              <img 
                src="https://www.vectorlogo.zone/logos/paypal/paypal-icon.svg" 
                alt="PayPal" 
                className="h-8 w-8 object-contain" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/174/174861.png';
                }}
              />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('paypal')}</p>
              <p className="text-xs text-slate-400">{t('fastSecureCheckout')}</p>
            </div>
            <ChevronLeft size={20} className="text-slate-300 rotate-180" />
          </button>

          <button 
            onClick={() => handleMethodSelect('stripe')}
            className={`w-full flex items-center gap-4 p-6 rounded-[32px] border transition-all group ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 hover:border-blue-600 hover:bg-blue-900/20' : 'bg-white border-slate-100 hover:border-blue-600 hover:bg-blue-50/30'}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white transition-colors overflow-hidden p-3">
              <img 
                src="https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg" 
                alt="Stripe" 
                className="w-full h-full object-contain invert brightness-0" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="font-black text-2xl italic">S</span>';
                }}
              />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('stripeAccount')}</p>
              <p className="text-xs text-slate-400">{t('directCheckoutStripe')}</p>
            </div>
            <ChevronLeft size={20} className="text-slate-300 rotate-180" />
          </button>

          <button 
            onClick={() => handleMethodSelect('bank')}
            className={`w-full flex items-center gap-4 p-6 rounded-[32px] border transition-all group ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 hover:border-emerald-600 hover:bg-emerald-900/20' : 'bg-white border-slate-100 hover:border-blue-600 hover:bg-blue-50/30'}`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-800 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white'}`}>
              <Building2 size={28} />
            </div>
            <div className="flex-1 text-left">
              <p className={`font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>{t('bankTransfer')}</p>
              <p className="text-xs text-slate-400">{t('directWireBank')}</p>
            </div>
            <ChevronLeft size={20} className="text-slate-300 rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 pt-8 px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300 transition-colors duration-300 ${appearance === 'Dark Mode' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className="flex items-center justify-between mb-12">
        <button onClick={() => setView('selection')} className={`w-12 h-12 border rounded-full flex items-center justify-center shadow-sm transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
          <ChevronLeft size={24} />
        </button>
        <h1 className={`text-xl font-bold ${appearance === 'Dark Mode' ? 'text-white' : 'text-slate-900'}`}>
          {method === 'card' ? t('cardDetails') : method === 'paypal' ? t('paypalCheckout') : method === 'stripe' ? t('stripeCheckout') : t('bankDetails')}
        </h1>
        <div className="w-12" />
      </header>

      <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 transition-colors ${appearance === 'Dark Mode' ? 'bg-blue-900/20 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0">
          <CheckCircle2 size={16} />
        </div>
        <p className={`text-xs font-bold ${appearance === 'Dark Mode' ? 'text-blue-200' : 'text-blue-900'}`}>{t('tripUpcomingNote')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {method === 'card' && (
          <>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('cardholderName')}</label>
              <input 
                type="text"
                name="cardHolder"
                placeholder="John Doe"
                required
                className={`w-full p-5 rounded-2xl border focus:border-blue-600 focus:outline-none font-bold transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('cardNumber')}</label>
              <div className={`p-5 rounded-2xl border transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <CardNumberElement options={elementOptions} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('expiryDate')}</label>
                <div className={`p-5 rounded-2xl border transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <CardExpiryElement options={elementOptions} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('cvv')}</label>
                <div className={`p-5 rounded-2xl border transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                  <CardCvcElement options={elementOptions} />
                </div>
              </div>
            </div>
          </>
        )}

        {method === 'paypal' && (
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <img 
                src="https://www.vectorlogo.zone/logos/paypal/paypal-icon.svg" 
                alt="PayPal" 
                className="h-16 w-16 object-contain" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/174/174861.png';
                }}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('paypalEmail')}</label>
              <input 
                type="email"
                name="email"
                placeholder="yourname@example.com"
                required
                className={`w-full p-5 rounded-2xl border focus:border-blue-600 focus:outline-none font-bold transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
              />
            </div>
            <p className="text-xs text-slate-400 text-center">{t('paypalRedirectNote')}</p>
          </div>
        )}

        {method === 'stripe' && (
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white overflow-hidden p-4">
                <img 
                  src="https://www.vectorlogo.zone/logos/stripe/stripe-icon.svg" 
                  alt="Stripe" 
                  className="w-full h-full object-contain invert brightness-0" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="font-black text-3xl italic">S</span>';
                  }}
                />
              </div>
            </div>
            <div className={`p-6 rounded-3xl border transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('checkoutInfo')}</p>
              <p className={`text-xs leading-relaxed ${appearance === 'Dark Mode' ? 'text-slate-400' : 'text-slate-600'}`}>{t('stripeRedirectNote')}</p>
            </div>
          </div>
        )}

        {method === 'bank' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('accountHolderName')}</label>
              <input 
                type="text"
                name="accountHolder"
                placeholder="Full Name"
                required
                className={`w-full p-5 rounded-2xl border focus:border-emerald-600 focus:outline-none font-bold transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('accountNumberIban')}</label>
              <input 
                type="text"
                name="accountNumber"
                placeholder="**** **** **** 1234"
                required
                className={`w-full p-5 rounded-2xl border focus:border-emerald-600 focus:outline-none font-bold transition-colors ${appearance === 'Dark Mode' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
              />
            </div>
            <div className={`p-6 rounded-3xl border transition-colors ${appearance === 'Dark Mode' ? 'bg-emerald-900/20 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">{t('bankInstructions')}</p>
              <p className={`text-xs leading-relaxed ${appearance === 'Dark Mode' ? 'text-emerald-200' : 'text-emerald-900'}`}>{t('bankTransferNote')}</p>
            </div>
          </div>
        )}

        <div className="pt-8">
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-6 rounded-[32px] font-bold text-xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${method === 'bank' ? (appearance === 'Dark Mode' ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-emerald-600 shadow-emerald-100') : (appearance === 'Dark Mode' ? 'bg-blue-600 shadow-blue-900/40' : 'bg-blue-600 shadow-blue-100')} text-white`}
          >
            {loading ? <Loader2 className="animate-spin" /> : t('payNow')}
          </button>
        </div>
      </form>
    </div>
  );
};
