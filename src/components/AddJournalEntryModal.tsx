
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
  Image, 
  Mic, 
  MapPin,
  Tag,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
          {/* Header - Remove the X on the left and fix spacing */}
          <div className="p-4 flex items-center justify-between border-b">
            <div className="w-8">
              {/* Empty div for spacing */}
            </div>
            
            <SheetTitle className="text-center text-lg font-medium">
              {formattedDate}
            </SheetTitle>
            
            <Button variant="primary" size="sm" className="rounded-full px-5" onClick={handleSubmit}>
              Save
            </Button>
          </div>
          
          {/* Content - Improved input styling with better contrast */}
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-accent/20 p-3 rounded-lg mb-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-medium border-none px-0 mb-2 focus-visible:ring-0 placeholder:text-muted-foreground/80 bg-transparent"
              />
            </div>
            
            <div className="bg-accent/20 p-3 rounded-lg">
              <Textarea
                placeholder="Start writing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 resize-none border-none px-0 min-h-[250px] focus-visible:ring-0 placeholder:text-muted-foreground/80 bg-transparent"
              />
            </div>
            
            {/* Display tags in content area */}
            {tags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-1 bg-primary/15 hover:bg-primary/25 transition-colors">
                      {tag}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Bar - Move tag input to the footer */}
          <div className="border-t bg-muted/10">
            {/* Tag input moved to the footer */}
            <div className="px-3 pt-3 pb-1 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <Input
                  placeholder="Add tags..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-8 text-sm border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={addTag} 
                  className="text-primary hover:bg-primary/10 transition-colors"
                  disabled={!newTag.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
            
            {/* Tools and improved mood selector */}
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
              <Tabs value={mood} onValueChange={(value) => setMood(value as JournalEntry['mood'])} className="border rounded-full p-1 bg-background">
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
          </div>
        </div>
        
        {/* We're customizing the modal and completely removing the default close button */}
        <style jsx global>{`
          [data-radix-sheet-content] [data-radix-sheet-close] {
            display: none !important;
          }
        `}</style>
      </SheetContent>
    </Sheet>
  );
}
