
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddItemButtonProps {
  onClick: () => void;
}

export function AddItemButton({ onClick }: AddItemButtonProps) {
  return (
    <Button
      className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
