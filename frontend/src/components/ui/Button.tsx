'use client';

import React from 'react';
import { useSound } from '../../context/SoundContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'blue' | 'danger' | 'purple';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  disabled,
  className = '',
  onClick,
  children,
  ...props
}) => {
  const { playClickSound } = useSound();

  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    blue: 'btn-blue',
    danger: 'btn-danger',
    purple: 'btn-purple',
  }[variant];

  const sizeClass = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-3 px-5',
    lg: 'text-base py-4 px-8 text-lg',
  }[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      playClickSound();
      if (onClick) onClick(e);
    }
  };

  return (
    <button
      className={`btn-3d ${variantClass} ${sizeClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
