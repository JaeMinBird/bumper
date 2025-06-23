'use client';

import { useEffect, useRef, useState } from 'react';

type BumperProps = {
  className?: string;
  title?: string;
  id?: string;
};

export default function Bumper({ className = '', title, id }: BumperProps) {
  const bumperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const handleScroll = () => {
      if (bumperRef.current) {
        const rect = bumperRef.current.getBoundingClientRect();
        const progress = 1 - (rect.top / window.innerHeight);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      }
    };

    if (bumperRef.current) {
      observer.observe(bumperRef.current);
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (bumperRef.current) {
        observer.unobserve(bumperRef.current);
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div 
      id={id}
      ref={bumperRef}
      className={`w-full py-6 relative ${className}`}
    >
      <div className="flex items-center justify-center w-full gap-4">
        {/* Left side */}
        <div className="h-[4px] flex-grow relative overflow-hidden">
          {/* Dashed line container */}
          <div 
            className={`absolute top-0 left-0 h-[4px] w-full flex gap-[6px] transition-opacity duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Create repeating dash elements */}
            {[...Array(20)].map((_, i) => (
              <div 
                key={`left-dash-${i}`} 
                className="h-full w-[12px] bg-foreground/30 rounded-full"
              ></div>
            ))}
          </div>
          
          {/* Progress bar overlay */}
          <div className="absolute top-0 left-0 w-full h-[4px]">
            <div 
              className="absolute top-0 left-0 h-[4px] bg-foreground/80 rounded-full transition-transform duration-1000 ease-out origin-left"
              style={{ width: '100%', transform: `scaleX(${isVisible ? scrollProgress : 0})` }}
            />
          </div>
        </div>

        {/* Center section with text */}
        <div className="px-2">
          {/* Title text */}
          {title && (
            <div 
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <span className="font-medium text-xs text-foreground/80 uppercase tracking-wider whitespace-nowrap">
                {title}
              </span>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="h-[4px] flex-grow relative overflow-hidden">
          {/* Dashed line container */}
          <div 
            className={`absolute top-0 right-0 h-[4px] w-full flex justify-end gap-[6px] transition-opacity duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Create repeating dash elements */}
            {[...Array(20)].map((_, i) => (
              <div 
                key={`right-dash-${i}`} 
                className="h-full w-[12px] bg-foreground/30 rounded-full"
              ></div>
            ))}
          </div>
          
          {/* Progress bar overlay */}
          <div className="absolute top-0 left-0 w-full h-[4px]">
            <div 
              className="absolute top-0 right-0 h-[4px] bg-foreground/80 rounded-full transition-transform duration-1000 ease-out origin-right"
              style={{ width: '100%', transform: `scaleX(${isVisible ? scrollProgress : 0})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 