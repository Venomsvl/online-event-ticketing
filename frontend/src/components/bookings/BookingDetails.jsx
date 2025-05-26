import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCalendar, FaTicketAlt, FaClock, FaMapMarkerAlt, FaUser, FaDollarSign, FaCheckCircle, FaTimesCircle, FaDownload, FaShare, FaCalendarPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookingDetails = ({ booking, isModal, onClose }) => {
  const styles = {
    container: {
      ...(isModal ? {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 1000,
      } : {
        width: '100%',
        maxWidth: '800px',
        margin: '2rem auto',
        minHeight: '60vh',
      }),
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '2rem',
      color: '#fff',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(5px)',
      zIndex: 999,
    },
    header: {
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      paddingBottom: '1rem',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 50%, #E9D5FF 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem',
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      color: '#fff',
      fontSize: '1.5rem',
      cursor: 'pointer',
      opacity: 0.7,
      transition: 'opacity 0.3s ease',
      '&:hover': {
        opacity: 1,
      },
    },
    section: {
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#977DFF',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    icon: {
      fontSize: '1.2rem',
      color: '#977DFF',
    },
    label: {
      fontSize: '0.9rem',
      opacity: 0.7,
    },
    value: {
      fontSize: '1.1rem',
      fontWeight: '500',
    },
    status: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    statusActive: {
      background: 'rgba(34, 197, 94, 0.2)',
      color: '#22c55e',
      border: '1px solid rgba(34, 197, 94, 0.3)',
    },
    statusCancelled: {
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
  };

  const [bookingStatus, setBookingStatus] = useState(booking.status);
  const [availableTickets, setAvailableTickets] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const actionButton = {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    '&:hover': {
      background: 'rgba(239, 68, 68, 0.3)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  const ticketAvailability = {
    container: {
      padding: '1rem',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.05)',
      marginBottom: '1rem',
    },
    text: {
      color: '#22c55e',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    warning: {
      color: '#f59e0b',
    },
    soldOut: {
      color: '#ef4444',
    },
  };

  const fetchAvailableTickets = async () => {
    try {
      const response = await axios.get(`/api/events/${booking.event._id}/availability`);
      setAvailableTickets(response.data.availableTickets);
    } catch (error) {
      console.error('Failed to fetch ticket availability:', error);
    }
  };

  const handleCancelBooking = async () => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/bookings/${booking._id}/cancel`);
      setBookingStatus('cancelled');
      toast.success('Booking cancelled successfully');
      await fetchAvailableTickets();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(errorMessage);
      console.error('Cancel booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableTickets();
    const interval = setInterval(fetchAvailableTickets, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [booking.event._id]);

  if (!booking) return null;

  const getStatusStyle = (status) => {
    return status === 'active' ? styles.statusActive : styles.statusCancelled;
  };

  const formatDate = (date) => {
    return format(new Date(date), 'PPP');
  };

  const formatTime = (date) => {
    return format(new Date(date), 'p');
  };

  const errorMessages = {
    404: 'Booking not found',
    403: 'You are not authorized to view this booking',
    // Add more specific error messages
  };

  return (
    <>
      {isModal && <div style={styles.overlay} onClick={onClose} />}
      <div style={styles.container}>
        {isModal && (
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}

        <div style={styles.header}>
          <h1 style={styles.title}>{booking.event.title}</h1>
          <div style={{ ...styles.status, ...getStatusStyle(bookingStatus) }}>
            {bookingStatus === 'active' ? (
              <>
                <FaCheckCircle /> Active
              </>
            ) : (
              <>
                <FaTimesCircle /> Cancelled
              </>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Event Details</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <FaCalendar style={styles.icon} />
              <div>
                <div style={styles.label}>Date</div>
                <div style={styles.value}>{formatDate(booking.event.date)}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <FaClock style={styles.icon} />
              <div>
                <div style={styles.label}>Time</div>
                <div style={styles.value}>{formatTime(booking.event.date)}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <FaMapMarkerAlt style={styles.icon} />
              <div>
                <div style={styles.label}>Venue</div>
                <div style={styles.value}>{booking.event.venue}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Booking Information</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <FaTicketAlt style={styles.icon} />
              <div>
                <div style={styles.label}>Tickets</div>
                <div style={styles.value}>{booking.quantity}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <FaDollarSign style={styles.icon} />
              <div>
                <div style={styles.label}>Total Amount</div>
                <div style={styles.value}>${booking.totalAmount}</div>
              </div>
            </div>
            <div style={styles.infoItem}>
              <FaUser style={styles.icon} />
              <div>
                <div style={styles.label}>Booked By</div>
                <div style={styles.value}>{booking.user.name}</div>
              </div>
            </div>
          </div>
        </div>

        {bookingStatus === 'active' && (
          <div style={ticketAvailability.container}>
            {availableTickets !== null && (
              <div style={{
                ...ticketAvailability.text,
                ...(availableTickets === 0 
                  ? ticketAvailability.soldOut 
                  : availableTickets < 10 
                    ? ticketAvailability.warning 
                    : {})
              }}>
                <FaTicketAlt />
                {availableTickets === 0 
                  ? 'Sold Out' 
                  : availableTickets < 10 
                    ? `Only ${availableTickets} tickets left!` 
                    : `${availableTickets} tickets available`}
              </div>
            )}
          </div>
        )}

        {bookingStatus === 'active' && (
          <div style={styles.section}>
            <button 
              style={{
                ...actionButton,
                background: 'rgba(151, 125, 255, 0.1)',
                color: '#977DFF',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onClick={() => {
                const event = {
                  title: booking.event.title,
                  description: `Your booking for ${booking.event.title}. Tickets: ${booking.quantity}`,
                  location: booking.event.venue,
                  startTime: new Date(booking.event.date),
                  endTime: new Date(new Date(booking.event.date).getTime() + 2 * 60 * 60 * 1000),
                };
                const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.startTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${event.endTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`;
                window.open(googleCalendarUrl, '_blank');
                toast.success('Opening Google Calendar...');
              }}
            >
              <FaCalendarPlus /> Add to Calendar
            </button>
            <button 
              style={{
                ...actionButton,
                background: 'rgba(151, 125, 255, 0.1)',
                color: '#977DFF',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onClick={async () => {
                try {
                  if (navigator.share) {
                    await navigator.share({
                      title: `Booking for ${booking.event.title}`,
                      text: `Check out my booking for ${booking.event.title} on ${formatDate(booking.event.date)}!`,
                      url: window.location.href
                    });
                  } else {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success('Booking link copied to clipboard!');
                  }
                } catch (error) {
                  toast.error('Failed to share booking');
                }
              }}
            >
              <FaShare /> Share Booking
            </button>
            <button 
              style={actionButton}
              onClick={handleCancelBooking}
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

BookingDetails.propTypes = {
  booking: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    event: PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      venue: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    quantity: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['active', 'cancelled']).isRequired,
  }),
  isModal: PropTypes.bool,
  onClose: PropTypes.func,
};

BookingDetails.defaultProps = {
  isModal: false,
  onClose: () => {},
};

export default BookingDetails; 