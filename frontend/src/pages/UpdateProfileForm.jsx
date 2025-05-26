import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

const UpdateProfileForm = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'rgba(255,255,255,0.9)',
      fontSize: '0.9rem',
    },
    inputWrapper: {
      position: 'relative',
      width: '100%',
    },
    input: {
      width: '100%',
      background: 'rgba(255,255,255,0.1)',
      border: '1.5px solid rgba(151,125,255,0.3)',
      borderRadius: '12px',
      color: '#fff',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    icon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255,255,255,0.6)',
    },
    togglePassword: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: 'rgba(255,255,255,0.6)',
      cursor: 'pointer',
      padding: '0.25rem',
    },
    error: {
      color: '#ff6b6b',
      fontSize: '0.8rem',
      marginTop: '0.25rem',
    },
    button: {
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(151,125,255,0.4)',
      },
      '&:disabled': {
        opacity: 0.7,
        cursor: 'not-allowed',
      },
    },
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password validation (only if user is trying to change password)
    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters long';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
        newErrors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await axios.put('/api/users/profile', updateData);
      toast.success('Profile updated successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setShowPassword({
        current: false,
        new: false,
        confirm: false
      });
      if (onUpdateSuccess) {
        onUpdateSuccess(updateData);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      if (errorMessage.includes('password')) {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'Current password is incorrect'
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>
          <FaUser /> Name
        </label>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Enter your name"
          />
          <FaUser style={styles.icon} />
        </div>
        {errors.name && <span style={styles.error}>{errors.name}</span>}
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>
          <FaEnvelope /> Email
        </label>
        <div style={styles.inputWrapper}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={styles.input}
            placeholder="Enter your email"
          />
          <FaEnvelope style={styles.icon} />
        </div>
        {errors.email && <span style={styles.error}>{errors.email}</span>}
      </div>

      <div style={{ ...styles.inputGroup, marginTop: '1rem' }}>
        <h3>Change Password</h3>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <FaLock /> Current Password
          </label>
          <div style={styles.inputWrapper}>
            <input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter current password"
            />
            <FaLock style={styles.icon} />
            <button
              type="button"
              style={styles.togglePassword}
              onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
            >
              {showPassword.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.currentPassword && <span style={styles.error}>{errors.currentPassword}</span>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <FaLock /> New Password
          </label>
          <div style={styles.inputWrapper}>
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter new password"
            />
            <FaLock style={styles.icon} />
            <button
              type="button"
              style={styles.togglePassword}
              onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.newPassword && <span style={styles.error}>{errors.newPassword}</span>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <FaLock /> Confirm New Password
          </label>
          <div style={styles.inputWrapper}>
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Confirm new password"
            />
            <FaLock style={styles.icon} />
            <button
              type="button"
              style={styles.togglePassword}
              onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
            >
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
        </div>
      </div>

      <button
        type="submit"
        style={styles.button}
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default UpdateProfileForm;