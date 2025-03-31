import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/context/ThemeContext';

// Define the props type
interface ProgressSliderProps {
  activity: string;
  emoji?: string;
  color: string;
  current?: number;
  target?: number;
  unit?: string;
  autoIncrement?: boolean;
  incrementSpeed?: number;
  onProgressChange?: (newProgress: number) => void;
}

// Draggable Progress Slider Component
export const ProgressSlider: React.FC<ProgressSliderProps> = ({
  activity,
  emoji,
  color,
  current = 0,
  target = 100,
  unit = "min",
  autoIncrement = false,
  incrementSpeed = 1000,
  onProgressChange
}) => {
  const [progress, setProgress] = useState(current);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with external 'current' prop if not dragging
  useEffect(() => {
    if (!isDragging) {
      setProgress(current);
    }
  }, [current, isDragging]);

  // Auto-increment logic (stops during drag)
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (autoIncrement && !isDragging && progress < target) {
      intervalRef.current = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= target) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = null;
              return prevProgress;
          }
          const newProgress = prevProgress + 1;
          if (onProgressChange) onProgressChange(newProgress);
          if (newProgress === target && intervalRef.current) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = null;
          }
          return newProgress;
        });
      }, incrementSpeed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoIncrement, progress, target, incrementSpeed, onProgressChange, isDragging]);

  // Calculations & Formatting
  const percentage = Math.min(100, Math.max(0, Math.round((progress / target) * 100)));

  const formatProgress = useCallback((value?: number) => {
    const valToFormat = value !== undefined ? value : progress;
    if (unit === "min") {
      if (target >= 60) {
        const formatTime = (totalMinutes: number) => {
          if (totalMinutes <= 0) return '0m';
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          let text = '';
          if (hours > 0) text += `${hours}h`;
          if (minutes > 0) text += `${hours > 0 ? ' ' : ''}${minutes}m`;
          if (hours > 0 && minutes === 0) text = `${hours}h`;
          return text || '0m';
        };
        return `${formatTime(valToFormat)} / ${formatTime(target)}`;
      }
      return `${valToFormat}${unit} / ${target}${unit}`;
    }
    if (unit === "dots") return `${valToFormat}/${target}`;
    return `${valToFormat} / ${target} ${unit || ''}`.trim();
  }, [progress, target, unit]);

  // Drag Handling Logic - Define in order of dependency
  const updateProgressFromEvent = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newProgress = Math.round(position * target);
    setProgress(prevProgress => {
        if (newProgress !== prevProgress) {
            if (onProgressChange) onProgressChange(newProgress);
            return newProgress;
        }
        return prevProgress;
    });
  }, [target, onProgressChange]);

  // Define handleDragMove after updateProgressFromEvent
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
     if (isDragging) {
        if ('touches' in e) e.preventDefault();
        updateProgressFromEvent(e as unknown as React.MouseEvent | React.TouchEvent);
     }
  }, [isDragging, updateProgressFromEvent]);

  // Define handleDragEnd after handleDragMove
  const handleDragEnd = useCallback(() => {
    if (isDragging) {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
    }
  }, [isDragging, handleDragMove]);

  // Define handleDragStart last, as it depends on the others
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    updateProgressFromEvent(e);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
  }, [updateProgressFromEvent, handleDragMove, handleDragEnd]);

  // Component Rendering (with separate background and content layers)
  return (
    <div
      className="relative mb-4 h-16 rounded-2xl overflow-hidden shadow-lg select-none cursor-grab active:cursor-grabbing"
      ref={sliderRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={target}
      aria-valuenow={progress}
      aria-label={`${activity} progress`}
      style={{
        touchAction: 'pan-y',
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div
          className="h-full"
          style={{
            backgroundColor: color,
            width: `${percentage}%`,
            transition: isDragging ? 'none' : 'width 0.2s ease-out',
          }}
        />
        <div
          className="h-full flex-grow bg-muted"
        />
      </div>

      {/* Content Layer (Text Overlay) */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        {/* Left Content */}
        <div className="flex items-center overflow-hidden whitespace-nowrap mr-2">
          {emoji && <span className="mr-2 text-xl flex-shrink-0" aria-hidden="true">{emoji}</span>}
          <span className="text-lg sm:text-xl font-medium truncate text-foreground">
            {activity}
          </span>
        </div>
        {/* Right Content */}
        <div className="overflow-hidden whitespace-nowrap">
          <span className="text-base sm:text-lg font-medium text-muted-foreground truncate">
            {formatProgress()}
          </span>
        </div>
      </div>

      {/* Optional Dots Indicator */}
      {unit === "dots" && (
        <div className="absolute bottom-2 right-4 flex space-x-1 pointer-events-none">
          {Array.from({ length: target }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i < progress ? '' : 'bg-muted'}`}
              style={{ backgroundColor: i < progress ? color : undefined }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Add this line to maintain compatibility with both named and default imports
export default ProgressSlider;
