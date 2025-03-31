
# Productivity App Documentation

## Overview
This productivity application helps users manage daily tasks, track progress on goals, and maintain a journal. It features a clean, responsive design with customizable themes and a consistent user experience across all features.

## Features

### 1. Tasks Management
- **Add Tasks**: Create new tasks with optional time assignments
- **Mark Complete**: Toggle tasks as complete/incomplete
- **Automatic Organization**: Tasks are automatically sorted with incomplete tasks displayed first

### 2. Goals Tracking
- **Progress Monitoring**: Track numerical progress towards goals
- **Visual Feedback**: Progress bars show completion status
- **Auto-increment**: Option to automatically increment progress over time
- **Customizable Units**: Set custom units for your goals (km, pages, minutes, etc.)

### 3. Journaling
- **Daily Entries**: Record thoughts and experiences
- **Mood Tracking**: Log your mood with each journal entry
- **Fullscreen Editor**: Distraction-free writing experience

### 4. Theme Customization
- **Dark/Light Mode**: Toggle between dark and light themes
- **Color Themes**: Choose from purple, orange, blue, and green theme colors

## User Interface Components

### Header
- Displays current date and greeting
- Shows active tab status and remaining items
- Contains theme toggle and settings

### Tab Navigation
- Switch between Tasks, Goals, and Journal
- Consistent experience across all tabs

### Date Selector
- Choose specific dates to view or add items
- Easily navigate between days

### Add Item Button
- Floating action button for adding new items
- Context-aware (adds appropriate item type based on current tab)

### Settings Panel
- Access theme customization
- (Future features can be added here)

## Technical Details

### State Management
- Local state for UI components
- Theme preferences stored in localStorage

### Data Structure
- **Todo**: `{ id, text, isCompleted, time }`
- **Goal**: `{ id, text, isCompleted, hasProgress, current, target, unit, autoIncrement }`
- **Journal Entry**: `{ id, title, content, date, mood }`

### Theme System
- CSS variables control colors throughout the app
- Dynamic theme color updates without page reload

## Getting Started

1. **Tasks Tab**: Start by adding daily tasks
2. **Goals Tab**: Set achievable goals with measurable targets
3. **Journal Tab**: Record your thoughts and track your mood

## Keyboard Shortcuts
- `Esc`: Close modals
- (Additional shortcuts to be implemented)

## Best Practices
- Set realistic daily goals
- Review completed tasks for motivation
- Use journal entries to reflect on progress
- Regularly update goal progress

## Future Enhancements
- Data synchronization across devices
- Calendar view for historical data
- Statistics and reporting
- Notifications and reminders
