import { useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from '../../styles/theme';
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
      
      // Normalize email before sending
      const normalizedEmail = form.email.toLowerCase().trim();
      
      // Call login function from AuthContext with credentials
      const userData = await login({
        email: normalizedEmail,
        password: form.password
      });
      
      if (!userData) {
        throw new Error('Failed to get user data after login');
      }
      
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
      
      // Navigate to profile page after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      
      // Show error toast
      toast.error(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
      
      setMessage(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    outer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '2rem',
    },
    container: {
      maxWidth: '450px',
      width: '100%',
      margin: '0 auto',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(151, 125, 255, 0.2)',
      padding: '3rem 2.5rem',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      animation: 'fadeIn 0.6s ease-out',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '2.5rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 50%, #E9D5FF 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 0 30px rgba(151, 125, 255, 0.5)',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.7)',
      textAlign: 'center',
      marginBottom: '2rem',
      marginTop: '-1rem'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      position: 'relative',
    },
    label: {
      color: '#C4B5FD',
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    input: {
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(151, 125, 255, 0.3)',
      borderRadius: '12px',
      color: '#ffffff',
      padding: '1rem 1.5rem',
      fontSize: '1rem',
      boxSizing: 'border-box',
      fontWeight: '500',
      outline: 'none',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      width: '100%',
      backdropFilter: 'blur(10px)',
    },
    passwordToggle: {
      position: 'absolute',
      right: '1.25rem',
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
      transition: 'all 0.3s ease',
      borderRadius: '6px',
    },
    button: {
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '1rem 2rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      marginTop: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    message: {
      marginTop: '1.5rem',
      textAlign: 'center',
      color: '#fff',
      fontSize: '1rem',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    errorMessage: {
      marginTop: '1.5rem',
      textAlign: 'center',
      color: '#fff',
      fontSize: '1rem',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    error: {
      color: '#fbbf24',
      fontSize: '0.9rem',
      marginTop: '0.5rem',
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    loadingSpinner: {
      width: '24px',
      height: '24px',
      border: '3px solid rgba(255,255,255,0.3)',
      borderTop: '3px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    registerLink: {
      marginTop: '2rem',
      textAlign: 'center',
      fontSize: '1rem',
      color: 'rgba(255,255,255,0.8)',
      background: 'rgba(255,255,255,0.03)',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(151, 125, 255, 0.1)',
      backdropFilter: 'blur(10px)',
    },
    link: {
      color: '#977DFF',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      position: 'relative',
    },
    logoContainer: {
      position: 'absolute',
      top: '2rem',
      left: '2rem',
      zIndex: 1000,
    },
    logo: {
      height: '160px',
      width: 'auto',
      transition: 'all 0.3s ease',
      filter: 'drop-shadow(0 8px 20px rgba(151, 125, 255, 0.5))',
    },
  };

  return (
    <div style={styles.outer}>
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(151, 125, 255, 0.4);
        }
        .input-focus:focus {
          border-color: #977DFF;
          box-shadow: 0 0 0 3px rgba(151, 125, 255, 0.2);
          background: rgba(255,255,255,0.15);
        }
        .logo-hover:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 12px 24px rgba(151, 125, 255, 0.7));
        }
        .link-hover:hover {
          color: #C4B5FD;
          text-shadow: 0 0 8px rgba(151, 125, 255, 0.5);
        }
        .toggle-hover:hover {
          background: rgba(151, 125, 255, 0.2);
          color: #C4B5FD;
        }
        ::placeholder {
          color: rgba(255,255,255,0.5) !important;
        }
        `}
      </style>
      
      <div style={styles.logoContainer}>
        <Link to="/">
          <img 
            src="/LogoWhite.png" 
            alt="Logo" 
            style={styles.logo}
            className="logo-hover"
          />
        </Link>
      </div>
      
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
        theme="dark"
        toastStyle={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(151, 125, 255, 0.2)',
          color: '#fff'
        }}
      />
      
      <div style={styles.container}>
        <h1 style={styles.title}>🔐 Welcome Back</h1>
        <p style={styles.subtitle}>🎉 Sign in to access your account and explore amazing events</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>📧 Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              style={styles.input}
              className="input-focus"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
            />
            {errors.email && <span style={styles.error}>⚠️ {errors.email}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔑 Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                style={{ ...styles.input, paddingRight: '3.5rem' }}
                className="input-focus"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
              />
              <button
                type="button"
                style={styles.passwordToggle}
                className="toggle-hover"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span style={styles.error}>⚠️ {errors.password}</span>}
          </div>

          <Link 
            to="/forgot-password" 
            style={{
              color: '#977DFF',
              textAlign: 'right',
              textDecoration: 'none',
              fontSize: '0.9rem',
              marginTop: '-1rem',
            }}
          >
            Forgot Password?
          </Link>

          <button 
            type="submit" 
            style={styles.button} 
            className="btn-hover"
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={styles.loadingSpinner} />
                Signing In...
              </>
            ) : (
              <>
                🚀 Sign In
              </>
            )}
          </button>

          {message && (
            <p style={message.includes('failed') ? styles.errorMessage : styles.message}>
              {message.includes('failed') ? '❌' : '✅'} {message}
            </p>
          )}

          <div style={styles.registerLink}>
            <div style={{ marginBottom: '1rem' }}>
              🆕 Don't have an account?{' '}
              <Link to="/register" style={styles.link} className="link-hover">
                Create one here
              </Link>
            </div>
            <div>
              👑 Are you an admin?{' '}
              <Link to="/admin-login" style={styles.link} className="link-hover">
                Admin Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 