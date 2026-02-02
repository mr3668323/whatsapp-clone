import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../styles/colors';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

// Complete theme colors interface matching colors.ts structure
interface ThemeColors {
  // WhatsApp Primary Colors
  whatsappGreen: string;
  whatsappBlue: string;
  
  // Background Colors
  background: string;
  backgroundLight: string;
  backgroundGray: string;
  backgroundInput: string;
  chatBackgroundLight: string;
  
  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textLight: string;
  textLink: string;
  
  // UI Colors
  border: string;
  borderLight: string;
  divider: string;
  iconGray: string;
  iconLightGray: string;
  iconGreen: string;
  white: string;
  
  // Chat Bubbles
  bubbleSent: string;
  bubbleReceived: string;
  bubbleTimestamp: string;
  bubbleSenderName: string;
  
  // Status/Online
  online: string;
  offline: string;
  typing: string;
  unreadBadge: string;
  unreadBackground: string;
  mute: string;
  
  // Buttons
  buttonPrimary: string;
  buttonSecondary: string;
  buttonTextPrimary: string;
  buttonTextSecondary: string;
  buttonDisabled: string;
  floatingButton: string;
  
  // Status indicators
  statusBorder: string;
  statusViewed: string;
  statusBackground: string;
  
  // Call colors
  callMissed: string;
  callIncoming: string;
  callOutgoing: string;
  mediaIcon: string;
  
  // Tab/Header
  tabActive: string;
  tabInactive: string;
  headerBackground: string;
  headerText: string;
  
  // Search
  searchBackground: string;
  searchText: string;
  searchPlaceholder: string;
  
  // Profile
  profileBackground: string;
  profileDivider: string;
  
  // Date Separator
  dateSeparatorBackground: string;
  encryptionBanner: string;
  
  // Shadows
  shadow: string;
  shadowLight: string;
  
  // Overlays
  overlayDark: string;
  overlayMedium: string;
  
  // Status Bar
  statusBar: string;
  statusBarText: string;
}

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  theme: ThemeColors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme_mode';

// Light theme colors (default WhatsApp colors)
const lightTheme: ThemeColors = {
  whatsappGreen: colors.whatsappGreen,
  whatsappBlue: colors.whatsappBlue,
  background: colors.background,
  backgroundLight: colors.backgroundLight,
  backgroundGray: colors.backgroundGray,
  backgroundInput: colors.backgroundInput,
  chatBackgroundLight: colors.chatBackgroundLight,
  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textTertiary: colors.textTertiary,
  textLight: colors.textLight,
  textLink: colors.textLink,
  border: colors.border,
  borderLight: colors.borderLight,
  divider: colors.divider,
  iconGray: colors.iconGray,
  iconLightGray: colors.iconLightGray,
  iconGreen: colors.iconGreen,
  white: colors.white,
  bubbleSent: colors.bubbleSent,
  bubbleReceived: colors.bubbleReceived,
  bubbleTimestamp: colors.bubbleTimestamp,
  bubbleSenderName: colors.bubbleSenderName,
  online: colors.online,
  offline: colors.offline,
  typing: colors.typing,
  unreadBadge: colors.unreadBadge,
  unreadBackground: colors.unreadBackground,
  mute: colors.mute,
  buttonPrimary: colors.buttonPrimary,
  buttonSecondary: colors.buttonSecondary,
  buttonTextPrimary: colors.buttonTextPrimary,
  buttonTextSecondary: colors.buttonTextSecondary,
  buttonDisabled: colors.buttonDisabled,
  floatingButton: colors.floatingButton,
  statusBorder: colors.statusBorder,
  statusViewed: colors.statusViewed,
  statusBackground: colors.statusBackground,
  callMissed: colors.callMissed,
  callIncoming: colors.callIncoming,
  callOutgoing: colors.callOutgoing,
  mediaIcon: colors.mediaIcon,
  tabActive: colors.tabActive,
  tabInactive: colors.tabInactive,
  headerBackground: colors.headerBackground,
  headerText: colors.headerText,
  searchBackground: colors.searchBackground,
  searchText: colors.searchText,
  searchPlaceholder: colors.searchPlaceholder,
  profileBackground: colors.profileBackground,
  profileDivider: colors.profileDivider,
  dateSeparatorBackground: colors.dateSeparatorBackground,
  encryptionBanner: colors.encryptionBanner,
  shadow: colors.shadow,
  shadowLight: colors.shadowLight,
  overlayDark: colors.overlayDark,
  overlayMedium: colors.overlayMedium,
  statusBar: colors.statusBar,
  statusBarText: colors.statusBarText,
};

// Dark theme colors (WhatsApp dark mode)
const darkTheme: ThemeColors = {
  whatsappGreen: colors.whatsappGreen, // Keep green same
  whatsappBlue: colors.whatsappBlue, // Keep blue same
  background: '#111B21', // Dark background
  backgroundLight: '#111B21',
  backgroundGray: '#202C33',
  backgroundInput: '#202C33',
  chatBackgroundLight: '#0B141A', // Darker chat background
  textPrimary: '#E9EDEF', // Light text
  textSecondary: '#8696A0', // Gray text
  textTertiary: '#667781',
  textLight: '#E9EDEF',
  textLink: colors.whatsappGreen, // Keep green links
  border: '#202C33', // Dark borders
  borderLight: '#202C33',
  divider: '#202C33',
  iconGray: '#8696A0', // Lighter icons
  iconLightGray: '#8696A0',
  iconGreen: colors.whatsappGreen, // Keep green
  white: '#111B21',
  bubbleSent: '#005C4B', // Dark green sent bubbles
  bubbleReceived: '#202C33', // Dark received bubbles
  bubbleTimestamp: '#8696A0',
  bubbleSenderName: '#25D366', // Keep green for sender name
  online: colors.online, // Keep green
  offline: '#8696A0',
  typing: colors.typing, // Keep blue
  unreadBadge: colors.unreadBadge, // Keep green
  unreadBackground: '#202C33',
  mute: '#8696A0',
  buttonPrimary: colors.buttonPrimary, // Keep green
  buttonSecondary: '#202C33',
  buttonTextPrimary: colors.buttonTextPrimary, // Keep white
  buttonTextSecondary: colors.whatsappGreen, // Keep green
  buttonDisabled: '#202C33',
  floatingButton: colors.floatingButton, // Keep green
  statusBorder: colors.statusBorder, // Keep green
  statusViewed: '#8696A0',
  statusBackground: '#202C33',
  callMissed: colors.callMissed, // Keep red
  callIncoming: colors.callIncoming, // Keep green
  callOutgoing: colors.callOutgoing, // Keep blue
  mediaIcon: colors.mediaIcon, // Keep green
  tabActive: colors.tabActive, // Keep green
  tabInactive: '#8696A0',
  headerBackground: '#202C33', // Dark header
  headerText: '#E9EDEF', // Light text
  searchBackground: '#202C33',
  searchText: '#E9EDEF',
  searchPlaceholder: '#8696A0',
  profileBackground: '#202C33',
  profileDivider: '#202C33',
  dateSeparatorBackground: 'rgba(255, 255, 255, 0.1)',
  encryptionBanner: '#1E3A2F', // Dark green tint
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.2)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  overlayMedium: 'rgba(0, 0, 0, 0.5)',
  statusBar: '#111B21', // Dark status bar
  statusBarText: '#E9EDEF', // Light status bar text
};

const getResolvedTheme = (mode: ThemeMode, systemColorScheme: ColorSchemeName | null): ResolvedTheme => {
  if (mode === 'system') {
    // Follow OS theme, default to light if null
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }
  return mode;
};

const getThemeColors = (resolvedTheme: ResolvedTheme): ThemeColors => {
  return resolvedTheme === 'dark' ? darkTheme : lightTheme;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName | null>(
    Appearance.getColorScheme()
  );
  const [isLoading, setIsLoading] = useState(true);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const resolvedTheme = getResolvedTheme(themeMode, systemColorScheme);
  const theme = getThemeColors(resolvedTheme);
  const isDark = resolvedTheme === 'dark';

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'system' || savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.log('[ThemeContext] Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.log('[ThemeContext] Error saving theme:', error);
    }
  };

  // Don't render children until theme is loaded (prevents flicker)
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        isDark,
        theme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
