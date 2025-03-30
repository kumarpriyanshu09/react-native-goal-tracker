
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JournalEntry } from '@/types';

interface AddJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<JournalEntry, 'id'>) => void;
}

export function AddJournalEntryModal({ isOpen, onClose, onAdd }: AddJournalEntryModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('neutral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter entry title"
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts..."
                rows={5}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Mood</Label>
              <Tabs value={mood} onValueChange={(value) => setMood(value as JournalEntry['mood'])}>
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="happy">😊 Happy</TabsTrigger>
                  <TabsTrigger value="productive">💪 Productive</TabsTrigger>
                  <TabsTrigger value="neutral">😐 Neutral</TabsTrigger>
                  <TabsTrigger value="tired">😴 Tired</TabsTrigger>
                  <TabsTrigger value="sad">😔 Sad</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim()}>
              Add Entry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
