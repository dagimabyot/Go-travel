import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, CheckCircle2, XCircle, ShieldCheck, Chrome, Facebook, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { authService } from '../../services/auth';

interface SignupScreenProps {
  onSignup: (name: string, email: string, pass: string, phone: string) => void;
  onLogin: () => void;
  onGoogleLogin: () => void;
  onBack: () => void;
}

export const SignupScreen = ({ onSignup, onLogin, onGoogleLogin, onBack }: SignupScreenProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setGeneralError(null);
    setSocialLoading(provider);
    try {
      if (provider === 'google') {
        await onGoogleLogin();
      } else {
        setGeneralError('Facebook login is not configured yet. Please use Google or Email.');
        setSocialLoading(null);
      }
    } catch (err) {
      console.error(`${provider} auth error:`, err);
      setGeneralError(`Failed to sign in with ${provider}. Please try again.`);
      setSocialLoading(null);
    }
  };
  
  const alreadyAccountText = t('alreadyAccount');
  const alreadyAccountParts = alreadyAccountText.includes('?') ? alreadyAccountText.split('?') : [alreadyAccountText, 'Sign In'];

  const validatePassword = (pass: string) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const isLongEnough = pass.length >= 8;
    return { hasUpper, hasNumber, isLongEnough };
  };

  const passwordStatus = validatePassword(password);

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    if (submitAttempted) {
      if (!firstName.trim()) newErrors.firstName = 'First name is required';
      if (!lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        newErrors.email = 'Invalid email format';
      }
      
      if (!phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (phone.length < 10) {
        newErrors.phone = 'Invalid phone number';
      }

      if (!passwordStatus.isLongEnough || !passwordStatus.hasUpper || !passwordStatus.hasNumber) {
        newErrors.password = 'Password does not meet requirements';
      }

      if (password && confirmPassword && password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      }

      if (!acceptTerms) newErrors.terms = 'You must accept the Terms & Conditions';
      if (!acceptPrivacy) newErrors.privacy = 'You must accept the Privacy Policy';
    }

    setErrors(newErrors);
  }, [firstName, lastName, email, phone, password, confirmPassword, acceptTerms, acceptPrivacy, submitAttempted, passwordStatus.isLongEnough, passwordStatus.hasUpper, passwordStatus.hasNumber]);

  const isFormValid = 
    firstName.trim() && 
    lastName.trim() && 
    email.trim() && 
    /^\S+@\S+\.\S+$/.test(email) &&
    phone.trim() &&
    phone.length >= 10 &&
    passwordStatus.isLongEnough &&
    passwordStatus.hasUpper &&
    passwordStatus.hasNumber &&
    password === confirmPassword &&
    acceptTerms &&
    acceptPrivacy;

  const handleSignupSubmit = async () => {
    setSubmitAttempted(true);
    setGeneralError(null);
    if (!isFormValid) {
      // Errors will be shown by the useEffect
      return;
    }
    setLoading(true);
    try {
      await onSignup(`${firstName} ${lastName}`, email, password, phone);
    } catch (err: any) {
      console.error('Signup error:', err);
      setLoading(false);
      if (err.code === 'auth/email-already-in-use') {
        setGeneralError('This email is already in use. Please try logging in instead.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setGeneralError('Email/Password authentication is not enabled in the Firebase Console. Please enable it in the "Sign-in method" tab.');
      } else {
        setGeneralError(err.message || 'Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[90] flex overflow-hidden">
        {/* Left Side - Branding/Image (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-100 relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.pexels.com/photos/2108845/pexels-photo-2108845.jpeg" 
              alt="Travel" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
          
          <div className="relative z-10 max-w-md text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">Start your journey with us.</h1>
            <p className="text-lg text-white leading-relaxed font-medium drop-shadow-md">
              Join thousands of travelers who trust our platform for their global adventures. Secure, fast, and reliable.
            </p>
            
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/80 font-medium drop-shadow-sm">Joined by 10k+ travelers this month</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 h-full bg-slate-50 overflow-y-auto hide-scrollbar relative">
          {/* Decorative Background Elements (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/4 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="hidden lg:block absolute bottom-1/4 -left-20 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

          <div className="min-h-full w-full flex flex-col items-center py-12 lg:py-20 px-6 lg:px-12">
            <div className="w-full max-w-3xl lg:bg-white/70 lg:backdrop-blur-xl lg:rounded-[32px] lg:shadow-[0_20px_50px_rgba(0,0,0,0.1)] lg:p-12 lg:border lg:border-white/50 lg:bg-gradient-to-br lg:from-white lg:to-slate-50/50 animate-in fade-in zoom-in duration-700">
              <button onClick={onBack} className="mb-8 group flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                  <ArrowLeft size={18} />
                </div>
                <span className="text-sm font-medium">Back</span>
              </button>
              
              <div className="mb-10">
                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Welcome to <span className="text-primary">GoTravel</span></h2>
                <p className="text-slate-500 text-lg lg:text-xl leading-relaxed">Plan smarter trips and manage your journeys in one place.</p>
              </div>

              {generalError && (
                <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{generalError}</p>
                </div>
              )}
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">First Name</label>
                <input 
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-slate-200'} focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm`}
                />
                {errors.firstName && <p className="text-[10px] text-red-500 ml-1">{errors.firstName}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 ml-1">Last Name</label>
                <input 
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-slate-200'} focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm`}
                />
                {errors.lastName && <p className="text-[10px] text-red-500 ml-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 ml-1">Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm`}
              />
              {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 ml-1">Phone Number</label>
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={phone => setPhone(phone)}
                containerClass="phone-input-container"
                inputClass="!w-full !h-auto !py-3 !px-12 !rounded-xl !border !border-slate-200 !text-sm !outline-none focus:!border-primary focus:!ring-4 focus:!ring-primary/10 !transition-all"
                buttonClass="!border-none !bg-transparent !rounded-l-xl !px-2"
                dropdownClass="!rounded-xl !shadow-2xl !border-slate-100 !text-sm"
                enableSearch={true}
              />
              {errors.phone && <p className="text-[10px] text-red-500 ml-1">{errors.phone}</p>}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm pr-12"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 ml-1">
                <div className={`flex items-center gap-1.5 text-[11px] font-medium ${passwordStatus.isLongEnough ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {passwordStatus.isLongEnough ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  Min 8 characters
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-medium ${passwordStatus.hasUpper ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {passwordStatus.hasUpper ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  1 Uppercase
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-medium ${passwordStatus.hasNumber ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {passwordStatus.hasNumber ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  1 Number
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 ml-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm pr-12`}
                />
                <button 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-red-500 ml-1">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${acceptTerms ? 'bg-primary border-primary' : 'border-slate-200 group-hover:border-primary/40'} ${errors.terms ? 'border-red-500' : ''}`}>
                    {acceptTerms && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-[13px] text-slate-600 leading-snug">I accept the <button className="text-primary font-bold hover:underline">Terms & Conditions</button></span>
              </label>
              {errors.terms && <p className="text-[10px] text-red-500 ml-8 -mt-2">{errors.terms}</p>}

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${acceptPrivacy ? 'bg-primary border-primary' : 'border-slate-200 group-hover:border-primary/40'} ${errors.privacy ? 'border-red-500' : ''}`}>
                    {acceptPrivacy && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-[13px] text-slate-600 leading-snug">I accept the <button className="text-primary font-bold hover:underline">Privacy Policy</button></span>
              </label>
              {errors.privacy && <p className="text-[10px] text-red-500 ml-8 -mt-2">{errors.privacy}</p>}
            </div>
            
            <div className="pt-6 flex flex-col items-center gap-6">
              <button 
                disabled={loading}
                onClick={handleSignupSubmit}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 ${loading ? 'bg-slate-200 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-primary/20'}`}
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              {submitAttempted && !isFormValid && (
                <p className="text-[11px] text-red-500 font-medium text-center animate-in fade-in slide-in-from-top-1">
                  Please fix the errors above to continue
                </p>
              )}

              <div className="relative py-2 w-full">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white lg:bg-transparent px-4 text-slate-400 font-bold tracking-widest">or sign up with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                  disabled={socialLoading !== null}
                  onClick={() => handleSocialLogin('google')}
                  className="group py-3 rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-3 font-bold text-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                >
                  {socialLoading === 'google' ? (
                    <Loader2 size={18} className="animate-spin text-primary" />
                  ) : (
                    <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-sm">Google</span>
                </button>
                
                <button 
                  disabled={socialLoading !== null}
                  onClick={() => handleSocialLogin('facebook')}
                  className="group py-3 rounded-xl bg-[#1877F2] flex items-center justify-center gap-3 font-bold text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:bg-[#166fe5] transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                >
                  {socialLoading === 'facebook' ? (
                    <Loader2 size={18} className="animate-spin text-white" />
                  ) : (
                    <Facebook size={18} className="text-white group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-sm">Facebook</span>
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  {alreadyAccountParts[0].trim()}{alreadyAccountText.includes('?') ? '?' : ''} <button onClick={onLogin} className="text-primary font-bold hover:underline">{alreadyAccountParts[1].trim()}</button>
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
