
import React, { useState } from 'react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JournalEntry } from '@/types';
import { format } from 'date-fns';
import { Bookmark, MoreHorizontal } from 'lucide-react';

interface AddJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<JournalEntry, 'id'>) => void;
}

export function AddJournalEntryModal({ isOpen, onClose, onAdd }: AddJournalEntryModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('neutral');

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onAdd({
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
        mood
      });
      // Reset form
      setTitle('');
      setContent('');
      setMood('neutral');
      onClose();
    }
  };

  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMM d');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[100dvh] p-0 border-0 rounded-t-[20px] bg-background overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Bookmark className="h-6 w-6 text-primary" />
            </Button>
            
            <SheetTitle className="text-center text-lg font-medium">
              {formattedDate}
            </SheetTitle>
            
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-6 w-6" />
              </Button>
              <Button variant="ghost" className="text-primary font-medium" onClick={handleSubmit}>
                Done
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl border-none px-0 mb-2 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
            <Textarea
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none border-none px-0 min-h-[200px] focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
          </div>
          
          {/* Footer with mood selector */}
          <div className="border-t p-2 bg-muted/10">
            <div className="flex justify-center items-center">
              <Tabs value={mood} onValueChange={(value) => setMood(value as JournalEntry['mood'])}>
                <TabsList className="grid grid-cols-5 w-full max-w-md">
                  <TabsTrigger value="happy" className="data-[state=active]:bg-transparent data-[state=active]:text-primary">
                    😊
                  </TabsTrigger>
                  <TabsTrigger value="productive" className="data-[state=active]:bg-transparent data-[state=active]:text-primary">
                    💪
                  </TabsTrigger>
                  <TabsTrigger value="neutral" className="data-[state=active]:bg-transparent data-[state=active]:text-primary">
                    😐
                  </TabsTrigger>
                  <TabsTrigger value="tired" className="data-[state=active]:bg-transparent data-[state=active]:text-primary">
                    😴
                  </TabsTrigger>
                  <TabsTrigger value="sad" className="data-[state=active]:bg-transparent data-[state=active]:text-primary">
                    😔
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
