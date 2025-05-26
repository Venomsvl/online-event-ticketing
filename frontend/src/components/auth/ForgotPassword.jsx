import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/v1/auth/forgot-password', { email });
      toast.success('Password reset link has been sent to your email');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#ffffff',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      textAlign: 'center',
      color: '#1a1a1a',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4b5563',
    },
    input: {
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      fontSize: '1rem',
      '&:focus': {
        outline: 'none',
        borderColor: '#977DFF',
        boxShadow: '0 0 0 2px rgba(151, 125, 255, 0.2)',
      },
    },
    button: {
      padding: '0.75rem',
      backgroundColor: '#977DFF',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#8465FF',
      },
      '&:disabled': {
        backgroundColor: '#CBD5E0',
        cursor: 'not-allowed',
      },
    },
    backLink: {
      textAlign: 'center',
      marginTop: '1rem',
      color: '#977DFF',
      textDecoration: 'none',
      fontSize: '0.875rem',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Forgot Password</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
            style={styles.input}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={styles.button}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <a href="/login" style={styles.backLink}>
        Back to Login
      </a>
    </div>
  );
};

export default ForgotPassword; 