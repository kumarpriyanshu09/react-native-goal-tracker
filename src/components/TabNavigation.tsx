
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from 'react-router-dom';

type TabType = 'Tasks' | 'Goals' | 'Journal';

interface TabNavigationProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onChange }: TabNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (tab: TabType) => {
    if (tab === 'Journal') {
      // Navigate to journal page
      navigate('/journal');
    } else if (location.pathname === '/journal') {
      // Navigate back to home page from journal with the correct tab
      navigate('/');
      onChange(tab);
    } else {
      // Just change the tab
      onChange(tab);
    }
  };

  return (
    <div className="flex border-b border-border justify-center">
      <Button
        variant="ghost"
        onClick={() => handleTabChange('Tasks')}
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
        onClick={() => handleTabChange('Goals')}
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

      <Button
        variant="ghost"
        onClick={() => handleTabChange('Journal')}
        className={cn(
          "flex-1 rounded-none py-2.5 text-base font-medium relative",
          activeTab === 'Journal' 
            ? "text-primary" 
            : "text-muted-foreground"
        )}
      >
        Journal
        {activeTab === 'Journal' && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
        )}
      </Button>
    </div>
  );
}
