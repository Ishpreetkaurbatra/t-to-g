import React, { useState } from 'react';
import logoImg from '../assets/images/logo.jpg';

interface TtoGLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showText?: boolean;
  animated?: boolean;
  variant?: 'light' | 'dark' | 'glow';
  className?: string;
}

export const TtoGLogo: React.FC<TtoGLogoProps> = ({
  size = 'md',
  animated = false,
  variant = 'light',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Dimensions for the standalone logo mark
  const iconSize = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 52,
    xl: 72,
  }[size];

  const roundedClass = {
    xs: 'rounded-lg',
    sm: 'rounded-xl',
    md: 'rounded-2xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden ${roundedClass} ${
        variant === 'glow' ? 'shadow-[0_0_24px_rgba(16,185,129,0.5)] ring-2 ring-emerald-400/40' : 'shadow-xs ring-1 ring-black/5'
      } ${
        animated ? 'transition-transform duration-300 hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{
        width: iconSize,
        height: iconSize,
      }}
    >
      {!imgError ? (
        <img
          src={logoImg}
          alt="Trend to Growth Logo"
          className="w-full h-full object-cover select-none pointer-events-none"
          onError={() => setImgError(true)}
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm bg-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ttog-vec-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="35%" stopColor="#0284c7" />
              <stop offset="70%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="ttog-arrowhead" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Clean White Frame Background */}
          <rect width="100" height="100" fill="#ffffff" />

          {/* Ascending Trend Surge & Growth Arrow (No TG letters) */}
          <path
            d="M 22 75 L 43 41 L 34 41 L 22 75 Z"
            fill="#1d4ed8"
          />
          <path
            d="M 23 75 L 47 41 L 52 50 L 68 24 L 77 31 L 56 65 L 48 54 L 32 75 Z"
            fill="url(#ttog-vec-grad)"
          />
          <path
            d="M 57 32 L 77 17 L 74 41 L 67 35 L 57 32 Z"
            fill="url(#ttog-arrowhead)"
          />
          <circle cx="77" cy="17" r="3.5" fill="#34d399" />
        </svg>
      )}

      {/* Dynamic active status pulse dot */}
      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white shadow-xs animate-pulse" />
    </div>
  );
};


