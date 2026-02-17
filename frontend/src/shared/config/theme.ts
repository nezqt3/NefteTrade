export const theme = {
  colors: {
    primary: '#0d94db',
    primaryLight: '#75c0e3',
    primaryDark: '#0a7bc4',
    background: '#fafbfc',
    textLight: '#718096',
    textMedium: '#2d3748',
    textDark: '#0a0e27',
  },
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
};

export const antdTheme = {
  token: {
    colorPrimary: theme.colors.primary,
    colorLink: theme.colors.primary,
    colorSuccess: '#52c41a',
    colorWarning: '#fbbf24',
    colorError: '#ff4d4f',
    borderRadius: 12,
    fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
};
