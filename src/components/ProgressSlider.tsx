
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define the props type
interface ProgressSliderProps {
  current?: number;
  target?: number;
  unit?: string;
  color?: string;
  onProgressChange?: (newProgress: number) => void;
}

// Simplified Progress Slider Component
export const ProgressSlider: React.FC<ProgressSliderProps> = ({
  current = 0,
  target = 100,
  unit = "min",
  color = "#9b87f5",
  onProgressChange
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

  // Component Rendering (simplified design)
  return (
    <div
      className="relative h-16 w-full rounded-xl overflow-hidden shadow-md select-none cursor-grab active:cursor-grabbing mb-2 mx-1"
      ref={sliderRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={target}
      aria-valuenow={progress}
      aria-label={`Progress slider`}
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

      {/* Content Layer (Text Overlay) - Simple progress display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-lg font-medium text-foreground bg-black/10 px-3 py-1 rounded-full">
          {formatProgress()}
        </span>
      </div>
    </div>
  );
};

// Add this line to maintain compatibility with both named and default imports
export default ProgressSlider;
