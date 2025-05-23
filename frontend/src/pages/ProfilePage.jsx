import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 50%, #0600AB 100%)',
      padding: '2rem',
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      background: 'rgba(255,255,255,0.18)',
      borderRadius: '28px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
      border: '1.5px solid rgba(151,125,255,0.3)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '2rem',
      color: '#fff',
    },
    tabs: {
      display: 'flex',
      marginBottom: '2rem',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
    },
    tab: {
      padding: '1rem 2rem',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      transition: 'all 0.3s ease',
    },
    activeTab: {
      borderBottom: '2px solid #977DFF',
      color: '#977DFF',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    input: {
      background: 'rgba(255,255,255,0.7)',
      border: '1.5px solid #977DFF',
      borderRadius: '12px',
      color: '#0033FF',
      padding: '0.75rem',
      fontSize: '1rem',
      outline: 'none',
    },
    button: {
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    bookingCard: {
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      border: '1px solid rgba(255,255,255,0.2)',
    },
  };

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
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
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1>My Profile</h1>
        
        <div style={styles.tabs}>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'profile' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('profile')}
          >
            Profile Settings
          </div>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'bookings' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </div>
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password (leave blank if not changing)"
              value={formData.currentPassword}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              style={styles.input}
            />
            <button
              type="submit"
              disabled={loading}
              style={styles.button}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2>My Event Bookings</h2>
            {bookings.length === 0 ? (
              <p>No bookings found</p>
            ) : (
              bookings.map(booking => (
                <div key={booking._id} style={styles.bookingCard}>
                  <h3>{booking.event?.title || 'Event Not Found'}</h3>
                  <p>Date: {new Date(booking.event?.date).toLocaleDateString()}</p>
                  <p>Tickets: {booking.quantity} x {booking.ticketType}</p>
                  <p>Total: ${booking.totalAmount}</p>
                  <p>Status: {booking.status}</p>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      style={{
                        ...styles.button,
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'
                      }}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 