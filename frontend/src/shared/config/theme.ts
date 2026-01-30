export const theme = {
  colors: {
    primary: '#0d94db',
    primaryLight: '#75c0e3',
    primaryDark: '#4cabda',
    background: '#e4eaec',
    backgroundAlt: '#e4eaec',
    textLight: '#acacb4',
    textMedium: '#aeb4b4',
    textGray: '#8f9698',
    textDark: '#5e6669',
    textDarker: '#4c5c5c',
    textDarkest: '#4c545c',
  },
  breakpoints: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1600px',
  },
};

export const antdTheme = {
  token: {
    colorPrimary: theme.colors.primary,
    colorLink: theme.colors.primary,
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: theme.colors.background,
    },
    Button: {
      primaryShadow: '0 2px 0 rgba(13, 148, 219, 0.1)',
    },
  },
};
