
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  activeTab: 'Tasks' | 'Goals';
  onChange: (tab: 'Tasks' | 'Goals') => void;
}

export function TabNavigation({ activeTab, onChange }: TabNavigationProps) {
  return (
    <div className="flex border-b border-border justify-center">
      <Button
        variant="ghost"
        onClick={() => onChange('Tasks')}
        className={cn(
          "flex-1 rounded-none py-2.5 text-base font-medium relative",
          activeTab === 'Tasks' 
            ? "text-primary" 
            : "text-muted-foreground"
        )}
      >
        Tasks
        {activeTab === 'Tasks' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
        )}
      </Button>
      
      <Button
        variant="ghost"
        onClick={() => onChange('Goals')}
        className={cn(
          "flex-1 rounded-none py-2.5 text-base font-medium relative",
          activeTab === 'Goals' 
            ? "text-primary" 
            : "text-muted-foreground"
        )}
      >
        Goals
        {activeTab === 'Goals' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
        )}
      </Button>
    </div>
  );
}
