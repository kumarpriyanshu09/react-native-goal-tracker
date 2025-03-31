
import React, { useMemo } from 'react';
import { 
  Sun, 
  Moon,
  Settings // Added Settings icon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
// Removed unused Card import
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"; // Added Sheet components
import { DateSelector } from "@/components/DateSelector";
import { useTheme, ThemeColor } from '@/context/ThemeContext'; // Import useTheme and ThemeColor type
import { Label } from "@/components/ui/label"; // Import Label for section title

// Define available theme colors and their display properties
const themeOptions: { value: ThemeColor; label: string; colorClass: string }[] = [
  { value: 'purple', label: 'Purple', colorClass: 'bg-[#7C3AED]' }, // Example Tailwind purple-600
  { value: 'orange', label: 'Orange', colorClass: 'bg-[#F97316]' }, // Example Tailwind orange-500
  { value: 'blue',   label: 'Blue',   colorClass: 'bg-[#3B82F6]' }, // Example Tailwind blue-500
  { value: 'green',  label: 'Green',  colorClass: 'bg-[#10B981]' }, // Example Tailwind emerald-500
];

interface HeaderProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  activeViewData: { type: string; count: number };
  // Removed isDarkMode and toggleTheme from props
}

export function Header({ 
  selectedDate, 
  onDateSelect, 
  activeViewData, 
  // Removed isDarkMode and toggleTheme from parameters
}: HeaderProps) {
  const { isDarkMode, toggleTheme, themeColor, setThemeColor } = useTheme(); // Use theme context

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
          {/* Settings Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="mt-1 ml-2" // Added margin
              >
                <Settings size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>App Settings</SheetTitle>
                <SheetDescription>
                  Customize the look and feel of your app.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Theme Color</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {themeOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={themeColor === option.value ? 'default' : 'outline'}
                        onClick={() => setThemeColor(option.value)}
                        className="justify-start"
                      >
                        <span className={`w-4 h-4 rounded-full mr-2 ${option.colorClass}`}></span>
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Add other settings sections here if needed */}
              </div>
            </SheetContent>
          </Sheet>
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
