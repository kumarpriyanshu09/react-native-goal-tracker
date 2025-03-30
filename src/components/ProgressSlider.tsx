
import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressSliderProps {
  activity: string;
  emoji: string;
  color: string;
  current?: number;
  target?: number;
  unit?: string;
  autoIncrement?: boolean;
  incrementSpeed?: number;
  onProgressChange: (newProgress: number) => void;
}

export function ProgressSlider({
  activity,
  emoji,
  color,
  current = 0,
  target = 100,
  unit = "min",
  autoIncrement = false,
  incrementSpeed = 1000,
  onProgressChange
}: ProgressSliderProps) {
  const [sliderValue, setSliderValue] = useState(current);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  
  const isCompleted = sliderValue >= target;
  const percentage = Math.min(100, (sliderValue / target) * 100);

  // Update when props change
  useEffect(() => {
    if (!isDragging) {
      setSliderValue(current);
    }
  }, [current, isDragging]);

  // Handle auto-increment
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoIncrement && !isDragging && sliderValue < target) {
      intervalRef.current = window.setInterval(() => {
        setSliderValue(prev => {
          const newValue = Math.min(target, prev + 1);
          if (newValue !== prev) {
            onProgressChange(newValue);
          }
          if (newValue >= target && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return newValue;
        });
      }, incrementSpeed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoIncrement, isDragging, sliderValue, target, incrementSpeed, onProgressChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    setIsDragging(true);
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * target;
    const newValue = Math.max(0, Math.min(target, Math.round(pos)));
    
    setSliderValue(newValue);
    onProgressChange(newValue);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * target;
    const newValue = Math.max(0, Math.min(target, Math.round(pos)));
    
    setSliderValue(newValue);
    onProgressChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const formatProgress = () => {
    const roundedValue = Math.round(sliderValue);
    const roundedTarget = Math.round(target);

    if (unit === "min") {
      if (roundedTarget >= 60) {
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
        return `${formatTime(roundedValue)} / ${formatTime(roundedTarget)}`;
      }
      return `${roundedValue}${unit} / ${roundedTarget}${unit}`;
    }
    
    if (unit === "dots") return `${roundedValue}/${roundedTarget}`;
    
    if (unit === "km" || unit === "miles") 
      return `${sliderValue.toFixed(1)}${unit} / ${target.toFixed(1)}${unit}`;
    
    return `${roundedValue} / ${roundedTarget} ${unit}`;
  };

  return (
    <div 
      ref={sliderRef}
      className="relative h-14 rounded-xl overflow-hidden cursor-pointer transition-opacity"
      onMouseDown={handleMouseDown}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted"></div>
      
      {/* Progress */}
      <div 
        className="absolute inset-y-0 left-0 transition-all duration-300 ease-out"
        style={{ 
          width: `${percentage}%`, 
          backgroundColor: isCompleted ? '#34C759' : color 
        }}
      ></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-medium truncate">{activity}</span>
        </div>
        <div>
          {isCompleted ? (
            <Check size={18} className="text-white" />
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              {formatProgress()}
            </span>
          )}
        </div>
      </div>
      
      {/* Dots for "dots" unit */}
      {unit === "dots" && !isCompleted && (
        <div className="absolute bottom-2 right-4 flex space-x-1">
          {Array.from({ length: target }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                i < sliderValue ? "opacity-100" : "opacity-40"
              )}
              style={{ backgroundColor: i < sliderValue ? color : 'currentColor' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
