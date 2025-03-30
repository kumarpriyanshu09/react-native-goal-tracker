
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Goal } from '@/types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: Omit<Goal, 'id'>) => void;
}

export function AddGoalModal({ isOpen, onClose, onAdd }: AddGoalModalProps) {
  const [text, setText] = useState('');
  const [hasProgress, setHasProgress] = useState(false);
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');
  const [autoIncrement, setAutoIncrement] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({
        text: text.trim(),
        isCompleted: false,
        hasProgress,
        ...(hasProgress && {
          current: 0,
          target: parseInt(target) || 0,
          unit: unit.trim() || undefined,
          autoIncrement
        }),
        category: ''
      });
      // Reset form
      setText('');
      setHasProgress(false);
      setTarget('');
      setUnit('');
      setAutoIncrement(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goal">Goal Description</Label>
              <Input
                id="goal"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter goal description"
                autoFocus
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasProgress" 
                checked={hasProgress}
                onCheckedChange={(checked) => setHasProgress(checked === true)}
              />
              <Label htmlFor="hasProgress">Has progress tracking</Label>
            </div>
            
            {hasProgress && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="target">Target Value</Label>
                  <Input
                    id="target"
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit (optional)</Label>
                  <Input
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. km, pages, glasses"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id="autoIncrement" 
                    checked={autoIncrement}
                    onCheckedChange={(checked) => setAutoIncrement(checked === true)}
                  />
                  <Label htmlFor="autoIncrement">Auto increment progress</Label>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!text.trim()}>
              Add Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
