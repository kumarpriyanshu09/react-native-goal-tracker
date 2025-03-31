import React, { useState, useMemo, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Header } from '@/components/Header';
import { TabNavigation, TabType } from '@/components/TabNavigation';
import { useTheme } from '@/context/ThemeContext';
import { TodoItem } from '@/components/TodoItem';
import { GoalItem } from '@/components/GoalItem';
import { AddItemButton } from '@/components/AddItemButton';
import { AddTodoModal } from '@/components/AddTodoModal';
import { AddGoalModal } from '@/components/AddGoalModal';
import { Todo, Goal } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const { toast } = useToast();
  const { isDarkMode, toggleTheme } = useTheme();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [activeTab, setActiveTab] = useState<TabType>('Tasks');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
      unit: 'km'
    },
    { 
      id: 'goal-2', 
      text: 'Read 30 pages', 
      isCompleted: false, 
      hasProgress: true, 
      current: 12, 
      target: 30, 
      unit: 'pages'
    },
    { 
      id: 'goal-3', 
      text: 'Meditate 15 min daily', 
      isCompleted: false, 
      hasProgress: true, 
      current: 5, 
      target: 15, 
      unit: 'min'
    },
    { 
      id: 'goal-4', 
      text: 'Drink 8 glasses of water', 
      isCompleted: false, 
      hasProgress: true, 
      current: 3, 
      target: 8, 
      unit: 'glass'
    },
    { 
      id: 'goal-5', 
      text: 'Complete coding challenge', 
      isCompleted: false, 
      hasProgress: false 
    }
  ]);

  const handleDateSelect = useCallback((date: Date) => {
    date.setHours(0, 0, 0, 0);
    setSelectedDate(date);
  }, []);

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

  const handleGoalProgressChange = useCallback((id: string, newProgress: number) => {
    setGoalItems(items =>
      items.map(item => {
        if (item.id === id && item.hasProgress) {
          const updatedProgress = Math.min(item.target || 0, Math.max(0, newProgress));
          const isNowCompleted = updatedProgress >= (item.target || 0);
          
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

  const handleAddTodo = useCallback((todo: Omit<Todo, 'id'>) => {
    const newTodo = {
      ...todo,
      id: uuidv4()
    };
    
    setTodoItems(prev => [newTodo, ...prev]);
    
    toast({
      title: "Task added",
      description: todo.text,
      duration: 2000,
    });
  }, [toast]);

  const handleAddGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: uuidv4()
    };
    
    setGoalItems(prev => [newGoal, ...prev]);
    
    toast({
      title: "Goal added",
      description: goal.text,
      duration: 2000,
    });
  }, [toast]);

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

  const activeViewData = useMemo(() => ({
    type: activeTab,
    count: (activeTab === 'Tasks' ? todoItems : goalItems).filter(item => !item.isCompleted).length,
  }), [activeTab, todoItems, goalItems]);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        activeViewData={activeViewData}
      />
      
      <TabNavigation 
        activeTab={activeTab}
        onChange={handleTabChange}
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
                <p className="mt-2">Click the + button to add one</p>
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
                />
              ))
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                <p>No goals for today</p>
                <p className="mt-2">Click the + button to add one</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <AddItemButton onClick={() => setIsAddModalOpen(true)} />
      
      {activeTab === 'Tasks' ? (
        <AddTodoModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddTodo}
        />
      ) : (
        <AddGoalModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddGoal}
        />
      )}
    </div>
  );
};

export default Index;
