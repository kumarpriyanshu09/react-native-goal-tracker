
# Developer Documentation

## Architecture Overview

This React application is built with modern web technologies and follows component-based architecture principles. It uses Vite as the build tool, TypeScript for type safety, Tailwind CSS for styling, and Shadcn UI for components.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # Shadcn UI components
│   └── ...           # Custom components
├── context/          # React context providers
├── docs/             # Documentation
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
└── types/            # TypeScript type definitions
```

## Core Technologies

- **React**: UI library
- **TypeScript**: Static typing
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library built on Radix UI
- **React Router**: For navigation
- **React Query**: For data fetching/caching
- **UUID**: For generating unique IDs

## Key Components

### State Management

The app uses React's built-in state management with:
- `useState` for component-level state
- `useContext` for theme management
- `React Query` for server state (future implementation)

### ThemeContext

The `ThemeContext` provides theme-related functionality:

```typescript
export type ThemeColor = 'purple' | 'orange' | 'blue' | 'green';

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}
```

Usage:
```typescript
const { isDarkMode, toggleTheme, themeColor, setThemeColor } = useTheme();
```

### Component Patterns

#### 1. UI Components
These are pure presentation components that receive props and render UI elements.

Example:
```typescript
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  // Component implementation
}
```

#### 2. Container Components
These manage state and business logic, then pass data down to UI components.

Example: `Index.tsx` manages state for todos and goals.

#### 3. Modal Components
Used for user input, these show/hide based on state.

Example: `AddTodoModal`, `AddGoalModal`, `AddJournalEntryModal`

## Data Models

### Todo
```typescript
interface Todo {
  id: string;
  text: string;
  isCompleted: boolean;
  time: string | null;
}
```

### Goal
```typescript
interface Goal {
  id: string;
  text: string;
  isCompleted: boolean;
  hasProgress: boolean;
  current?: number;
  target?: number;
  unit?: string;
  autoIncrement: boolean;
}
```

### Journal Entry
```typescript
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: Mood;
}

type Mood = 'happy' | 'neutral' | 'sad' | 'excited' | 'tired' | 'anxious';
```

## Adding New Features

### Creating a New Component

1. Create a new file in `src/components/`
2. Define the interface for props
3. Implement the component
4. Export the component

Example:
```typescript
import React from 'react';

interface NewComponentProps {
  // Define props
}

export function NewComponent({ ...props }: NewComponentProps) {
  // Implementation
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Extending Models

When adding new fields to existing models:

1. Update the type definition in `src/types/index.ts`
2. Update any components that use the model
3. Handle backward compatibility if needed

### Adding a New Page

1. Create a new file in `src/pages/`
2. Implement the page component
3. Add a route in `App.tsx`

```typescript
// In App.tsx
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/new-page" element={<NewPage />} />
  {/* ... */}
</Routes>
```

## Best Practices

### Performance Optimization

- Use `useMemo` and `useCallback` for expensive calculations
- Apply proper React key props for lists
- Use virtual scrolling for long lists (future)

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Maintain dark/light mode compatibility
- Use CSS variables for theme colors

### Error Handling

- Implement proper error boundaries
- Add user-friendly error messages
- Log errors for debugging

### Accessibility

- Ensure proper ARIA attributes
- Maintain keyboard navigation
- Test with screen readers

## Testing (Future Implementation)

- Unit tests with React Testing Library
- Component tests with Storybook
- End-to-end tests with Cypress

## Deployment

- Build with `npm run build`
- The output is in the `dist/` directory
- Deploy to static hosting service
