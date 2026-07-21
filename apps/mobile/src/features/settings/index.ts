import { useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';

export function useSettings() {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    systemScheme === 'dark' ? 'dark' : 'light',
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}
