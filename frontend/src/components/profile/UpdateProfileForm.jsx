import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error('Current password is required to change password');
        return false;
      }

      if (formData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long');
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare update data
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Make API call to update profile
      const response = await axios.put('/api/v1/users/profile', updateData);
      
      // Clear sensitive fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      // Update parent component with new user data
      onUpdateSuccess(response.data);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Current password is incorrect');
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto'
    },
    inputGroup: {
      position: 'relative',
      width: '100%'
    },
    icon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255,255,255,0.6)',
      zIndex: 1
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
      '&:hover': {
        borderColor: 'rgba(151,125,255,0.5)',
        background: 'rgba(255,255,255,0.15)'
      },
      '&:focus': {
        borderColor: '#977DFF',
        background: 'rgba(255,255,255,0.2)',
        boxShadow: '0 0 0 2px rgba(151,125,255,0.2)'
      }
    },
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255,255,255,0.6)',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: '0.25rem'
    },
    button: {
      background: 'linear-gradient(135deg, #977DFF 0%, #6F3AFF 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(151,125,255,0.4)'
      },
      '&:disabled': {
        opacity: 0.7,
        cursor: 'not-allowed'
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <FaUser style={styles.icon} />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          style={styles.input}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <FaEnvelope style={styles.icon} />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          style={styles.input}
          required
        />
      </div>

      <div style={styles.inputGroup}>
        <FaLock style={styles.icon} />
        <input
          type={showPassword.current ? "text" : "password"}
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Current Password (required for password change)"
          style={styles.input}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('current')}
          style={styles.passwordToggle}
        >
          {showPassword.current ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div style={styles.inputGroup}>
        <FaLock style={styles.icon} />
        <input
          type={showPassword.new ? "text" : "password"}
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="New Password (optional)"
          style={styles.input}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('new')}
          style={styles.passwordToggle}
        >
          {showPassword.new ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div style={styles.inputGroup}>
        <FaLock style={styles.icon} />
        <input
          type={showPassword.confirm ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
          style={styles.input}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility('confirm')}
          style={styles.passwordToggle}
        >
          {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
        </button>
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

UpdateProfileForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  }),
  onUpdateSuccess: PropTypes.func.isRequired
};

export default UpdateProfileForm; 