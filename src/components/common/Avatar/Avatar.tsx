import { cn } from '@/utils/cn';
import * as styles from './variants';

interface AvatarProps {
  src?: string;      
  alt?: string;       
  fallback?: string;  
  size?: 90 | 64 | 40 | 20; 
  className?: string;
}

export const Avatar = ({ 
  src, 
  alt = 'profile', 
  fallback = 'G', 
  size = 40, 
  className 
}: AvatarProps) => {
  return (
    <div className={cn(styles.avatarBase, styles.avatarSizes[size], className)}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="select-none">{fallback}</span>
      )}
    </div>
  );
};
