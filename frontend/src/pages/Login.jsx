import { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from '../styles/theme';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, checkAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setMessage('');

    // Validate form
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Logging in...');
      
      // First, attempt to login
      await axios.post('/api/auth/login', form);
      
      // Then, update the auth context
      await login();
      
      // Update loading toast to success
      toast.update(loadingToast, {
        render: 'Login successful!',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
      
      // Show redirecting toast
      toast.info('Redirecting to profile...', {
        autoClose: 1000
      });
      
      // Double check authentication
      await checkAuth();
      
      // Finally, navigate to profile
      navigate('/profile', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      
      // Show error toast
      toast.error(
        err.response?.data?.message === 'User not found' 
          ? 'No account found with this email.'
          : err.response?.data?.message === 'Invalid credentials'
          ? 'Incorrect password.'
          : err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
      
      // Set form error message
      if (err.response?.data?.message === 'User not found') {
        setMessage('No account found with this email.');
      } else if (err.response?.data?.message === 'Invalid credentials') {
        setMessage('Incorrect password.');
      } else {
        setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

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
      fontSize: '1rem',
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
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#977DFF',
      cursor: 'pointer',
      padding: 0,
      fontSize: '1.25rem',
      height: '32px',
      width: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.2s ease',
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
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    errorMessage: {
      marginTop: '1rem',
      textAlign: 'center',
      color: '#fff',
      fontSize: '0.95rem',
      padding: '1rem',
      borderRadius: '12px',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    error: {
      color: '#fff',
      fontSize: '0.875rem',
      marginTop: '0.25rem',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      padding: '0.5rem',
      borderRadius: '8px',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid #ffffff',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    registerLink: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: '0.95rem',
      color: '#fff',
    },
    link: {
      color: '#C8102E',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      borderBottom: '1px solid rgba(255,255,255,0.3)',
      paddingBottom: '2px',
    },
  };

  return (
    <div style={styles.outer}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome Back</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={{ ...styles.input, width: '100%', paddingRight: 44 }}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? (
              <>
                <div style={styles.loadingSpinner} />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          {message && (
            <p style={message.includes('failed') ? styles.errorMessage : styles.message}>
              {message}
            </p>
          )}

          <div style={styles.registerLink}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Register here
            </Link>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ color: '#fff' }}>Are you an admin? </span>
              <Link to="/admin-login" style={{ ...styles.link, color: '#C8102E' }}>
                Admin Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 