
'use client';

import * as Fa from 'react-icons/fa';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2 text-base',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-500/20',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500/20',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/20',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500/20',
    outline: 'border-2 border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus:ring-rose-500/20',
  };

  const baseClasses = `
    rounded-lg font-medium transition-all duration-300 
    flex items-center justify-center gap-2
    focus:outline-none focus:ring-2
    disabled:opacity-60 disabled:cursor-not-allowed
    ${!disabled && 'hover:shadow-lg hover:-translate-y-0.5'}
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={baseClasses}
    >
      {isLoading ? (
        <>
          <Fa.FaSpinner className="animate-spin w-4 h-4" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}