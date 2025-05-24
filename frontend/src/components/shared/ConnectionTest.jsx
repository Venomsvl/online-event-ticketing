import React, { useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const ConnectionTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // Test v1 API connection
      const response = await axios.get('/api/v1/events');
      setTestResult({
        success: true,
        message: 'Backend v1 API connection successful!',
        data: `Received ${response.data?.length || 0} events from the database.`
      });
      toast.success('✅ Backend v1 API connection successful!');
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Backend v1 API connection failed!',
        error: error.message,
        details: error.response?.data?.message || 'No additional details'
      });
      toast.error('❌ Backend v1 API connection failed!');
    } finally {
      setLoading(false);
    }
  };

  const testAPIInfo = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // Test API info endpoint
      const response = await axios.get('/api/v1');
      setTestResult({
        success: true,
        message: 'API v1 documentation retrieved successfully!',
        data: `API Version: ${response.data?.version || 'Unknown'}\nMessage: ${response.data?.message || 'No message'}`
      });
      toast.success('✅ API v1 info retrieved!');
    } catch (error) {
      setTestResult({
        success: false,
        message: 'API v1 info request failed!',
        error: error.message,
        details: error.response?.data?.message || 'No additional details'
      });
      toast.error('❌ API v1 info request failed!');
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    
    try {
      // Test user registration with sample data using v1 API
      const testUser = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123',
        role: 'user'
      };
      
      const response = await axios.post('/api/v1/register', testUser);
      setTestResult({
        success: true,
        message: 'Test registration successful! User saved to MongoDB via v1 API.',
        data: `User ID: ${response.data?.user?.id}\nAPI Version: v1`
      });
      toast.success('✅ Registration test successful - Data saved to MongoDB via v1 API!');
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Registration test failed!',
        error: error.message,
        details: error.response?.data?.message || 'No additional details'
      });
      toast.error('❌ Registration test failed!');
    } finally {
      setLoading(false);
    }
  };

  const testBackwardCompatibility = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // Test backward compatibility with legacy API
      const response = await axios.get('/api/events');
      setTestResult({
        success: true,
        message: 'Backward compatibility test successful!',
        data: `Legacy API still works: Received ${response.data?.length || 0} events.`
      });
      toast.success('✅ Backward compatibility confirmed!');
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Backward compatibility test failed!',
        error: error.message,
        details: error.response?.data?.message || 'No additional details'
      });
      toast.error('❌ Backward compatibility test failed!');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '12px',
      margin: '2rem',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    title: {
      color: '#fff',
      marginBottom: '1rem',
      fontSize: '1.5rem'
    },
    buttonContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    button: {
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'opacity 0.2s'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    result: {
      marginTop: '1rem',
      padding: '1rem',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    success: {
      color: '#10b981'
    },
    error: {
      color: '#ef4444'
    },
    instructions: {
      marginTop: '1rem',
      color: '#fff',
      fontSize: '0.9rem'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔧 Frontend-Backend API v1 Connection Test</h2>
      
      <div style={styles.buttonContainer}>
        <button 
          onClick={testAPIInfo} 
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? 'Testing...' : 'Test API v1 Info'}
        </button>
        
        <button 
          onClick={testConnection} 
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? 'Testing...' : 'Test v1 Events API'}
        </button>
        
        <button 
          onClick={testRegistration} 
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? 'Testing...' : 'Test v1 Registration'}
        </button>
        
        <button 
          onClick={testBackwardCompatibility} 
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? 'Testing...' : 'Test Legacy API'}
        </button>
      </div>

      {testResult && (
        <div style={styles.result}>
          <h3 style={testResult.success ? styles.success : styles.error}>
            {testResult.message}
          </h3>
          {testResult.data && (
            <pre style={{ color: '#fff', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
              {testResult.data}
            </pre>
          )}
          {testResult.error && (
            <p style={styles.error}>Error: {testResult.error}</p>
          )}
          {testResult.details && (
            <p style={styles.error}>Details: {testResult.details}</p>
          )}
        </div>
      )}

      <div style={styles.instructions}>
        <p><strong>🎯 API v1 Structure:</strong></p>
        <ul style={{ fontSize: '0.8rem' }}>
          <li><strong>Auth:</strong> /api/v1/register, /api/v1/login</li>
          <li><strong>Users:</strong> /api/v1/users/profile, /api/v1/users/bookings</li>
          <li><strong>Events:</strong> /api/v1/events, /api/v1/events/:id</li>
          <li><strong>Bookings:</strong> /api/v1/bookings</li>
        </ul>
        <p><strong>📋 Instructions:</strong></p>
        <ul style={{ fontSize: '0.8rem' }}>
          <li>Make sure MongoDB is running</li>
          <li>Make sure backend server is running on http://localhost:3000</li>
          <li>All tests verify data interaction with MongoDB database</li>
          <li>Both v1 API and legacy API routes are available</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectionTest; 