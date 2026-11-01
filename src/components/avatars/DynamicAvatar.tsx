import React from 'react';
import type { Gender } from '../../types';
import { BoyAvatar } from './BoyAvatar';
import { GirlAvatar } from './GirlAvatar';

interface DynamicAvatarProps {
  gender: Gender;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const DynamicAvatar: React.FC<DynamicAvatarProps> = ({
  gender,
  size = 'md',
  className = '',
  animated = true
}) => {
  if (gender === 'Girl') {
    return <GirlAvatar size={size} className={className} animated={animated} />;
  }
  return <BoyAvatar size={size} className={className} animated={animated} />;
};
