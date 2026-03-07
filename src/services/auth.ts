import { api } from './api';
import { User } from '../types';

export const authService = {
  login: (email: string, pass: string) => 
    api.post<User>('/api/auth/login', { email, password: pass }),
  
  signup: (name: string, email: string, pass: string) => 
    api.post<User>('/api/auth/signup', { name, email, password: pass }),

  getSocialAuthUrl: async (provider: 'google' | 'facebook') => {
    const { url } = await api.get<{ url: string }>(`/api/auth/${provider}/url`);
    return url;
  }
};
