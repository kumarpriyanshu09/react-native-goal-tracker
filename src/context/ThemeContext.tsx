import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';

// Define available theme colors
export type ThemeColor = 'purple' | 'orange' | 'blue' | 'green'; // Add more as needed

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themeMode');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme ? savedTheme === 'dark' : prefersDark;
    }
    return false; // Default to light mode if window is not available
  });

  // Theme Color State
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('themeColor') as ThemeColor) || 'purple'; // Default to purple
    }
    return 'purple';
  });

  // Toggle Dark Mode
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('themeMode', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  // Set Theme Color
  const setThemeColor = useCallback((color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
  }, []);

  // Apply theme mode (dark/light) class to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Apply theme color class/variables to document root
  useEffect(() => {
    const root = window.document.documentElement;
    // Remove previous color classes if any (optional, depends on CSS setup)
    // Example: root.classList.remove('theme-purple', 'theme-orange', ...); 
    
    // Set CSS variables based on themeColor
    // This assumes your CSS is set up to use these variables.
    // We will configure this in tailwind.config.ts and index.css later.
    root.style.setProperty('--color-primary-hue', getHue(themeColor)); 
    // Add more variables as needed (e.g., saturation, lightness)

  }, [themeColor]);

  // Helper to get HSL hue value for a color name
  const getHue = (color: ThemeColor): string => {
    switch (color) {
      case 'purple': return '262'; // Example HSL hue for purple
      case 'orange': return '30';  // Example HSL hue for orange
      case 'blue':   return '217'; // Example HSL hue for blue
      case 'green':  return '145'; // Example HSL hue for green
      default:       return '262'; // Default to purple
    }
  };

  const value = useMemo(() => ({
    isDarkMode,
    toggleTheme,
    themeColor,
    setThemeColor,
  }), [isDarkMode, toggleTheme, themeColor, setThemeColor]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
