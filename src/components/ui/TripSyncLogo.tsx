import React from 'react';

interface TripSyncLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TripSyncLogo: React.FC<TripSyncLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="currentColor"
          className="text-blue-600"
        />
        
        {/* Inner Circle */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="white"
        />
        
        {/* Route Path */}
        <path
          d="M25 40 Q40 20 50 40 Q60 60 75 40"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-blue-600"
        />
        
        {/* Location Pins */}
        <circle cx="25" cy="40" r="4" fill="currentColor" className="text-blue-600" />
        <circle cx="50" cy="40" r="4" fill="currentColor" className="text-green-500" />
        <circle cx="75" cy="40" r="4" fill="currentColor" className="text-red-500" />
        
        {/* TS Text */}
        <text
          x="50"
          y="70"
          textAnchor="middle"
          className="text-xs font-bold fill-current text-blue-600"
          style={{ fontSize: '12px' }}
        >
          TS
        </text>
      </svg>
    </div>
  );
};
