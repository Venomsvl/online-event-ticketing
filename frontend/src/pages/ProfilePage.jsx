import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaTicketAlt } from 'react-icons/fa';
import UpdateProfileForm from '../components/profile/UpdateProfileForm';
import { Link } from 'react-router-dom';
import BookingDetails from '../components/bookings/BookingDetails';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      await updateUser(updatedData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.put(`/api/v1/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

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
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
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
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'rgba(255,255,255,0.7)',
      '&:hover': {
        color: '#fff',
      },
    },
    activeTab: {
      borderBottom: '2px solid #977DFF',
      color: '#977DFF',
    },
    bookingCard: {
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1rem',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease',
    },
    bookingTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '1rem',
    },
    bookingInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      color: 'rgba(255,255,255,0.8)',
    },
    button: {
      background: '#ff6b6b',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1rem',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(255,107,107,0.4)',
      },
    },
    loadingText: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.7)',
      fontSize: '1.1rem',
      margin: '2rem 0',
    }
  };

  const BookingItem = ({ booking }) => (
    <div style={styles.bookingCard}>
      <h3 style={styles.bookingTitle}>{booking.event.title}</h3>
      <div style={styles.bookingInfo}>
        <p>Date: {new Date(booking.event.date).toLocaleDateString()}</p>
        <p>Time: {new Date(booking.event.date).toLocaleTimeString()}</p>
        <p>Tickets: {booking.quantity}</p>
        <p>Status: {booking.status}</p>
      </div>
      {booking.status === 'confirmed' && (
        <button
          onClick={() => cancelBooking(booking._id)}
          style={styles.button}
        >
          Cancel Booking
        </button>
      )}
    </div>
  );

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loadingText}>Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1>My Profile</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem' }}>
            Manage your profile and bookings
          </p>
        </div>
        
        <div style={styles.tabs}>
          <div
            style={{
              ...styles.tab,
              ...(activeTab === 'profile' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile Settings
          </div>
          {user?.role !== 'admin' && (
            <div
              style={{
                ...styles.tab,
                ...(activeTab === 'bookings' ? styles.activeTab : {})
              }}
              onClick={() => setActiveTab('bookings')}
            >
              <FaTicketAlt /> My Bookings
            </div>
          )}
        </div>

        {activeTab === 'profile' && (
          <UpdateProfileForm user={user} onUpdateSuccess={handleProfileUpdate} />
        )}

        {activeTab === 'bookings' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>My Bookings</h2>
            {loading ? (
              <div style={styles.loadingText}>Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                No bookings found.
              </p>
            ) : (
              bookings.map(booking => (
                <BookingItem key={booking._id} booking={booking} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 