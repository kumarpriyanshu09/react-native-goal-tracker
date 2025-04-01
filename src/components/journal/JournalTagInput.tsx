
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

interface JournalTagInputProps {
  newTag: string;
  setNewTag: (tag: string) => void;
  addTag: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export function JournalTagInput({ 
  newTag, 
  setNewTag, 
  addTag, 
  handleKeyDown 
}: JournalTagInputProps) {
  return (
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
  );
}
