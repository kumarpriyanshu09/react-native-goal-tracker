
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define the props type
interface ProgressSliderProps {
  current?: number;
  target?: number;
  unit?: string;
  color?: string;
  onProgressChange?: (newProgress: number) => void;
  text?: string;
}

// Simplified Progress Slider Component
export const ProgressSlider: React.FC<ProgressSliderProps> = ({
  current = 0,
  target = 100,
  unit = "min",
  color = "#9b87f5",
  onProgressChange,
  text
}) => {
  const [progress, setProgress] = useState(current);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Sync with external 'current' prop if not dragging
  useEffect(() => {
    if (!isDragging) {
      setProgress(current);
    }
  }, [current, isDragging]);

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
        return `${formatTime(valToFormat)}/${formatTime(target)}`;
      }
      return `${valToFormat}/${target}${unit}`;
    }
    if (unit === "dots") return `${valToFormat}/${target}`;
    return `${valToFormat}/${target} ${unit || ''}`.trim();
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

  // Component Rendering with new design inspired by the reference image
  return (
    <div
      className="relative h-14 w-full rounded-xl overflow-hidden shadow-sm select-none cursor-grab active:cursor-grabbing mx-1 flex"
      ref={sliderRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={target}
      aria-valuenow={progress}
      aria-label={`Progress slider for ${text || 'goal'}`}
      style={{
        touchAction: 'pan-y',
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {/* Colored Progress Section */}
      <div
        className="h-full flex items-center pl-4"
        style={{
          backgroundColor: color,
          width: `${percentage}%`,
          transition: isDragging ? 'none' : 'width 0.2s ease-out',
        }}
      >
        {text && (
          <div className="flex items-center space-x-2 text-white font-medium">
            {text}
          </div>
        )}
      </div>
      
      {/* Darker Background Section */}
      <div
        className="h-full flex-grow flex items-center justify-end pr-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <span className="text-white font-medium">
          {formatProgress()}
        </span>
      </div>
      
      {/* Progress Dots for Visual Feedback */}
      <div className="absolute bottom-2 right-2 flex space-x-1">
        {Array(Math.min(6, target)).fill(0).map((_, i) => (
          <div 
            key={i} 
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: i < percentage / (100 / Math.min(6, target)) 
                ? 'white' 
                : 'rgba(255, 255, 255, 0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Add this line to maintain compatibility with both named and default imports
export default ProgressSlider;
