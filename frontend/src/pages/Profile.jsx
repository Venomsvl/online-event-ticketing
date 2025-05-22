import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import colors from '../styles/colors';

export default function Profile() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
  });
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/users/profile', form);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '40px auto',
      padding: '40px',
      boxShadow: `0 4px 6px -1px ${colors.gunmetal}22`,
      borderRadius: '16px',
      backgroundColor: colors.white,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '32px',
      color: colors.gunmetal,
      fontWeight: '600',
    },
    editButton: {
      padding: '8px 16px',
      backgroundColor: colors.gunmetal,
      color: colors.white,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '16px',
      color: colors.gunmetal,
      fontWeight: '500',
    },
    input: {
      padding: '12px',
      border: `1px solid ${colors.desertSand}`,
      borderRadius: '8px',
      fontSize: '16px',
      width: '100%',
      background: colors.timberwolf,
      color: colors.gunmetal,
      transition: 'border-color 0.2s',
      outline: 'none',
    },
    info: {
      fontSize: '16px',
      color: colors.gunmetal,
      padding: '12px',
      backgroundColor: colors.timberwolf,
      borderRadius: '8px',
    },
    message: {
      marginTop: '16px',
      textAlign: 'center',
      color: colors.gunmetal,
      fontSize: '16px',
    },
    errorMessage: {
      marginTop: '16px',
      textAlign: 'center',
      color: colors.burntSienna,
      fontSize: '16px',
    },
    role: {
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: colors.desertSand,
      borderRadius: '9999px',
      fontSize: '14px',
      color: colors.gunmetal,
      textTransform: 'capitalize',
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile</h1>
        <button
          style={styles.editButton}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.editButton}>
            Save Changes
          </button>
        </form>
      ) : (
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <div style={styles.info}>{user?.name}</div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.info}>{user?.email}</div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <div style={styles.role}>{user?.role}</div>
          </div>
        </div>
      )}

      {message && (
        <p style={message.includes('Failed') ? styles.errorMessage : styles.message}>
          {message}
        </p>
      )}
    </div>
  );
} 