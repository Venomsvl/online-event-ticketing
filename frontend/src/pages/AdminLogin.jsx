import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import theme from '../styles/theme';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const styles = {
    outer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 50%, #0600AB 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    container: {
      maxWidth: '420px',
      width: '100%',
      margin: '40px auto',
      background: 'rgba(255,255,255,0.18)',
      borderRadius: '28px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
      border: '1.5px solid rgba(151,125,255,0.3)',
      padding: '2.5rem 2rem',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      textAlign: 'center',
      color: '#fff',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      position: 'relative',
    },
    label: {
      color: '#fff',
      fontSize: '1.15rem',
      fontWeight: '500',
      marginBottom: '0.25rem',
    },
    input: {
      background: 'rgba(255,255,255,0.7)',
      border: '1.5px solid #977DFF',
      borderRadius: '12px',
      color: '#0033FF',
      padding: '0.75rem',
      fontSize: '1rem',
      marginBottom: '0.5rem',
      boxSizing: 'border-box',
      fontWeight: 500,
      outline: 'none',
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)',
      transition: 'all 0.2s ease',
      width: '100%',
    },
    button: {
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    message: {
      marginTop: '1rem',
      textAlign: 'center',
      color: '#fff',
      fontSize: '0.95rem',
      padding: '1rem',
      borderRadius: '12px',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/admin-login', form);
      if (res.data.success) {
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/profile'), 1000);
      }
    } catch (err) {
      setMessage('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.outer}>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Login</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter admin username"
              style={styles.input}
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              disabled={loading}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              style={styles.input}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              disabled={loading}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {message && <div style={styles.message}>{message}</div>}
        </form>
      </div>
    </div>
  );
} 