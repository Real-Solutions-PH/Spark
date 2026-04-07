// Design tokens from Serenity design system (design-system.json)

export const colors = {
  primary: {
    50: "#FDF2F8",
    100: "#F9E0EF",
    200: "#F0C4DE",
    300: "#E59DC8",
    400: "#D472AC",
    500: "#B84D8E",
    600: "#9B3A74",
    700: "#7E2D5E",
    800: "#6B2750",
    900: "#4A1A38",
  },
  secondary: {
    50: "#FFF5F7",
    100: "#FFE0E8",
    200: "#FFC2D4",
    300: "#FF94B5",
    400: "#F0608E",
    500: "#E03E6E",
    600: "#C42A58",
    700: "#A32048",
    800: "#871B3E",
    900: "#6B1532",
  },
  neutral: {
    0: "#FFFFFF",
    50: "#FAF8F9",
    100: "#F5F0F2",
    200: "#EDE6E9",
    300: "#DDD4D8",
    400: "#B8ACB2",
    500: "#918590",
    600: "#6E6470",
    700: "#504850",
    800: "#352F35",
    900: "#1E1A1E",
  },
  semantic: {
    success: "#6BBF8A",
    warning: "#F0A84C",
    error: "#E85A6E",
    info: "#7A9BD4",
    happy: "#E03E6E",
    sad: "#6E6470",
    angry: "#F0A84C",
  },
} as const;

export const typography = {
  fontFamilies: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  },
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
} as const;

export const elevation = {
  low: "0 2px 8px rgba(74, 26, 56, 0.06)",
  medium: "0 4px 16px rgba(74, 26, 56, 0.1)",
  high: "0 8px 24px rgba(74, 26, 56, 0.15)",
} as const;

export const animation = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    entrance: 400,
  },
  easing: {
    default: "cubic-bezier(0.4, 0.0, 0.2, 1.0)",
    enter: "cubic-bezier(0.0, 0.0, 0.2, 1.0)",
    exit: "cubic-bezier(0.4, 0.0, 1.0, 1.0)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1.0)",
  },
} as const;
