import React from 'react';
import { User } from '../../types';

interface AvatarProps {
  user: User | null;
  className?: string;
  size?: number;
}

export const Avatar = ({ user, className = '', size = 48 }: AvatarProps) => {
  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`;
  
  return (
    <div 
      className={`rounded-full overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={avatarUrl} 
        alt={user?.name || 'Avatar'} 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
