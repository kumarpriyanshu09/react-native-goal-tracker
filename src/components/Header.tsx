
import React, { useMemo } from 'react';
import { 
  Sun, 
  Moon 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DateSelector } from "@/components/DateSelector";

interface HeaderProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  activeViewData: { type: string; count: number };
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function Header({ 
  selectedDate, 
  onDateSelect, 
  activeViewData, 
  isDarkMode, 
  toggleTheme 
}: HeaderProps) {
  const { dayName, dateString, yearString } = useMemo(() => ({
    dayName: selectedDate.toLocaleDateString('en-US', { weekday: 'long' }),
    dateString: selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    yearString: selectedDate.getFullYear().toString(),
  }), [selectedDate]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const statusText = useMemo(() => {
    const count = activeViewData.count;
    const type = activeViewData.type + (count === 1 ? '' : 's');
    return count > 0 ? `You have ${count} ${type.toLowerCase()} left.` : `All ${type.toLowerCase()} completed!`;
  }, [activeViewData]);

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40 pb-2">
      <div className="container px-4 pt-4">
        {/* Top Row */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">{dayName}</h1>
              <div className="w-2 h-2 rounded-full bg-primary ml-2 mt-1"></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {dateString}, {yearString}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme} 
            className="mt-1"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
        
        {/* Middle Row */}
        <div className="mb-4">
          <h2 className="text-lg font-medium">{greeting},</h2>
          <p className="text-sm text-muted-foreground">{statusText}</p>
        </div>
        
        {/* Date Selector */}
        <DateSelector selectedDate={selectedDate} onDateSelect={onDateSelect} />
      </div>
    </div>
  );
}
