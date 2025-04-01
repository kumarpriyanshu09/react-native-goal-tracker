
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JournalEntry } from '@/types';
import { 
  Bookmark, 
  Image, 
  Mic, 
  MapPin 
} from 'lucide-react';

interface JournalToolbarProps {
  mood: JournalEntry['mood'];
  setMood: (mood: JournalEntry['mood']) => void;
}

export function JournalToolbar({ mood, setMood }: JournalToolbarProps) {
  return (
    <div className="p-3 flex justify-between items-center">
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors">
          <Image className="h-5 w-5 text-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors">
          <Mic className="h-5 w-5 text-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors">
          <MapPin className="h-5 w-5 text-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors">
          <Bookmark className="h-5 w-5 text-primary" />
        </Button>
      </div>
      
      {/* Enhanced mood selector with better visual feedback */}
      <Tabs 
        value={mood} 
        onValueChange={(value) => setMood(value as JournalEntry['mood'])} 
        className="border rounded-full p-1 bg-background"
      >
        <TabsList className="grid grid-cols-5 w-full max-w-xs bg-transparent">
          <TabsTrigger 
            value="happy" 
            className="data-[state=active]:bg-primary/25 data-[state=active]:text-primary hover:bg-accent/40 transition-colors rounded-full text-xl px-1"
          >
            😊
          </TabsTrigger>
          <TabsTrigger 
            value="productive" 
            className="data-[state=active]:bg-primary/25 data-[state=active]:text-primary hover:bg-accent/40 transition-colors rounded-full text-xl px-1"
          >
            💪
          </TabsTrigger>
          <TabsTrigger 
            value="neutral" 
            className="data-[state=active]:bg-primary/25 data-[state=active]:text-primary hover:bg-accent/40 transition-colors rounded-full text-xl px-1"
          >
            😐
          </TabsTrigger>
          <TabsTrigger 
            value="tired" 
            className="data-[state=active]:bg-primary/25 data-[state=active]:text-primary hover:bg-accent/40 transition-colors rounded-full text-xl px-1"
          >
            😴
          </TabsTrigger>
          <TabsTrigger 
            value="sad" 
            className="data-[state=active]:bg-primary/25 data-[state=active]:text-primary hover:bg-accent/40 transition-colors rounded-full text-xl px-1"
          >
            😔
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
