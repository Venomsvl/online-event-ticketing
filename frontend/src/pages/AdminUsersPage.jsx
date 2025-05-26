import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Container, Alert, Spinner } from 'react-bootstrap';
import UserRow from '../components/admin/UserRow';
import { toast } from 'react-toastify';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/admin/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.patch(`/api/v1/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/v1/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      padding: '2rem 0',
    },
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '0 2rem',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 50%, #E9D5FF 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 0 30px rgba(151, 125, 255, 0.5)',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.7)',
      fontWeight: '400',
    },
    card: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(151, 125, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
    },
    tableHeader: {
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      padding: '1.5rem 2rem',
      borderBottom: '1px solid rgba(151, 125, 255, 0.3)',
    },
    tableHeaderGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 150px',
      gap: '1rem',
      alignItems: 'center',
    },
    headerCell: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    tableBody: {
      padding: '0',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: '#C4B5FD',
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: '4px solid rgba(196, 181, 253, 0.3)',
      borderTop: '4px solid #C4B5FD',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem',
    },
    loadingText: {
      fontSize: '1.1rem',
      fontWeight: '500',
    },
    errorContainer: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '2rem',
      textAlign: 'center',
      color: '#ff8a80',
    },
    errorIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    errorTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: 'rgba(255,255,255,0.6)',
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      opacity: '0.5',
    },
    emptyText: {
      fontSize: '1.2rem',
      fontWeight: '500',
    },
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          `}
        </style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <div style={styles.errorTitle}>Error Loading Users</div>
            <div>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👥 User Management</h1>
          <p style={styles.subtitle}>Manage user accounts and permissions</p>
        </div>
        
        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <div style={styles.tableHeaderGrid}>
              <div style={styles.headerCell}>Name</div>
              <div style={styles.headerCell}>Email</div>
              <div style={styles.headerCell}>Role</div>
              <div style={styles.headerCell}>Status</div>
              <div style={styles.headerCell}>Actions</div>
            </div>
          </div>
          
          <div style={styles.tableBody}>
            {users.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>👤</div>
                <div style={styles.emptyText}>No users found</div>
              </div>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  onUpdateRole={handleUpdateRole}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage; 