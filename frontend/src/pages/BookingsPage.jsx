import React from 'react';
import UserBookingsPage from '../components/UserBookingsPage';
import UserBookingsPage from '../../../backend/src/components/UserBookingsPage';

const BookingsPage = () => {
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    header: {
      marginBottom: '2rem',
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '1rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#1f2937',
    },
    description: {
      color: '#6b7280',
      marginTop: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Bookings</h1>
        <p style={styles.description}>
          View and manage all your event bookings
        </p>
      </div>
      <UserBookingsPage />
    </div>
  );
};

export default BookingsPage; 