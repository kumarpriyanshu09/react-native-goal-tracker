
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

  // Updated drag handling logic - Combined into a single handler for immediate response
  const handleDrag = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!sliderRef.current) return;
    
    // Convert MouseEvent or TouchEvent to clientX
    let clientX: number;
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling when dragging
      clientX = e.touches[0].clientX;
    } else {
      clientX = 'clientX' in e ? e.clientX : 0;
    }
    
    const rect = sliderRef.current.getBoundingClientRect();
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

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', handleDragEnd);
  }, [handleDrag]);

  // Handle drag start - Immediately update progress and set up listeners
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    
    // Immediately update progress on first touch
    handleDrag(e);
    
    // Add event listeners for continued dragging
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
  }, [handleDrag, handleDragEnd]);

  // Component Rendering with improved design
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
      {/* Colored Progress Section - Full width background with colored progress */}
      <div 
        className="absolute inset-0 h-full"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      />
      
      {/* Progress bar that stretches from left */}
      <div
        className="absolute inset-0 h-full"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
          transition: isDragging ? 'none' : 'width 0.2s ease-out',
        }}
      />
      
      {/* Content layer - fixed position regardless of slider */}
      <div className="absolute inset-0 flex items-center px-4 z-10">
        <div className="flex justify-between items-center w-full">
          {/* Text on the left */}
          {text && (
            <div className="text-white font-medium">
              {text}
            </div>
          )}
          
          {/* Progress counter on the right */}
          <div className="text-white font-medium ml-auto">
            {formatProgress()}
          </div>
        </div>
      </div>
      
      {/* Progress Dots for Visual Feedback */}
      <div className="absolute bottom-2 right-2 flex space-x-1 z-10">
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
