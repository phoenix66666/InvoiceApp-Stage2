import { createContext, useContext } from 'react';

export const ThemeContext = createContext({ dark: true });

export const useTheme = () => useContext(ThemeContext);
