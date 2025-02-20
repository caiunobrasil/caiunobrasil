import React from 'react';
import { useLocation } from 'react-router-dom';

interface TopCardProps {
  title: string;
  subtitle: string;
}

export function TopCard({ title, subtitle }: TopCardProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Material Design 3 Large Top App Bar with hero section */}
      <div className="bg-primary h-[320px] relative">
        {/* Scrim gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {subtitle}
          </p>
        </div>
        
        {/* Material Design 3 shape */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-primary-container rounded-t-[48px]" />
      </div>
    </div>
  );
}