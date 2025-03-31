
import React, { useMemo } from 'react';
import { Check, Circle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProgressSlider from '@/components/ProgressSlider';
import { Goal } from '@/types';

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onProgressChange: (id: string, progress: number) => void;
}

export function GoalItem({ goal, onToggle, onProgressChange }: GoalItemProps) {
  const { color } = useMemo(() => {
    const lowerText = goal.text.toLowerCase();
    
    if (lowerText.includes('run') || lowerText.includes('walk') || lowerText.includes('steps')) 
      return { color: '#34C759' }; // Green
    if (lowerText.includes('read') || lowerText.includes('book')) 
      return { color: '#FF9F0A' }; // Orange
    if (lowerText.includes('meditate') || lowerText.includes('mindful')) 
      return { color: '#BF5AF2' }; // Purple
    if (lowerText.includes('water') || lowerText.includes('drink')) 
      return { color: '#64D2FF' }; // Teal Blue
    if (lowerText.includes('study') || lowerText.includes('learn')) 
      return { color: '#0A84FF' }; // Blue
    if (lowerText.includes('weight') || lowerText.includes('gym') || lowerText.includes('workout')) 
      return { color: '#FF453A' }; // Red
    if (lowerText.includes('code') || lowerText.includes('develop') || lowerText.includes('deep') || lowerText.includes('work')) 
      return { color: '#1d2f6f' }; // Deep Blue
    if (lowerText.includes('nlp')) 
      return { color: '#42D6BA' }; // Teal
    
    return { color: '#9b87f5' }; // Default purple
  }, [goal.text]);

  const unit = useMemo(() => {
    if (goal.unit) return goal.unit;
    
    const lowerText = goal.text.toLowerCase();
    if (lowerText.includes('km') || lowerText.includes('kilometer')) return 'km';
    if (lowerText.includes('miles') || lowerText.includes('mile')) return 'mile';
    if (lowerText.includes('steps')) return 'steps';
    if (lowerText.includes('chapter')) return 'chapter';
    if (lowerText.includes('page')) return 'pages';
    if (lowerText.includes('minute') || lowerText.includes('min')) return 'min';
    if (lowerText.includes('hour') || lowerText.includes('hr')) return 'hr';
    if (lowerText.includes('glass') || lowerText.includes('liter') || lowerText.includes('litre')) return 'glass';
    if (lowerText.includes('session')) return 'sessions';
    if (lowerText.includes('task')) return 'tasks';
    
    return 'unit';
  }, [goal.text, goal.unit]);

  const handleToggle = () => {
    const newCompleted = !goal.isCompleted;
    onToggle(goal.id);
    
    if (newCompleted && goal.hasProgress) {
      onProgressChange(goal.id, goal.target || 0);
    }
  };

  // If the goal has progress, render the new progress slider
  if (goal.hasProgress) {
    return (
      <div className="my-3">
        <ProgressSlider
          current={goal.current || 0}
          target={goal.target || 100}
          unit={unit}
          color={color}
          text={goal.text}
          onProgressChange={(newProgress) => onProgressChange(goal.id, newProgress)}
        />
      </div>
    );
  }

  // For goals without progress, render the simple toggle button
  return (
    <div className={`border-b border-border py-2 ${goal.isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-center">
        <button 
          onClick={handleToggle}
          className="flex items-center flex-1 py-2 hover:bg-muted/20 rounded-md px-1"
        >
          <div className="mr-3">
            {goal.isCompleted ? (
              <Check className="h-6 w-6 text-green-400" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <span 
            className={cn(
              "text-base font-medium", 
              goal.isCompleted && "line-through text-muted-foreground"
            )}
          >
            {goal.text}
          </span>
        </button>
      </div>
    </div>
  );
};
