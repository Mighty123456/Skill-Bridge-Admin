/**
 * SkillBridge App Theme Configuration
 * 
 * This file contains all theme configurations for the SkillBridge web app.
 * To change the theme in the future, modify the color values in the
 * themeColors object or create a new theme configuration.
 */

export interface ThemeColors {
  // Primary colors (Teal)
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors (Orange)
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Surface colors
  surface: string;
  surfaceDark: string;

  // Background colors
  background: string;
  backgroundDark: string;

  // Text colors
  onPrimary: string;
  onSecondary: string;
  onSurface: string;
  onSurfaceDark: string;
  onBackground: string;
  onBackgroundDark: string;

  // Status colors
  error: string;
  onError: string;
  success: string;
  warning: string;
  info: string;

  // Job card colors
  jobCardPrimary: string;
  jobCardSecondary: string;

  // Navigation colors
  navActive: string;
  navInactive: string;
}

/**
 * Indigo & Teal Theme - Professional, modern, trusted
 */
export const indigoTheme: ThemeColors = {
  // Primary colors (Indigo)
  primary: '#4f46e5',           // Indigo 600
  primaryLight: '#818cf8',      // Indigo 400
  primaryDark: '#3730a3',       // Indigo 800

  // Secondary colors (Teal)
  secondary: '#0d9488',         // Teal 600
  secondaryLight: '#2dd4bf',    // Teal 400
  secondaryDark: '#115e59',     // Teal 800

  // Surface colors
  surface: '#FFFFFF',
  surfaceDark: '#1f2937',

  // Background colors
  background: '#f3f4f6',        // Gray 100
  backgroundDark: '#111827',

  // Text colors
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onSurface: '#111827',         // Gray 900
  onSurfaceDark: '#f9fafb',
  onBackground: '#1f2937',      // Gray 800
  onBackgroundDark: '#f3f4f6',

  // Status colors
  error: '#ef4444',             // Red 500
  onError: '#FFFFFF',
  success: '#10b981',           // Emerald 500
  warning: '#f59e0b',           // Amber 500
  info: '#3b82f6',              // Blue 500

  // Job card colors (Soft variants)
  jobCardPrimary: '#e0e7ff',    // Indigo 100
  jobCardSecondary: '#ccfbf1',  // Teal 100

  // Navigation colors
  navActive: '#4f46e5',
  navInactive: '#6b7280',
};


/**
 * Current theme - Change this to switch themes
 * To use a different theme, import it and assign here
 */
export const currentTheme: ThemeColors = indigoTheme;

/**
 * Theme configuration object for easy access throughout the app
 */
export const appTheme = {
  colors: currentTheme,

  // Typography
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // Border radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

/**
 * Example: Green & Yellow Theme (for future use)
 * Uncomment and modify to switch themes
 */
/*
export const greenYellowTheme: ThemeColors = {
  primary: '#2E7D32',           // Dark Green
  primaryLight: '#66BB6A',
  primaryDark: '#1B5E20',
  secondary: '#FFEB3B',          // Bright Yellow
  secondaryLight: '#FFF176',
  secondaryDark: '#F9A825',
  // ... implement all other required colors
};
*/

/**
 * Helper function to get theme color
 */
export const getThemeColor = (colorKey: keyof ThemeColors): string => {
  return currentTheme[colorKey];
};

/**
 * CSS variables for theme (can be used in CSS files)
 */
export const themeCSSVariables = `
  :root {
    --color-primary: ${currentTheme.primary};
    --color-primary-light: ${currentTheme.primaryLight};
    --color-primary-dark: ${currentTheme.primaryDark};
    --color-secondary: ${currentTheme.secondary};
    --color-secondary-light: ${currentTheme.secondaryLight};
    --color-secondary-dark: ${currentTheme.secondaryDark};
    --color-surface: ${currentTheme.surface};
    --color-background: ${currentTheme.background};
    --color-on-primary: ${currentTheme.onPrimary};
    --color-on-secondary: ${currentTheme.onSecondary};
    --color-on-surface: ${currentTheme.onSurface};
    --color-on-background: ${currentTheme.onBackground};
    --color-error: ${currentTheme.error};
    --color-success: ${currentTheme.success};
    --color-warning: ${currentTheme.warning};
    --color-info: ${currentTheme.info};
    --color-nav-active: ${currentTheme.navActive};
    --color-nav-inactive: ${currentTheme.navInactive};
  }
`;

