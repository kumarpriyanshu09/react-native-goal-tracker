
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
import { 
  Bookmark, 
  MoreHorizontal, 
  Image, 
  Mic, 
  MapPin,
  Tag,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AddJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<JournalEntry, 'id'>) => void;
}

export function AddJournalEntryModal({ isOpen, onClose, onAdd }: AddJournalEntryModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('neutral');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onAdd({
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
        mood,
        tags: tags.length > 0 ? tags : undefined
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setMood('neutral');
      setTags([]);
      onClose();
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
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
              <X className="h-6 w-6 text-muted-foreground" />
            </Button>
            
            <SheetTitle className="text-center text-lg font-medium">
              {formattedDate}
            </SheetTitle>
            
            <Button variant="default" size="sm" className="rounded-full" onClick={handleSubmit}>
              Save
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-medium border-none px-0 mb-2 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
            <Textarea
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none border-none px-0 min-h-[200px] focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
            
            {/* Tags Section */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-1">
                    {tag}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Add tags..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-8 text-sm border-none focus-visible:ring-0"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={addTag} 
                  className="text-primary"
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="border-t p-3 bg-muted/5 flex justify-between items-center">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Image className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Mic className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bookmark className="h-5 w-5 text-primary" />
              </Button>
            </div>
            
            {/* Mood selector */}
            <Tabs value={mood} onValueChange={(value) => setMood(value as JournalEntry['mood'])} className="border rounded-full p-1 bg-background">
              <TabsList className="grid grid-cols-5 w-full max-w-xs">
                <TabsTrigger value="happy" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full">
                  😊
                </TabsTrigger>
                <TabsTrigger value="productive" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full">
                  💪
                </TabsTrigger>
                <TabsTrigger value="neutral" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full">
                  😐
                </TabsTrigger>
                <TabsTrigger value="tired" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full">
                  😴
                </TabsTrigger>
                <TabsTrigger value="sad" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full">
                  😔
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
