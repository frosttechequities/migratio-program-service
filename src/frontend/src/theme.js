import { createTheme, alpha, responsiveFontSizes } from '@mui/material/styles';

// Create a custom theme for the Visafy application
const theme = createTheme({
  // Add custom shadows array with more elevations
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
    '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
    '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
    '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
    '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
    '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
    '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
    '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
    '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
    '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
    '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
    '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
    '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
    '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
    '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
  ],
  palette: {
    mode: 'light',
    primary: {
      main: '#0066FF', // Visafy blue
      light: '#5271FF',
      dark: '#0047B3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3D5AFE', // Visafy secondary blue
      light: '#8C9EFF',
      dark: '#0039CB',
      contrastText: '#FFFFFF',
    },
    purple: {
      main: '#9C27B0', // Purple color
      light: '#BA68C8',
      dark: '#7B1FA2',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Fresh green
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444', // Bright red
      light: '#F87171',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B', // Warm amber
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#3B82F6', // Light blue
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB', // Light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827', // Near black
      secondary: '#4B5563', // Dark gray
      disabled: '#9CA3AF', // Medium gray
    },
    divider: '#E5E7EB', // Light gray divider
    action: {
      active: '#6B7280',
      hover: alpha('#2563EB', 0.04),
      selected: alpha('#2563EB', 0.08),
      disabled: '#D1D5DB',
      disabledBackground: '#F3F4F6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
    '0px 3px 3px -2px rgba(0,0,0,0.06),0px 3px 4px 0px rgba(0,0,0,0.04),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.06),0px 5px 8px 0px rgba(0,0,0,0.05),0px 1px 14px 0px rgba(0,0,0,0.06)',
    '0px 4px 5px -2px rgba(0,0,0,0.07),0px 7px 10px 1px rgba(0,0,0,0.05),0px 2px 16px 1px rgba(0,0,0,0.06)',
    '0px 5px 6px -3px rgba(0,0,0,0.07),0px 9px 12px 1px rgba(0,0,0,0.06),0px 3px 16px 2px rgba(0,0,0,0.06)',
    '0px 6px 7px -4px rgba(0,0,0,0.07),0px 11px 15px 1px rgba(0,0,0,0.06),0px 4px 20px 3px rgba(0,0,0,0.06)',
    '0px 7px 8px -4px rgba(0,0,0,0.07),0px 13px 19px 2px rgba(0,0,0,0.06),0px 5px 24px 4px rgba(0,0,0,0.06)',
    '0px 8px 9px -5px rgba(0,0,0,0.07),0px 15px 22px 2px rgba(0,0,0,0.06),0px 6px 28px 5px rgba(0,0,0,0.06)',
    '0px 9px 11px -5px rgba(0,0,0,0.07),0px 17px 26px 2px rgba(0,0,0,0.06),0px 6px 32px 5px rgba(0,0,0,0.06)',
    '0px 10px 13px -6px rgba(0,0,0,0.07),0px 19px 29px 2px rgba(0,0,0,0.06),0px 7px 36px 6px rgba(0,0,0,0.06)',
    '0px 11px 14px -7px rgba(0,0,0,0.07),0px 21px 33px 3px rgba(0,0,0,0.06),0px 8px 40px 7px rgba(0,0,0,0.06)',
    '0px 12px 16px -7px rgba(0,0,0,0.07),0px 24px 38px 3px rgba(0,0,0,0.06),0px 9px 46px 8px rgba(0,0,0,0.06)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        },
        // Global focus styles for better keyboard navigation
        'a:focus, button:focus, [role="button"]:focus, input:focus, select:focus, textarea:focus, [tabindex]:focus': {
          outline: `3px solid #0066FF !important`,
          outlineOffset: '2px !important',
          boxShadow: 'none !important',
          transition: 'outline-offset 0.2s ease !important',
        },
        // Skip link styles
        '.skip-link:focus': {
          position: 'fixed !important',
          top: '0 !important',
          left: '0 !important',
          zIndex: '9999 !important',
          padding: '1rem !important',
          backgroundColor: '#0066FF !important',
          color: '#FFFFFF !important',
          textDecoration: 'none !important',
          fontWeight: 'bold !important',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2) !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 20px',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(0, 102, 255, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 102, 255, 0.35)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(90deg, #0066FF 0%, #5271FF 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(90deg, #3D5AFE 0%, #8C9EFF 100%)',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.07)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 20,
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.07)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 15px rgba(0, 102, 255, 0.15)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha('#FFFFFF', 0.9),
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginBottom: 4,
          '&.Mui-selected': {
            backgroundColor: alpha('#0066FF', 0.08),
            '&:hover': {
              backgroundColor: alpha('#0066FF', 0.12),
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: alpha('#0066FF', 0.04),
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#0066FF', 0.08),
            '&:hover': {
              backgroundColor: alpha('#0066FF', 0.12),
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          padding: '8px 0',
        },
      },
    },
  },
  // Custom transitions for consistent animations
  transitions: {
    easing: {
      // Custom easing functions
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      // Bounce effect for interactive elements
      bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
      // Custom durations
      fast: 300,
      medium: 500,
      slow: 700,
    },
  },
  // Custom z-index values for consistent layering
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
    // Custom z-index values
    dropdown: 1250,
    sticky: 1080,
    backdrop: 1290,
    notification: 1450,
  },
});

// Add additional component overrides
theme.components = {
  ...theme.components,
  // Tooltip enhancements
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: alpha(theme.palette.grey[900], 0.9),
        backdropFilter: 'blur(4px)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: '0.75rem',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      arrow: {
        color: alpha(theme.palette.grey[900], 0.9),
      },
    },
  },
  // Badge enhancements
  MuiBadge: {
    styleOverrides: {
      badge: {
        fontWeight: 600,
        fontSize: '0.65rem',
        padding: '0 4px',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
      },
    },
  },
  // Accordion enhancements
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: 'none',
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          margin: '16px 0',
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: '0 24px',
        minHeight: 64,
        '&.Mui-expanded': {
          minHeight: 64,
        },
      },
      content: {
        margin: '12px 0',
        '&.Mui-expanded': {
          margin: '12px 0',
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: '0 24px 24px',
      },
    },
  },
  // Dialog enhancements
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)',
        backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 1))',
        backdropFilter: 'blur(10px)',
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        padding: '24px 24px 16px',
        fontSize: '1.25rem',
        fontWeight: 600,
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: '16px 24px',
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '16px 24px 24px',
      },
    },
  },
  // Skeleton enhancements
  MuiSkeleton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        '&::after': {
          background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.08)}, transparent)`,
        },
      },
    },
  },
  // Backdrop enhancements
  MuiBackdrop: {
    styleOverrides: {
      root: {
        backgroundColor: alpha(theme.palette.grey[900], 0.7),
        backdropFilter: 'blur(4px)',
      },
    },
  },
  // Divider enhancements
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: alpha(theme.palette.divider, 0.8),
        '&.MuiDivider-vertical': {
          marginRight: 16,
          marginLeft: 16,
        },
      },
      middle: {
        marginLeft: 24,
        marginRight: 24,
      },
    },
  },
  // Switch enhancements
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: 8,
      },
      switchBase: {
        padding: 1,
        '&.Mui-checked': {
          transform: 'translateX(16px)',
          color: theme.palette.common.white,
          '& + .MuiSwitch-track': {
            backgroundColor: theme.palette.primary.main,
            opacity: 1,
            border: 'none',
          },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
          color: theme.palette.primary.main,
          border: `6px solid ${theme.palette.common.white}`,
        },
      },
      thumb: {
        width: 24,
        height: 24,
        boxShadow: '0 2px 4px 0 rgba(0, 35, 75, 0.2)',
      },
      track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[300],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
      },
    },
  },
};

// Apply responsive font sizes
const responsiveTheme = responsiveFontSizes(theme, {
  breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
  factor: 2, // Stronger factor for more noticeable scaling
});

export default responsiveTheme;
