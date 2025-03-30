
import React, { useMemo } from 'react';
import { Check, Circle, Sun, Briefcase, Utensils, BookOpen, ListTodo, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Todo } from '@/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  const Icon = useMemo(() => {
    const lowerText = todo.text.toLowerCase();
    const iconProps = { 
      size: 20, 
      className: "flex-shrink-0 text-muted-foreground" 
    };
    
    if (lowerText.includes('wake up') || lowerText.includes('morning')) 
      return <Sun {...iconProps} className="text-orange-500" />;
    if (lowerText.includes('exercise') || lowerText.includes('workout')) 
      return <Briefcase {...iconProps} className="text-purple-400" />;
    if (lowerText.includes('nlp') || lowerText.includes('study')) 
      return <BookOpen {...iconProps} className="text-blue-400" />;
    if (lowerText.includes('cook') || lowerText.includes('meal')) 
      return <Utensils {...iconProps} className="text-orange-400" />;
    if (lowerText.includes('journal') || lowerText.includes('write')) 
      return <BookOpen {...iconProps} className="text-purple-400" />;
    if (lowerText.includes('plan') || lowerText.includes('prioritize')) 
      return <ListTodo {...iconProps} className="text-blue-300" />;
    if (lowerText.includes('create') || lowerText.includes('work on')) 
      return <Zap {...iconProps} className="text-pink-400" />;
    
    return <ListTodo {...iconProps} />;
  }, [todo.text]);

  return (
    <button 
      onClick={() => onToggle(todo.id)}
      className="flex justify-between items-center w-full py-3 px-2 hover:bg-muted/20 rounded-md border-b border-border"
    >
      <div className="flex items-center">
        <div className="mr-3">
          {todo.isCompleted ? (
            <Check className="h-6 w-6 text-green-400" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="mr-3">
          {Icon}
        </div>
        <span 
          className={cn(
            "text-base font-medium", 
            todo.isCompleted && "line-through text-muted-foreground"
          )}
        >
          {todo.text}
        </span>
      </div>
      
      {todo.time && (
        <span className="text-sm text-muted-foreground ml-2">
          {todo.time}
        </span>
      )}
    </button>
  );
}
