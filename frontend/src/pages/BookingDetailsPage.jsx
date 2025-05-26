import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import BookingDetails from '../components/bookings/BookingDetails';
import { FaArrowLeft } from 'react-icons/fa';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#977DFF',
      background: 'none',
      border: 'none',
      fontSize: '1rem',
      cursor: 'pointer',
      marginBottom: '2rem',
      transition: 'color 0.3s ease',
      '&:hover': {
        color: '#C4B5FD',
      },
    },
    error: {
      color: '#ef4444',
      textAlign: 'center',
      padding: '2rem',
      background: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '12px',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      maxWidth: '600px',
      margin: '2rem auto',
    },
    loading: {
      color: '#fff',
      textAlign: 'center',
      padding: '2rem',
    },
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/api/bookings/${id}`);
        setBooking(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading booking details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      <BookingDetails booking={booking} />
    </div>
  );
};

export default BookingDetailsPage; 