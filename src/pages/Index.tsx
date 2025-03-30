
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Header } from '@/components/Header';
import { TabNavigation } from '@/components/TabNavigation';
import { TodoItem } from '@/components/TodoItem';
import { GoalItem } from '@/components/GoalItem';
import { Todo, Goal } from '@/types';

const Index = () => {
  const { toast } = useToast();
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme ? savedTheme === 'dark' : prefersDark;
    }
    return false;
  });

  // Date and tab state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Goals'>('Tasks');

  // Sample data
  const [todoItems, setTodoItems] = useState<Todo[]>([
    { id: 'todo-1', text: 'Plan day & Prioritize tasks', isCompleted: false, time: '9:00 AM' },
    { id: 'todo-2', text: 'Morning workout', isCompleted: false, time: null },
    { id: 'todo-3', text: 'Team meeting', isCompleted: true, time: '11:00 AM' },
    { id: 'todo-4', text: 'Write daily journal', isCompleted: false, time: '3:00 PM' },
    { id: 'todo-5', text: 'Study NLP concepts', isCompleted: false, time: '5:00 PM' },
  ]);

  const [goalItems, setGoalItems] = useState<Goal[]>([
    { 
      id: 'goal-1', 
      text: 'Run 5 km', 
      isCompleted: false, 
      hasProgress: true, 
      current: 1.2, 
      target: 5, 
      unit: 'km', 
      autoIncrement: false 
    },
    { 
      id: 'goal-2', 
      text: 'Read 30 pages', 
      isCompleted: false, 
      hasProgress: true, 
      current: 12, 
      target: 30, 
      unit: 'pages', 
      autoIncrement: false 
    },
    { 
      id: 'goal-3', 
      text: 'Meditate 15 min daily', 
      isCompleted: false, 
      hasProgress: true, 
      current: 5, 
      target: 15, 
      unit: 'min', 
      autoIncrement: true 
    },
    { 
      id: 'goal-4', 
      text: 'Drink 8 glasses of water', 
      isCompleted: false, 
      hasProgress: true, 
      current: 3, 
      target: 8, 
      unit: 'glass', 
      autoIncrement: false 
    },
    { 
      id: 'goal-5', 
      text: 'Complete coding challenge', 
      isCompleted: false, 
      hasProgress: false 
    }
  ]);

  // Theme toggling
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  // Update document theme when state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Date selection
  const handleDateSelect = useCallback((date: Date) => {
    date.setHours(0, 0, 0, 0);
    setSelectedDate(date);
    // In a real app, we would fetch data for the selected date here
  }, []);

  // Toggle completion status
  const handleToggleComplete = useCallback((id: string) => {
    if (activeTab === 'Tasks') {
      setTodoItems(items => 
        items.map(item => 
          item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
      
      const item = todoItems.find(item => item.id === id);
      if (item) {
        toast({
          title: item.isCompleted ? "Task marked incomplete" : "Task completed!",
          description: item.text,
          duration: 2000,
        });
      }
    } else {
      setGoalItems(items => 
        items.map(item => 
          item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        )
      );
      
      const item = goalItems.find(item => item.id === id);
      if (item) {
        toast({
          title: item.isCompleted ? "Goal marked incomplete" : "Goal completed!",
          description: item.text,
          duration: 2000,
        });
      }
    }
  }, [activeTab, todoItems, goalItems, toast]);

  // Update goal progress
  const handleGoalProgressChange = useCallback((id: string, newProgress: number) => {
    setGoalItems(items =>
      items.map(item => {
        if (item.id === id && item.hasProgress) {
          const updatedProgress = Math.min(item.target || 0, Math.max(0, newProgress));
          const isNowCompleted = updatedProgress >= (item.target || 0);
          
          // Show toast if completed through progress
          if (isNowCompleted && !item.isCompleted) {
            toast({
              title: "Goal completed!",
              description: item.text,
              duration: 2000,
            });
          }
          
          return { 
            ...item, 
            current: updatedProgress, 
            isCompleted: isNowCompleted 
          };
        }
        return item;
      })
    );
  }, [toast]);

  // Toggle auto-increment
  const toggleAutoIncrement = useCallback((id: string) => {
    setGoalItems(items =>
      items.map(item =>
        item.id === id ? { ...item, autoIncrement: !item.autoIncrement } : item
      )
    );
    
    const item = goalItems.find(item => item.id === id);
    if (item) {
      toast({
        title: `Auto-progress ${item.autoIncrement ? 'disabled' : 'enabled'}`,
        description: item.text,
        duration: 2000,
      });
    }
  }, [goalItems, toast]);

  // Sort items: incomplete first, then by time or text
  const sortItems = useCallback(<T extends Todo | Goal>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      
      if ('time' in a && 'time' in b && a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      
      return a.text.localeCompare(b.text);
    });
  }, []);

  const sortedTodos = useMemo(() => sortItems(todoItems), [todoItems, sortItems]);
  const sortedGoals = useMemo(() => sortItems(goalItems), [goalItems, sortItems]);

  // Data for the header
  const activeViewData = useMemo(() => ({
    type: activeTab,
    count: (activeTab === 'Tasks' ? todoItems : goalItems).filter(item => !item.isCompleted).length,
  }), [activeTab, todoItems, goalItems]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        activeViewData={activeViewData}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <TabNavigation 
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="container px-4 py-2 pb-32">
        {activeTab === 'Tasks' ? (
          <div className="space-y-1 animate-fade-in">
            {sortedTodos.length > 0 ? (
              sortedTodos.map(todo => (
                <TodoItem 
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleComplete}
                />
              ))
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                <p>No tasks for today</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {sortedGoals.length > 0 ? (
              sortedGoals.map(goal => (
                <GoalItem 
                  key={goal.id}
                  goal={goal}
                  onToggle={handleToggleComplete}
                  onProgressChange={handleGoalProgressChange}
                  onToggleAutoIncrement={toggleAutoIncrement}
                />
              ))
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                <p>No goals for today</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
