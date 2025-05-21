import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import theme from '../styles/theme';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const passwordRequirements = [
    "At least 6 characters",
    "One uppercase letter",
    "One lowercase letter",
    "One number",
    "One special character (!@#$%^&*(),.?\":{}|<>)"
  ];

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    let feedback = [];

    if (password.length >= minLength) score += 1;
    else feedback.push(`At least ${minLength} characters`);

    if (hasUpperCase) score += 1;
    else feedback.push('One uppercase letter');

    if (hasLowerCase) score += 1;
    else feedback.push('One lowercase letter');

    if (hasNumbers) score += 1;
    else feedback.push('One number');

    if (hasSpecialChar) score += 1;
    else feedback.push('One special character');

    return {
      score,
      feedback: feedback.join(', '),
    };
  };

  useEffect(() => {
    if (form.password) {
      setPasswordStrength(validatePassword(form.password));
    }
  }, [form.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validate form
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    if (passwordStrength.score < 2) newErrors.password = 'Password is too weak';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Creating your account...');
      
      // Register user
      await axios.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      
      // Update loading toast to success
      toast.update(loadingToast, {
        render: 'Registration successful!',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
      
      // Show redirecting toast
      toast.info('Redirecting to login...', {
        autoClose: 1000
      });
      
      // Automatically log in the user after registration
      await axios.post('/api/auth/login', {
        email: form.email,
        password: form.password
      }, { withCredentials: true });
      await login();
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      if (err.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = {};
        err.response.data.errors.forEach(error => {
          validationErrors[error.param] = error.msg;
        });
        setErrors(validationErrors);
        setMessage("Please fix the errors in the form.");
      } else {
        setMessage(err.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const segmentColors = [
    '#d1d5db', // gray for empty
    '#dc2626', // red
    '#f59e0b', // yellow
    '#10b981', // green
    '#059669', // darker green
    '#047857', // very strong
  ];

  const styles = {
    outer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFCCF2 0%, #977DFF 50%, #0033FF 100%)',
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
      marginBottom: '2rem',
      textAlign: 'center',
      color: '#fff',
      fontWeight: 700,
      letterSpacing: '0.5px',
      textShadow: '0 2px 8px rgba(0,0,0,0.12)',
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
      fontSize: '1.15rem',
      color: '#fff',
      fontWeight: '500',
      marginBottom: '0.25rem',
      textShadow: '0 1px 4px rgba(0,0,0,0.10)',
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
      transition: 'border 0.2s',
    },
    select: {
      background: 'rgba(255,255,255,0.7)',
      border: '1.5px solid #977DFF',
      borderRadius: '12px',
      color: '#0033FF',
      padding: '0.75rem',
      fontSize: '1rem',
      marginBottom: '0.5rem',
      boxSizing: 'border-box',
      cursor: 'pointer',
      fontWeight: 500,
      outline: 'none',
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)',
      transition: 'border 0.2s, box-shadow 0.2s, background 0.2s',
    },
    selectFocus: {
      background: 'rgba(255,255,255,0.95)',
      border: '2px solid #C8102E',
      boxShadow: '0 4px 24px 0 rgba(151,125,255,0.18)',
      color: '#0033FF',
    },
    passwordToggle: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      background: 'none',
      border: 'none',
      color: '#0033FF',
      padding: 0,
      fontSize: 22,
      height: 32,
      width: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      background: 'linear-gradient(90deg, #0033FF 0%, #977DFF 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '16px',
      fontWeight: 700,
      padding: '0.9rem 2rem',
      fontSize: '1.1rem',
      marginTop: '1rem',
      transition: 'background 0.2s',
      boxShadow: '0 2px 12px 0 rgba(0, 51, 255, 0.10)',
      letterSpacing: '0.5px',
    },
    message: {
      marginTop: '1rem',
      textAlign: 'center',
      color: '#fff',
      fontSize: '1rem',
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: 'rgba(151,125,255,0.18)',
      textShadow: '0 1px 4px rgba(0,0,0,0.10)',
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
      color: '#C8102E',
      fontSize: '1.05rem',
      fontWeight: 700,
      marginTop: '0.25rem',
    },
    strengthBar: {
      height: '4px',
      backgroundColor: '#977DFF',
      borderRadius: '2px',
      marginTop: '0.5rem',
      overflow: 'hidden',
    },
    strengthFill: {
      height: '100%',
      transition: 'all 0.2s',
    },
    strengthText: {
      fontSize: '0.95rem',
      fontWeight: 400,
      marginTop: '0.25rem',
      display: 'inline-block',
      // color will be set inline based on strength
    },
    requirementsPopup: {
      position: 'absolute',
      right: '-220px',
      top: '0',
      width: '200px',
      backgroundColor: theme.colors.white,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      boxShadow: theme.shadows.sm,
      zIndex: 1000,
    },
    requirementItem: {
      ...theme.typography.small,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    requirementIcon: {
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.colors.success,
    },
    loadingSpinner: {
      width: '20px',
      height: '20px',
      border: '2px solid #ffffff',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loginLink: {
      marginTop: '1.5rem',
      textAlign: 'center',
      fontSize: '0.95rem',
      color: '#fff',
    },
    link: {
      color: '#C8102E',
      textDecoration: 'none',
      fontWeight: '500',
      transition: theme.transitions.default,
    },
    requirements: {
      color: '#fff',
      fontSize: '0.95rem',
      marginTop: '0.25rem',
      fontWeight: 500,
      textAlign: 'left',
      textShadow: '0 1px 4px rgba(0,0,0,0.10)',
    },
  };

  return (
    <div className="register-outer" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', background: styles.outer.background }}>
      <style>{`
        .register-outer {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          width: 100vw;
          overflow-x: hidden;
        }
        .register-logo {
          position: fixed;
          top: 24px;
          left: 24px;
          z-index: 1000;
          height: 192px;
          width: auto;
          transition: all 0.2s;
        }
        .register-logo img {
          height: 192px;
          width: auto;
          display: block;
        }
        .register-card {
          margin-top: 80px;
          margin-bottom: 32px;
        }
        @media (max-width: 600px) {
          .register-logo {
            position: static !important;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 32px 0 24px 0;
            height: auto;
            width: 100%;
          }
          .register-logo img {
            height: 160px !important;
            max-width: 90vw;
            width: auto;
            display: block;
            margin: 0 auto;
          }
          .register-card {
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
      <div className="register-logo">
        <Link to="/">
          <img src="/LogoGradientDark.png" alt="Logo" />
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
      <div className="register-card" style={styles.container}>
        <h1 style={styles.title}>Create Your Account</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              placeholder="Enter your name"
              style={{ ...styles.input, ...(errors.name ? { border: '2px solid #C8102E' } : {}) }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
            {errors.name && <span style={styles.error}>{errors.name}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              style={{ ...styles.input, ...(errors.email ? { border: '2px solid #C8102E' } : {}) }}
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
                style={{ ...styles.input, width: '100%', paddingRight: 44, ...(errors.password ? { border: '2px solid #C8102E' } : {}) }}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
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
            <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 8 }}>
              {[1,2,3,4,5].map((seg) => (
                <div
                  key={seg}
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: passwordStrength.score >= seg ? '#C8102E' : '#ececec',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
            <div style={{
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.1rem',
              marginBottom: 8,
            }}>
              Password Strength: {getStrengthLabel(passwordStrength.score)}
            </div>
            {form.password && passwordStrength.score < 5 && (
              <div style={styles.requirements}>
                Password must contain at least 6 characters, including uppercase, lowercase, numbers, and special characters
              </div>
            )}
            {showPasswordRequirements && (
              <div style={styles.requirementsPopup}>
                <div style={{ marginBottom: '8px', fontWeight: '500', color: '#1f2937' }}>
                  Password Requirements:
                </div>
                {passwordRequirements.map((req, index) => (
                  <div key={index} style={styles.requirementItem}>
                    <div style={styles.requirementIcon}>
                      {form.password && validatePassword(form.password).score >= index + 1 ? '✓' : '○'}
                    </div>
                    {req}
                  </div>
                ))}
              </div>
            )}
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                style={{ ...styles.input, width: '100%', paddingRight: 44 }}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ ...styles.select, ...(isSelectFocused ? styles.selectFocus : {}), ...(errors.role ? { border: '2px solid #C8102E' } : {}) }}
              disabled={loading}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? (
              <>
                <div style={styles.loadingSpinner} />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {message && (
            <p style={message.includes('failed') ? styles.errorMessage : styles.message}>
              {message}
            </p>
          )}

          <div style={styles.loginLink}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 