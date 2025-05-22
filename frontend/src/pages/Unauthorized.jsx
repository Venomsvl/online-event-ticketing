import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '20px',
    },
    title: {
      fontSize: '2rem',
      color: '#dc2626',
      marginBottom: '1rem',
    },
    message: {
      fontSize: '1.1rem',
      color: '#4b5563',
      marginBottom: '2rem',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Access Denied</h1>
      <p style={styles.message}>
        You don't have permission to access this page. Please contact an administrator if you believe this is a mistake.
      </p>
      <button 
        onClick={() => navigate('/')} 
        style={styles.button}
      >
        Return to Home Page
      </button>
    </div>
  );
} 