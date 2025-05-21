import { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminLogin() {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Show loading toast
      const loadingToast = toast.loading('Logging in...');
      
      // First, attempt to login
      await axios.post('/api/auth/admin-login', form);
      
      // Then, update the auth context
      const userData = await login();
      
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
      
      // Navigate to profile
      navigate('/profile', { replace: true });
    } catch (err) {
      console.error('Admin login error:', err);
      
      // Show error toast
      toast.error(
        err.response?.data?.message === 'Invalid credentials'
          ? 'Invalid admin credentials'
          : err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
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
    <div className="adminlogin-outer" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', background: styles.outer.background }}>
      <style>{`
        .adminlogin-outer {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          width: 100vw;
          overflow-x: hidden;
        }
        .adminlogin-logo {
          position: fixed;
          top: 24px;
          left: 24px;
          z-index: 1000;
          height: 192px;
          width: auto;
          transition: all 0.2s;
        }
        .adminlogin-logo img {
          height: 192px;
          width: auto;
          display: block;
        }
        .adminlogin-card {
          margin-top: 80px;
          margin-bottom: 32px;
        }
        @media (max-width: 600px) {
          .adminlogin-logo {
            position: static !important;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 32px 0 24px 0;
            height: auto;
            width: 100%;
          }
          .adminlogin-logo img {
            height: 160px !important;
            max-width: 90vw;
            width: auto;
            display: block;
            margin: 0 auto;
          }
          .adminlogin-card {
            width: 100%;
            max-width: 400px;
            margin: 0 auto 32px auto;
            border-radius: 18px;
            box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
            background: rgba(255,255,255,0.18);
            padding: 1.5rem 1rem;
            box-sizing: border-box;
          }
        }
      `}</style>
      <div className="adminlogin-logo">
        <Link to="/">
          <img src="/LogoWhite.png" alt="Logo" />
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
        theme="light"
      />
      <div className="adminlogin-card" style={styles.container}>
        <h1 style={styles.title}>Admin Login</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              style={styles.input}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              disabled={loading}
            />
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

          <div style={styles.registerLink}>
            <span style={{ color: '#fff' }}>Not an admin? </span>
            <Link to="/login" style={styles.link}>
              User Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 