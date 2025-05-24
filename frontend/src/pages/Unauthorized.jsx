import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
    },
    card: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '20px',
      padding: '3rem 2rem',
      border: '1px solid rgba(151, 125, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      maxWidth: '500px',
      width: '100%',
      margin: '0 auto',
      textAlign: 'center',
    },
    icon: {
      fontSize: '4rem',
      marginBottom: '1.5rem',
      filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3))',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 0 30px rgba(239, 68, 68, 0.5)',
    },
    message: {
      fontSize: '1.2rem',
      color: 'rgba(255,255,255,0.8)',
      marginBottom: '2.5rem',
      lineHeight: '1.6',
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    button: {
      padding: '0.75rem 2rem',
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
      textDecoration: 'none',
      display: 'inline-block',
    },
    secondaryButton: {
      padding: '0.75rem 2rem',
      background: 'rgba(255,255,255,0.1)',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      textDecoration: 'none',
      display: 'inline-block',
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(151, 125, 255, 0.4);
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.15);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,255,255,0.1);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        `}
      </style>
      
      <div style={styles.card}>
        <div style={styles.icon} className="floating">🚫</div>
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.message}>
          🔐 Oops! You don't have permission to access this page. This area is restricted to authorized users only.
          <br /><br />
          If you believe this is a mistake, please contact an administrator for assistance.
        </p>
        <div style={styles.buttonContainer}>
          <button 
            onClick={() => navigate('/')} 
            style={styles.button}
            className="btn-primary"
          >
            🏠 Return to Home
          </button>
          <button 
            onClick={() => navigate(-1)} 
            style={styles.secondaryButton}
            className="btn-secondary"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
} 