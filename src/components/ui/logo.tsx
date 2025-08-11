import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'default' | 'velocity' | 'excel' | 'forms';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-8 h-8", 
  width = 32, 
  height = 32,
  variant = 'default'
}) => {
  return (
    <Image
      src="/logo.svg"
      alt="FastForm Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}; 