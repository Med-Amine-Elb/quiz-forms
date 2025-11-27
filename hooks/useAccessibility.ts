import { useState, useEffect } from "react";

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  reducedMotion: boolean;
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'normal',
    reducedMotion: false,
  });

  // Check for system preferences
  useEffect(() => {
    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setSettings((prev) => ({
        ...prev,
        reducedMotion: mediaQuery.matches,
      }));

      const handleChange = (e: MediaQueryListEvent) => {
        setSettings((prev) => ({
          ...prev,
          reducedMotion: e.matches,
        }));
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleHighContrast = () => {
    setSettings((prev) => ({
      ...prev,
      highContrast: !prev.highContrast,
    }));
  };

  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setSettings((prev) => ({
      ...prev,
      fontSize: size,
    }));
  };

  // Apply settings to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // High contrast
      if (settings.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }

      // Font size
      root.classList.remove('font-normal', 'font-large', 'font-xlarge');
      root.classList.add(`font-${settings.fontSize}`);

      // Reduced motion
      if (settings.reducedMotion) {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }
    }
  }, [settings]);

  return {
    settings,
    toggleHighContrast,
    setFontSize,
  };
}

