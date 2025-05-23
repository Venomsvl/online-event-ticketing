import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const styles = {
  container: {
    backgroundColor: '#000000',
    color: '#ffffff'
  },
  eventSection: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    }
  },
  eventInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  eventCard: {
    backgroundColor: '#4C1D95',
    borderRadius: '0.5rem',
    padding: '1.5rem'
  },
  imageContainer: {
    position: 'relative',
    height: '16rem',
    marginBottom: '1.5rem'
  },
  eventImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '0.5rem'
  },
  dateBadge: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    backgroundColor: '#7C3AED',
    color: '#ffffff',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px'
  },
  eventTitle: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  eventDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    color: '#E9D5FF'
  },
  detailText: {
    fontSize: '1.125rem'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  icon: {
    width: '1.25rem',
    height: '1.25rem'
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#C4B5FD'
  },
  bookingForm: {
    backgroundColor: '#4C1D95',
    borderRadius: '0.5rem',
    padding: '1.5rem'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#E9D5FF'
  },
  input: {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#6D28D9',
    border: '1px solid #7C3AED',
    color: '#ffffff',
    outline: 'none',
    '&:focus': {
      boxShadow: '0 0 0 2px #C4B5FD'
    }
  },
  select: {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#6D28D9',
    border: '1px solid #7C3AED',
    color: '#ffffff',
    outline: 'none',
    '&:focus': {
      boxShadow: '0 0 0 2px #C4B5FD'
    }
  },
  totalSection: {
    paddingTop: '1rem'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  totalLabel: {
    color: '#E9D5FF'
  },
  totalAmount: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#C4B5FD'
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#7C3AED',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#6D28D9'
    },
    '&:focus': {
      outline: 'none',
      boxShadow: '0 0 0 2px #C4B5FD'
    }
  },
  loading: {
    textAlign: 'center',
    padding: '3rem 0'
  }
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [formData, setFormData] = useState({
    ticketType: 'standard',
    quantity: 1,
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEventData(data);
      } else {
        // Fallback to sample data if API fails
        setEventData({
          id: 1,
          title: 'Summer Music Festival',
          description: 'Join us for an unforgettable evening of live music featuring top artists from around the world. Experience amazing performances, great food, and create lasting memories.',
          date: '2024-07-15',
          time: '18:00',
          location: 'Central Park',
          image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&h=300&fit=crop',
          price: 50.00
        });
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
  };

  const calculateTotal = () => {
    const { quantity, ticketType } = formData;
    const basePrice = eventData?.price || 0;
    const vipMultiplier = ticketType === 'vip' ? 2 : 1;
    return (quantity * basePrice * vipMultiplier).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3004/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          eventId: id,
          totalAmount: calculateTotal()
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Booking successful! You will receive a confirmation email shortly.');
        setTimeout(() => {
          navigate('/booking-confirmation');
        }, 2000);
      } else {
        throw new Error(data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error details:', error);
      toast.error('There was an error processing your booking: ' + error.message);
    }
  };

  if (!eventData) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Event Details Section */}
      <div style={styles.eventSection}>
        <div style={styles.grid}>
          {/* Event Information */}
          <div style={styles.eventInfo}>
            <div style={styles.eventCard}>
              <div style={styles.imageContainer}>
                <img
                  src={eventData.image}
                  alt={eventData.title}
                  style={styles.eventImage}
                />
                <div style={styles.dateBadge}>
                  {formatDate(eventData.date)}
                </div>
              </div>
              <h1 style={styles.eventTitle}>{eventData.title}</h1>
              <div style={styles.eventDetails}>
                <p style={styles.detailText}>{eventData.description}</p>
                <div style={styles.detailItem}>
                  <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>{eventData.location}</span>
                </div>
                <div style={styles.detailItem}>
                  <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{eventData.date} at {eventData.time}</span>
                </div>
                <div style={styles.detailItem}>
                  <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                  </svg>
                  <span style={styles.price}>${eventData.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div style={styles.bookingForm}>
            <h2 style={styles.formTitle}>Book Your Tickets</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="ticketType" style={styles.label}>
                  Ticket Type
                </label>
                <select
                  id="ticketType"
                  name="ticketType"
                  value={formData.ticketType}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                >
                  <option value="standard">Standard Ticket</option>
                  <option value="vip">VIP Ticket</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="quantity" style={styles.label}>
                  Number of Tickets
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="phone" style={styles.label}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.totalSection}>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total Amount:</span>
                  <span style={styles.totalAmount}>${calculateTotal()}</span>
                </div>
                <button
                  type="submit"
                  style={styles.submitButton}
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
