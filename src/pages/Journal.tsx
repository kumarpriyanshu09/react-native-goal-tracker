
import React, { useState, useCallback, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { AddItemButton } from '@/components/AddItemButton';
import { AddJournalEntryModal } from '@/components/AddJournalEntryModal';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isYesterday } from 'date-fns';
import { JournalEntry } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@/context/ThemeContext';
import { 
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Bookmark,
  BookOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Update JournalEntry type to include tags
declare module '@/types' {
  interface JournalEntry {
    tags?: string[];
  }
}

const Journal = () => {
  const { toast } = useToast();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
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
      mood: 'happy',
      tags: ['productivity', 'new start']
    },
    {
      id: 'journal-2',
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      title: 'Productivity challenges',
      content: 'Struggled to focus today. Need to work on minimizing distractions and creating a better work environment.',
      mood: 'tired',
      tags: ['productivity', 'focus']
    }
  ]);

  // Date selection
  const handleDateSelect = useCallback((date: Date) => {
    date.setHours(0, 0, 0, 0);
    setSelectedDate(date);
    // In a real app, we would fetch entries for the selected date here
  }, []);

  // Filter entries based on search query and selected date
  const filteredEntries = useMemo(() => {
    const selectedDateStr = selectedDate.toDateString();
    let entries = journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.toDateString() === selectedDateStr;
    });
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      entries = entries.filter(entry => 
        entry.title.toLowerCase().includes(query) || 
        entry.content.toLowerCase().includes(query) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return entries;
  }, [journalEntries, selectedDate, searchQuery]);

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

  // Delete journal entry
  const handleDeleteEntry = useCallback((id: string) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
    
    toast({
      title: "Journal entry deleted",
      description: "Your entry has been removed",
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

  // Format date for display
  const formatEntryDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, yyyy \'at\' h:mm a');
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
      />
      
      <TabNavigation 
        activeTab="Journal"
        onChange={() => {}}
      />
      
      {/* Search and filter bar */}
      <div className="sticky top-[9.2rem] z-10 bg-background/80 backdrop-blur-md px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search journal entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="flex gap-1 h-9">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex gap-1 h-9">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Date</span>
          </Button>
        </div>
      </div>
      
      <div className="container px-4 py-4 pb-32">
        {filteredEntries.length > 0 ? (
          <div className="space-y-4 animate-fade-in">
            {filteredEntries.map(entry => (
              <Card key={entry.id} className="overflow-hidden hover:shadow-md transition-shadow border border-border/50">
                <CardHeader className="pb-3 relative">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-semibold text-foreground">{entry.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatEntryDate(entry.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.mood && (
                        <span className="text-2xl" title={entry.mood}>
                          {getMoodEmoji(entry.mood)}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Bookmark className="h-4 w-4 mr-2" />
                            <span>Bookmark</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span>Open in full view</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-foreground/90">{entry.content}</p>
                </CardContent>
                {entry.tags && entry.tags.length > 0 && (
                  <CardFooter className="pt-0 pb-4 flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="font-normal text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <div className="inline-flex rounded-full p-4 bg-muted/30 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <p className="text-lg font-medium">No journal entries for this day</p>
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
