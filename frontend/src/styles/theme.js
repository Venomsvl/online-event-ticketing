const theme = {
  colors: {
    primary: '#c8102e', // Main accent red
    primaryLight: '#e94256', // Lighter shade of red
    secondary: '#181818', // Dark gray/black
    white: '#ffffff',
    lightGray: '#f9fafb',
    border: '#e5e7eb',
    text: {
      primary: '#181818',
      secondary: '#4b5563',
      light: '#6b7280',
    },
    error: '#dc2626',
    success: '#059669',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '40px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '28px',
  },
  shadows: {
    sm: '0 2px 8px 0 rgba(200,16,46,0.08)',
    md: '0 8px 32px 0 rgba(200,16,46,0.10)',
  },
  typography: {
    h1: {
      fontSize: '28px',
      fontWeight: '700',
      letterSpacing: '0.5px',
    },
    h2: {
      fontSize: '24px',
      fontWeight: '600',
    },
    body: {
      fontSize: '16px',
      lineHeight: '1.5',
    },
    small: {
      fontSize: '14px',
    },
  },
  transitions: {
    default: 'all 0.2s ease',
  },
  components: {
    input: {
      padding: '12px',
      border: '1.5px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      background: '#f9fafb',
      transition: 'all 0.2s',
    },
    button: {
      primary: {
        padding: '14px',
        backgroundColor: '#c8102e',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px 0 rgba(200,16,46,0.08)',
      },
      secondary: {
        padding: '14px',
        backgroundColor: '#ffffff',
        color: '#c8102e',
        border: '1.5px solid #c8102e',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.2s',
      },
    },
    card: {
      padding: '40px 32px',
      backgroundColor: '#ffffff',
      borderRadius: '28px',
      boxShadow: '0 8px 32px 0 rgba(200,16,46,0.10)',
      border: '1.5px solid #e5e7eb',
    },
  },
};

export default theme; 