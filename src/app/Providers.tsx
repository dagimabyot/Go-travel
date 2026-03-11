import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_mock');

interface ProvidersProps {
  children: React.ReactNode;
}

// Component to apply RTL styles
const RTLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRTL, language } = useLanguage();

  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Apply RTL direction
    if (isRTL) {
      htmlElement.setAttribute('dir', 'rtl');
      htmlElement.style.direction = 'rtl';
    } else {
      htmlElement.setAttribute('dir', 'ltr');
      htmlElement.style.direction = 'ltr';
    }

    // Apply language attribute for CSS language-specific styling
    htmlElement.lang = language;
  }, [isRTL, language]);

  return <>{children}</>;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <LanguageProvider>
      <RTLProvider>
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      </RTLProvider>
    </LanguageProvider>
  );
};
