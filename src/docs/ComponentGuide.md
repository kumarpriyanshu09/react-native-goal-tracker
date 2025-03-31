
# Component Documentation

This document provides details about the key components in the productivity app.

## Navigation Components

### Header
**File**: `src/components/Header.tsx`

The Header component displays the current date, greeting, and navigation controls.

**Props**:
- `selectedDate`: Date object for the current view
- `onDateSelect`: Callback for date changes
- `activeViewData`: Object with current tab type and count

**Features**:
- Dynamic greeting based on time of day
- Status text showing remaining tasks/goals
- Theme toggle button
- Settings panel access
- Date information display

### TabNavigation
**File**: `src/components/TabNavigation.tsx`

Provides navigation between main app sections.

**Props**:
- `activeTab`: Current active tab
- `onChange`: Callback for tab changes

**Features**:
- Switches between Tasks, Goals, and Journal views
- Highlights active tab
- Handles routing to Journal page

### DateSelector
**File**: `src/components/DateSelector.tsx`

Horizontal date picker for selecting viewing date.

**Props**:
- `selectedDate`: Currently selected date
- `onDateSelect`: Callback for date selection

**Features**:
- Horizontal scrolling date picker
- Highlights current date
- Shows day of week and date number

## Task Management Components

### TodoItem
**File**: `src/components/TodoItem.tsx`

Displays a single task item.

**Props**:
- `todo`: Todo object
- `onToggle`: Callback for completing/uncompleting

**Features**:
- Completion checkbox
- Context-aware icons based on task text
- Time display if specified
- Visual indication of completion status

### AddTodoModal
**File**: `src/components/AddTodoModal.tsx`

Modal for adding new tasks.

**Props**:
- `isOpen`: Boolean to control visibility
- `onClose`: Callback to close modal
- `onAdd`: Callback to add new todo

**Features**:
- Text input for task description
- Optional time input
- Form validation

## Goal Management Components

### GoalItem
**File**: `src/components/GoalItem.tsx`

Displays a single goal with optional progress tracking.

**Props**:
- `goal`: Goal object
- `onToggle`: Callback for completing/uncompleting
- `onProgressChange`: Callback for progress updates
- `onToggleAutoIncrement`: Callback for auto-increment toggle

**Features**:
- Completion checkbox
- Context-aware emoji and color based on goal text
- Progress slider for measurable goals
- Auto-increment toggle

### ProgressSlider
**File**: `src/components/ProgressSlider.tsx`

Progress visualization and control for goals.

**Props**:
- `activity`: Description text
- `emoji`: Icon to represent the activity
- `color`: Accent color
- `current`: Current progress value
- `target`: Target value
- `unit`: Unit of measurement
- `autoIncrement`: Whether to auto-increase value
- `incrementSpeed`: Speed of auto-increment
- `onProgressChange`: Callback for progress updates

**Features**:
- Visual progress bar
- Numeric display of progress/target
- Interactive slider
- Auto-increment functionality

### AddGoalModal
**File**: `src/components/AddGoalModal.tsx`

Modal for adding new goals.

**Props**:
- `isOpen`: Boolean to control visibility
- `onClose`: Callback to close modal
- `onAdd`: Callback to add new goal

**Features**:
- Text input for goal description
- Toggle for measurable progress
- Inputs for target value and unit
- Form validation

## Journal Components

### AddJournalEntryModal
**File**: `src/components/AddJournalEntryModal.tsx`

Fullscreen modal for creating journal entries.

**Props**:
- `isOpen`: Boolean to control visibility
- `onClose`: Callback to close modal
- `onAdd`: Callback to add new entry

**Features**:
- Title input
- Content textarea
- Mood selector
- Fullscreen immersive experience

## Utility Components

### AddItemButton
**File**: `src/components/AddItemButton.tsx`

Floating action button for adding new items.

**Props**:
- `onClick`: Callback for button click

**Features**:
- Fixed position at bottom right
- Consistent across all pages
- Primary color accent

## Context Providers

### ThemeProvider
**File**: `src/context/ThemeContext.tsx`

Provides theme management functionality.

**Exported Values**:
- `isDarkMode`: Current theme mode
- `toggleTheme`: Function to switch between light/dark
- `themeColor`: Current theme color ('purple', 'orange', 'blue', 'green')
- `setThemeColor`: Function to change theme color

**Features**:
- Persists preferences in localStorage
- Dynamically updates CSS variables
- Respects system preferences by default

## Pages

### Index
**File**: `src/pages/Index.tsx`

Main application page handling Tasks and Goals.

**Features**:
- Tab-based interface
- Todo and Goal management
- Date selection
- Add new items

### Journal
**File**: `src/pages/Journal.tsx`

Page for journal entries.

**Features**:
- List of journal entries
- Date organization
- Add new entries

### NotFound
**File**: `src/pages/NotFound.tsx`

404 page for invalid routes.

**Features**:
- Error message
- Navigation back to home

## Custom Hooks

### useTheme
**File**: `src/context/ThemeContext.tsx`

Hook for accessing theme context.

**Returns**:
- `isDarkMode`: Current theme mode
- `toggleTheme`: Function to switch between light/dark
- `themeColor`: Current theme color
- `setThemeColor`: Function to change theme color

### useToast
**File**: `src/hooks/use-toast.ts`

Hook for displaying toast notifications.

**Methods**:
- `toast`: Function to show toast message

## Future Components

### StatsView (Planned)
Will display productivity statistics and trends.

### SettingsPage (Planned)
Dedicated page for all app settings and customizations.

### CalendarView (Planned)
Monthly calendar visualization of tasks and goals.
