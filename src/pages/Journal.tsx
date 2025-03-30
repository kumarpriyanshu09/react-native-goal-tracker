
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { AddItemButton } from '@/components/AddItemButton';
import { AddJournalEntryModal } from '@/components/AddJournalEntryModal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { JournalEntry } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const Journal = () => {
  const { toast } = useToast();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme ? savedTheme === 'dark' : prefersDark;
    }
    return false;
  });

  // Date and modal state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: 'journal-1',
      date: new Date().toISOString(),
      title: 'First day of journaling',
      content: 'Started using this new app to track my tasks, goals, and thoughts. So far it seems promising!',
      mood: 'happy'
    },
    {
      id: 'journal-2',
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      title: 'Productivity challenges',
      content: 'Struggled to focus today. Need to work on minimizing distractions and creating a better work environment.',
      mood: 'tired'
    }
  ]);

  // Theme toggling
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  // Update document theme when state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Date selection
  const handleDateSelect = useCallback((date: Date) => {
    date.setHours(0, 0, 0, 0);
    setSelectedDate(date);
    // In a real app, we would fetch entries for the selected date here
  }, []);

  // Filter entries for the selected date
  const filteredEntries = useMemo(() => {
    const selectedDateStr = selectedDate.toDateString();
    return journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.toDateString() === selectedDateStr;
    });
  }, [journalEntries, selectedDate]);

  // Add new journal entry
  const handleAddEntry = useCallback((entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: uuidv4()
    };
    
    setJournalEntries(prev => [newEntry, ...prev]);
    
    toast({
      title: "Journal entry added",
      description: entry.title,
      duration: 2000,
    });
  }, [toast]);

  // Get mood emoji
  const getMoodEmoji = useCallback((mood?: JournalEntry['mood']) => {
    switch(mood) {
      case 'happy': return '😊';
      case 'productive': return '💪';
      case 'neutral': return '😐';
      case 'tired': return '😴';
      case 'sad': return '😔';
      default: return '';
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        activeViewData={{
          type: 'Journal',
          count: filteredEntries.length
        }}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <TabNavigation 
        activeTab="Journal"
        onChange={() => {}} // This is handled in the component now
      />
      
      <div className="container px-4 py-4 pb-32">
        {filteredEntries.length > 0 ? (
          <div className="space-y-4 animate-fade-in">
            {filteredEntries.map(entry => (
              <Card key={entry.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{entry.title}</CardTitle>
                    {entry.mood && (
                      <span className="text-2xl" title={entry.mood}>
                        {getMoodEmoji(entry.mood)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(entry.date), 'h:mm a')}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{entry.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <p>No journal entries for this day</p>
            <p className="mt-2">Click the + button to add one</p>
          </div>
        )}
      </div>

      <AddItemButton onClick={() => setIsAddModalOpen(true)} />
      
      <AddJournalEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEntry}
      />
    </div>
  );
};

export default Journal;
