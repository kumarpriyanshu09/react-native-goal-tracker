
import React from 'react';
import { SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface JournalEntryHeaderProps {
  onSave: () => void;
}

export function JournalEntryHeader({ onSave }: JournalEntryHeaderProps) {
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMM d');

  return (
    <div className="p-4 flex items-center justify-between border-b">
      <div className="w-8">
        {/* Empty div for spacing */}
      </div>
      
      <SheetTitle className="text-center text-lg font-medium">
        {formattedDate}
      </SheetTitle>
      
      <Button variant="primary" size="sm" className="rounded-full px-5" onClick={onSave}>
        Save
      </Button>
    </div>
  );
}
