
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

// Improved Progress Slider Component with better gesture handling
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
  
  // Track touch/mouse positions
  const touchRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    moveDetected: false,
    activeTracking: false
  });

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

  // Function to update progress based on pointer position
  const updateProgressFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    
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

  // Simpler touch and mouse handlers that only care about horizontal movement
  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !touchRef.current.activeTracking) return;
    
    e.preventDefault(); // Prevent scrolling and other touch actions
    
    // Extract client coordinates
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // If this is the first significant move, determine if it's horizontal enough
    if (!touchRef.current.moveDetected) {
      const deltaX = Math.abs(clientX - touchRef.current.startX);
      const deltaY = Math.abs(clientY - touchRef.current.startY);
      
      // If we detect significant movement
      if (deltaX > 5 || deltaY > 5) {
        touchRef.current.moveDetected = true;
        
        // If movement is more vertical than horizontal, cancel the drag
        if (deltaY > deltaX * 1.5) {
          handlePointerEnd();
          return;
        }
      }
    }
    
    // Update the progress based on the X position
    updateProgressFromPosition(clientX);
    touchRef.current.lastX = clientX;
  }, [isDragging, updateProgressFromPosition]);

  // Clean up event handlers when pointer is released
  const handlePointerEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    touchRef.current.activeTracking = false;
    touchRef.current.moveDetected = false;
    
    document.removeEventListener('mousemove', handlePointerMove);
    document.removeEventListener('mouseup', handlePointerEnd);
    document.removeEventListener('touchmove', handlePointerMove);
    document.removeEventListener('touchend', handlePointerEnd);
    document.removeEventListener('touchcancel', handlePointerEnd);
  }, [isDragging, handlePointerMove]);

  // Initialize drag on pointer down
  const handlePointerStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default browser handling
    e.preventDefault();
    
    // Get coordinates
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Store starting coordinates
    touchRef.current = {
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      moveDetected: false,
      activeTracking: true
    };
    
    // Update progress immediately to respond to taps/clicks
    updateProgressFromPosition(clientX);
    
    // Set dragging state
    setIsDragging(true);
    
    // Add event listeners for movement and release
    document.addEventListener('mousemove', handlePointerMove, { passive: false });
    document.addEventListener('mouseup', handlePointerEnd);
    document.addEventListener('touchmove', handlePointerMove, { passive: false });
    document.addEventListener('touchend', handlePointerEnd);
    document.addEventListener('touchcancel', handlePointerEnd);
  }, [handlePointerMove, handlePointerEnd, updateProgressFromPosition]);

  // Component Rendering with improved design
  return (
    <div
      className="relative h-14 w-full rounded-xl overflow-hidden shadow-sm select-none mx-1 flex"
      ref={sliderRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={target}
      aria-valuenow={progress}
      aria-label={`Progress slider for ${text || 'goal'}`}
      style={{ touchAction: 'none' }} // Disable browser touch actions completely
      onMouseDown={handlePointerStart}
      onTouchStart={handlePointerStart}
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
