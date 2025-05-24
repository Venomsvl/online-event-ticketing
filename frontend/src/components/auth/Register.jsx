import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import theme from '../../styles/theme';
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
    isValid: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const passwordRequirements = [
    "At least 8 characters",
    "At least one letter",
    "At least one number"
  ];

  const validatePassword = (password) => {
    const minLength = 8;
    // Match backend's regex pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z\d]/.test(password);

    let score = 0;
    let feedback = [];

    if (password.length >= minLength) score += 1;
    else feedback.push(`At least ${minLength} characters`);

    if (hasLetter) score += 1;
    else feedback.push('At least one letter');

    if (hasNumber) score += 1;
    else feedback.push('At least one number');

    // Add bonus point for special characters
    if (hasSpecialChar) score += 1;

    return {
      score: Math.min(score, 3), // Cap at 3 for display purposes
      feedback: feedback.join(', '),
      isValid: password.length >= minLength && hasLetter && hasNumber
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
    setMessage('');

    // Validate form
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    
    // Password validation matching backend requirements
    if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else {
      const hasLetter = /[a-zA-Z]/.test(form.password);
      const hasNumber = /\d/.test(form.password);
      
      if (!hasLetter || !hasNumber) {
        newErrors.password = 'Password must contain at least one letter and one number';
      }
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading('Creating your account...');
      
      // Register user
      const response = await axios.post('/api/auth/register', {
        name: form.name,
        email: form.email.toLowerCase().trim(),
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
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    
    } catch (err) {
      console.error('Registration error:', err);
      
      // Show error toast
      toast.error(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const validationErrors = {};
        err.response.data.errors.forEach(error => {
          validationErrors[error.path] = error.msg;
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
        return 'Weak';
      case 2:
        return 'Medium';
      case 3:
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return '#FFCCF2'; // Light pink from theme
      case 2:
        return '#977DFF'; // Purple from theme
      case 3:
        return '#0033FF'; // Blue from theme
      default:
        return '#d1d5db'; // gray
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
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '2rem',
    },
    container: {
      maxWidth: '480px',
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
      marginBottom: '2.5rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 50%, #E9D5FF 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
      textShadow: '0 0 30px rgba(151, 125, 255, 0.5)',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.7)',
      textAlign: 'center',
      marginBottom: '2rem',
      marginTop: '-1.5rem'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      position: 'relative',
    },
    label: {
      fontSize: '1.1rem',
      color: '#C4B5FD',
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
      fontWeight: 500,
      outline: 'none',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
    select: {
      background: 'rgba(255,255,255,0.18)',
      border: '2px solid rgba(151, 125, 255, 0.5)',
      borderRadius: '12px',
      color: '#ffffff',
      padding: '1rem 1.5rem',
      fontSize: '1.1rem',
      cursor: 'pointer',
      fontWeight: 600,
      outline: 'none',
      boxShadow: '0 4px 20px rgba(151, 125, 255, 0.2), inset 0 2px 8px rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(15px)',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
      backgroundPosition: 'right 1rem center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.8em 1.8em',
      paddingRight: '3.5rem',
      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    },
    selectFocus: {
      background: 'rgba(255,255,255,0.25)',
      border: '2px solid #977DFF',
      boxShadow: '0 0 0 4px rgba(151, 125, 255, 0.3), 0 6px 25px rgba(151, 125, 255, 0.4)',
      transform: 'scale(1.02)',
    },
    passwordToggle: {
      position: 'absolute',
      right: '1.25rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      background: 'none',
      border: 'none',
      color: '#977DFF',
      padding: 0,
      fontSize: '1.25rem',
      height: 32,
      width: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderRadius: '6px',
    },
    button: {
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontWeight: 700,
      padding: '1rem 2rem',
      fontSize: '1.1rem',
      marginTop: '1rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
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
      fontWeight: 600,
      marginTop: '0.5rem',
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    strengthBar: {
      height: '6px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: '3px',
      marginTop: '0.75rem',
      overflow: 'hidden',
      backdropFilter: 'blur(5px)',
    },
    strengthFill: {
      height: '100%',
      transition: 'all 0.3s ease',
      borderRadius: '3px',
    },
    strengthText: {
      fontSize: '1rem',
      fontWeight: 600,
      marginTop: '0.5rem',
      display: 'inline-block',
    },
    requirementsPopup: {
      position: 'absolute',
      right: '-240px',
      top: '0',
      width: '220px',
      backgroundColor: 'rgba(255,255,255,0.95)',
      padding: '1rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: 1000,
      border: '1px solid rgba(151, 125, 255, 0.2)',
      backdropFilter: 'blur(20px)',
    },
    requirementItem: {
      fontSize: '0.9rem',
      color: '#1f2937',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: '500',
    },
    requirementIcon: {
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#10b981',
      fontWeight: '600',
    },
    loadingSpinner: {
      width: '24px',
      height: '24px',
      border: '3px solid rgba(255,255,255,0.3)',
      borderTop: '3px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    loginLink: {
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
    requirements: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '0.95rem',
      marginTop: '0.5rem',
      fontWeight: 500,
      textAlign: 'left',
      backgroundColor: 'rgba(151, 125, 255, 0.1)',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid rgba(151, 125, 255, 0.2)',
      backdropFilter: 'blur(10px)',
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
        .select-focus:focus {
          border-color: #977DFF;
          box-shadow: 0 0 0 3px rgba(151, 125, 255, 0.2);
          background: rgba(255,255,255,0.15);
        }
        .logo-hover:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 12px 24px rgba(151, 125, 255, 0.7));
        }
        select option {
          background: rgba(26, 26, 46, 0.95) !important;
          color: #ffffff !important;
          padding: 8px 12px !important;
          font-weight: 600 !important;
          border: none !important;
          backdrop-filter: blur(10px) !important;
        }
        select option:hover {
          background: rgba(151, 125, 255, 0.8) !important;
          color: #ffffff !important;
        }
        select option:checked {
          background: linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%) !important;
          color: #ffffff !important;
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
        <h1 style={styles.title}>🎉 Create Your Account</h1>
        <p style={styles.subtitle}>✨ Join our community and discover amazing events</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>👤 Full Name</label>
            <input
              placeholder="Enter your full name"
              style={{ ...styles.input, ...(errors.name ? { border: '1px solid #fbbf24' } : {}) }}
              className="input-focus"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
            {errors.name && <span style={styles.error}>⚠️ {errors.name}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>📧 Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              style={{ ...styles.input, ...(errors.email ? { border: '1px solid #fbbf24' } : {}) }}
              className="input-focus"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
            />
            {errors.email && <span style={styles.error}>⚠️ {errors.email}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔐 Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                style={{ ...styles.input, width: '100%', paddingRight: '3.5rem', ...(errors.password ? { border: '1px solid #fbbf24' } : {}) }}
                className="input-focus"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
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
            
            {form.password && (
              <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 8 }}>
                {[1,2,3].map((seg) => (
                  <div
                    key={seg}
                    style={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      background: passwordStrength.score >= seg ? getStrengthColor(passwordStrength.score) : 'rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease',
                      boxShadow: passwordStrength.score >= seg ? '0 0 8px rgba(151,125,255,0.3)' : 'none'
                    }}
                  />
                ))}
              </div>
            )}
            
            {form.password && (
              <div style={{
                color: getStrengthColor(passwordStrength.score),
                fontWeight: 600,
                fontSize: '1rem',
                marginBottom: 8,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔒 Password Strength: {getStrengthLabel(passwordStrength.score)}
              </div>
            )}
            
            {form.password && !passwordStrength.isValid && (
              <div style={styles.requirements}>
                💡 Password must be at least 8 characters long and contain at least one letter and one number. Special characters are recommended for better security.
              </div>
            )}
            
            {showPasswordRequirements && (
              <div style={styles.requirementsPopup}>
                <div style={{ marginBottom: '8px', fontWeight: '600', color: '#1f2937' }}>
                  📋 Password Requirements:
                </div>
                {passwordRequirements.map((req, index) => (
                  <div key={index} style={styles.requirementItem}>
                    <div style={styles.requirementIcon}>
                      {form.password && validatePassword(form.password).score >= index + 1 ? '✅' : '⭕'}
                    </div>
                    {req}
                  </div>
                ))}
              </div>
            )}
            {errors.password && <span style={styles.error}>⚠️ {errors.password}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔐 Confirm Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                style={{ ...styles.input, width: '100%', paddingRight: '3.5rem', ...(errors.confirmPassword ? { border: '1px solid #fbbf24' } : {}) }}
                className="input-focus"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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
            {errors.confirmPassword && <span style={styles.error}>⚠️ {errors.confirmPassword}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>👥 Account Type</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ ...styles.select, ...(isSelectFocused ? styles.selectFocus : {}), ...(errors.role ? { border: '1px solid #fbbf24' } : {}) }}
              className="select-focus"
              disabled={loading}
              onFocus={() => setIsSelectFocused(true)}
              onBlur={() => setIsSelectFocused(false)}
            >
              <option value="user">🎫 Event Attendee</option>
              <option value="organizer">🎪 Event Organizer</option>
            </select>
            {errors.role && <span style={styles.error}>⚠️ {errors.role}</span>}
          </div>

          <button 
            type="submit" 
            style={styles.button} 
            className="btn-hover"
            disabled={loading}
          >
            {loading ? (
              <>
                <div style={styles.loadingSpinner} />
                Creating Account...
              </>
            ) : (
              <>
                🚀 Create Account
              </>
            )}
          </button>

          {message && (
            <p style={message.includes('failed') ? styles.errorMessage : styles.message}>
              {message.includes('failed') ? '❌' : '✅'} {message}
            </p>
          )}

          <div style={styles.loginLink}>
            🔑 Already have an account?{' '}
            <Link to="/login" style={styles.link} className="link-hover">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 