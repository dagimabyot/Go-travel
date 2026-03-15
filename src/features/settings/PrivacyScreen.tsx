import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ShieldCheck, Info, Lock, Users, Cookie, UserCheck, RefreshCw, Phone } from 'lucide-react';

interface PrivacyScreenProps {
  onBack: () => void;
  appearance: string;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack, appearance }) => {
  const isDark = appearance === 'Dark Mode';

  const sections = [
    {
      icon: <Info className="w-5 h-5 text-emerald-500" />,
      title: "Information We Collect",
      content: [
        "Personal details (such as name, email address, phone number)",
        "Travel and booking information",
        "Traveler details required for reservations (e.g., passport details where applicable)",
        "Payment-related information (processed securely through trusted payment providers)",
        "Usage data to improve website performance and user experience"
      ]
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: "How We Use Your Information",
      content: [
        "Process bookings and reservations",
        "Provide customer support and travel updates",
        "Verify traveler identity where required",
        "Improve our services and personalize your experience",
        "Comply with legal and regulatory requirements",
        "We never sell or misuse your personal data."
      ]
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
      title: "Data Security",
      content: [
        "Secure data encryption",
        "Protected servers and access controls",
        "Trusted third-party payment gateways",
        "Regular security monitoring and updates",
        "These measures help prevent unauthorized access, data loss, or misuse."
      ]
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      title: "Data Sharing",
      content: [
        "Travel service providers (hotels, airlines, tour operators) strictly for booking purposes",
        "Payment processors for secure transactions",
        "Legal authorities when required by law",
        "All partners are required to follow strict data protection standards."
      ]
    },
    {
      icon: <Cookie className="w-5 h-5 text-emerald-500" />,
      title: "Cookies & Tracking",
      content: [
        "Remember your preferences (such as language)",
        "Improve site functionality and performance",
        "Analyze traffic to enhance user experience",
        "You can manage or disable cookies through your browser settings."
      ]
    },
    {
      icon: <UserCheck className="w-5 h-5 text-emerald-500" />,
      title: "Your Rights",
      content: [
        "Access your personal data",
        "Request corrections or updates",
        "Request deletion of your data (subject to legal obligations)",
        "Control communication preferences"
      ]
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-emerald-500" />,
      title: "Policy Updates",
      content: [
        "We may update this Privacy & Security policy from time to time. Any changes will be clearly posted on this page to keep you informed."
      ]
    },
    {
      icon: <Phone className="w-5 h-5 text-emerald-500" />,
      title: "Contact Us",
      content: [
        "If you have any questions or concerns about privacy or security, please contact us through the Contact Us page. Our team is always ready to assist you."
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-4xl mx-auto px-6 py-12 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
    >
      <button 
        onClick={onBack}
        className={`flex items-center gap-2 mb-8 transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-950'}`}
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <div className="mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
          🔐 Privacy & Security
        </h1>
        <p className={`text-lg opacity-70 leading-relaxed max-w-2xl`}>
          At GoTravel, your privacy and security are our top priorities. We are committed to protecting your personal information and ensuring a safe, reliable experience throughout your journey on our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-6 rounded-2xl border transition-all duration-300 ${
              isDark 
                ? 'bg-slate-900/50 border-white/10 hover:border-emerald-500/50' 
                : 'bg-slate-50 border-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/5'}`}>
                {section.icon}
              </div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                {section.title}
              </h2>
            </div>
            <ul className="space-y-3">
              {section.content.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm opacity-80 leading-relaxed">
                  <span className="text-emerald-500 mt-1.5 h-1 w-1 rounded-full bg-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className={`mt-16 pt-8 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
        <p className="text-sm opacity-50 text-center">
          © 2026 GoTravel. All rights reserved.
        </p>
      </div>
    </motion.div>
  );
};
