import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const styles = {
  container: {
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
  },
  eventSection: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '3rem 2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '3rem',
    '@media (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr',
      gap: '4rem'
    }
  },
  eventInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  eventCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid rgba(151, 125, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease'
  },
  imageContainer: {
    position: 'relative',
    height: '20rem',
    marginBottom: '2rem',
    borderRadius: '16px',
    overflow: 'hidden'
  },
  eventImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  dateBadge: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(151, 125, 255, 0.4)',
    backdropFilter: 'blur(10px)'
  },
  eventTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 50%, #E9D5FF 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(151, 125, 255, 0.5)'
  },
  eventDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    color: 'rgba(255,255,255,0.9)'
  },
  detailText: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '1rem'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(151, 125, 255, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(151, 125, 255, 0.2)',
    transition: 'all 0.3s ease'
  },
  icon: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#977DFF'
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#977DFF',
    textShadow: '0 0 10px rgba(151, 125, 255, 0.3)'
  },
  bookingForm: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '2.5rem',
    border: '1px solid rgba(151, 125, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    height: 'fit-content',
    position: 'sticky',
    top: '2rem'
  },
  formTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  label: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  input: {
    width: '100%',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(151, 125, 255, 0.3)',
    color: '#ffffff',
    outline: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(151, 125, 255, 0.3)',
    color: '#ffffff',
    outline: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23977DFF\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
    backgroundPosition: 'right 1rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '3rem',
    boxSizing: 'border-box'
  },
  totalSection: {
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(151, 125, 255, 0.2)'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1rem',
    background: 'rgba(151, 125, 255, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(151, 125, 255, 0.2)'
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1.1rem',
    fontWeight: '500'
  },
  totalAmount: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#977DFF',
    textShadow: '0 0 10px rgba(151, 125, 255, 0.3)'
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
    color: '#ffffff',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  loading: {
    textAlign: 'center',
    padding: '4rem 0',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '1.5rem'
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
    return (
      <div style={styles.loading}>
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(151, 125, 255, 0.2);
            border-top: 4px solid #977DFF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          `}
        </style>
        <div>
          <div className="spinner"></div>
          <p>✨ Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(151, 125, 255, 0.3);
        }
        .event-card:hover .event-image {
          transform: scale(1.05);
        }
        .detail-item:hover {
          background: rgba(151, 125, 255, 0.15);
          transform: translateX(5px);
        }
        .form-input:focus {
          border-color: #977DFF;
          box-shadow: 0 0 0 3px rgba(151, 125, 255, 0.2);
          background: rgba(255,255,255,0.15);
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(151, 125, 255, 0.4);
        }
        .submit-btn:active {
          transform: translateY(0);
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        `}
      </style>
      
      {/* Event Details Section */}
      <div style={styles.eventSection}>
        <div style={styles.grid}>
          {/* Event Information */}
          <div style={styles.eventInfo} className="fade-in">
            <div style={styles.eventCard} className="event-card">
              <div style={styles.imageContainer}>
                <img
                  src={eventData.image}
                  alt={eventData.title}
                  style={styles.eventImage}
                  className="event-image"
                />
                <div style={styles.dateBadge}>
                  📅 {formatDate(eventData.date)}
                </div>
              </div>
              <h1 style={styles.eventTitle}>🎪 {eventData.title}</h1>
              <div style={styles.eventDetails}>
                <p style={styles.detailText}>{eventData.description}</p>
                <div style={styles.detailItem} className="detail-item">
                  <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>📍 {eventData.location}</span>
                </div>
                <div style={styles.detailItem} className="detail-item">
                  <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>🕒 {eventData.date} at {eventData.time}</span>
                </div>
                <div style={styles.detailItem} className="detail-item">
                  <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                  </svg>
                  <span style={styles.price}>💰 ${eventData.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Booking Form */}
          <div style={styles.bookingForm} className="fade-in">
            <h2 style={styles.formTitle}>🎫 Book Your Tickets</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="ticketType" style={styles.label}>
                  🎭 Ticket Type
                </label>
                <select
                  id="ticketType"
                  name="ticketType"
                  value={formData.ticketType}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                  className="form-input"
                >
                  <option value="standard">🎟️ Standard Ticket - ${eventData.price.toFixed(2)}</option>
                  <option value="vip">👑 VIP Ticket - ${(eventData.price * 2).toFixed(2)}</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="quantity" style={styles.label}>
                  🔢 Number of Tickets
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
                  className="form-input"
                  placeholder="Enter number of tickets"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>
                  👤 Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>
                  📧 Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  className="form-input"
                  placeholder="Enter your email address"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="phone" style={styles.label}>
                  📱 Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </div>
              <div style={styles.totalSection}>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>💳 Total Amount:</span>
                  <span style={styles.totalAmount}>${calculateTotal()}</span>
                </div>
                <button
                  type="submit"
                  style={styles.submitButton}
                  className="submit-btn"
                >
                  🎫 Complete Booking
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
