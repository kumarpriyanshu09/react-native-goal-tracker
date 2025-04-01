
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface JournalEntryContentProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  tags: string[];
  removeTag: (tag: string) => void;
}

export function JournalEntryContent({ 
  title, 
  setTitle, 
  content, 
  setContent, 
  tags, 
  removeTag 
}: JournalEntryContentProps) {
  return (
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
  );
}
