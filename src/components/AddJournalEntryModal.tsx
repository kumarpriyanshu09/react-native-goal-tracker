
import React, { useState } from 'react';
import { 
  Sheet,
  SheetContent
} from '@/components/ui/sheet';
import { JournalEntry } from '@/types';
import { JournalEntryHeader } from './journal/JournalEntryHeader';
import { JournalEntryContent } from './journal/JournalEntryContent';
import { JournalTagInput } from './journal/JournalTagInput';
import { JournalToolbar } from './journal/JournalToolbar';
import { JournalModalStyles } from './journal/JournalModalStyles';

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[100dvh] p-0 border-0 rounded-t-[20px] bg-background overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header component */}
          <JournalEntryHeader onSave={handleSubmit} />
          
          {/* Content component with title, content and tags display */}
          <JournalEntryContent
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            tags={tags}
            removeTag={removeTag}
          />
          
          {/* Action Bar */}
          <div className="border-t bg-muted/10">
            {/* Tag input component */}
            <JournalTagInput
              newTag={newTag}
              setNewTag={setNewTag}
              addTag={addTag}
              handleKeyDown={handleKeyDown}
            />
            
            {/* Tools and mood selector */}
            <JournalToolbar 
              mood={mood}
              setMood={setMood}
            />
          </div>
        </div>
        
        {/* Custom style to hide default close button */}
        <JournalModalStyles />
      </SheetContent>
    </Sheet>
  );
}
