
import React, { useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateSelect }: DateSelectorProps) {
  const dates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDayOfWeek = today.getDay();
    const diff = today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  }, []);

  const getDayName = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3).toUpperCase();
  }, []);
  
  const isSelected = useCallback((date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  }, [selectedDate]);
  
  const isToday = useCallback((date: Date) => {
    return date.toDateString() === new Date().toDateString();
  }, []);

  return (
    <div className="flex justify-between bg-card rounded-lg p-2 animate-fade-in">
      {dates.map((date) => {
        const selected = isSelected(date);
        const today = isToday(date);
        
        return (
          <Button
            key={date.toISOString()}
            onClick={() => onDateSelect(date)}
            variant={selected ? "default" : today ? "outline" : "ghost"}
            className={`flex flex-col items-center w-[3rem] h-[4rem] p-1 ${
              selected ? "bg-primary" : ""
            }`}
          >
            <span className={`text-xs font-medium ${selected ? "text-primary-foreground" : "text-muted-foreground"}`}>
              {getDayName(date)}
            </span>
            <span className={`text-lg font-semibold ${selected ? "text-primary-foreground" : ""}`}>
              {date.getDate()}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
