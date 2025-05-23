import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    image: '',
    ticket_price: '',
    total_tickets: '',
    event_status: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '2rem',
      color: '#fff',
    },
    wrapper: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 1rem 0',
    },
    subtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '1.2rem',
      margin: 0,
    },
    form: {
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '25px',
      padding: '3rem',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(151, 125, 255, 0.3)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    label: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#C4B5FD',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    input: {
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(151, 125, 255, 0.3)',
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    textarea: {
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(151, 125, 255, 0.3)',
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      resize: 'vertical',
      minHeight: '120px',
    },
    select: {
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(151, 125, 255, 0.3)',
      background: 'rgba(26, 26, 46, 0.95)',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      cursor: 'pointer',
    },
    statusGroup: {
      background: 'rgba(151, 125, 255, 0.1)',
      border: '1px solid rgba(151, 125, 255, 0.3)',
      borderRadius: '15px',
      padding: '1.5rem',
    },
    statusLabel: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#977DFF',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '3rem',
      justifyContent: 'center',
    },
    button: {
      padding: '1rem 2.5rem',
      borderRadius: '12px',
      border: 'none',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(151, 125, 255, 0.4)',
    },
    secondaryButton: {
      background: 'rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(151,125,255,0.3)',
    },
    fullWidth: {
      gridColumn: '1 / -1',
    },
  };

  useEffect(() => {
    // Check user role from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        ticket_price: parseFloat(formData.ticket_price),
        total_tickets: parseInt(formData.total_tickets)
      };

      // Only include event_status if user is admin
      if (userRole !== 'System Admin') {
        delete submitData.event_status;
      }

      const response = await axios.post('/api/v1/events', submitData, {
        withCredentials: true
      });

      toast.success('🎉 Event created successfully!');
      navigate('/admin/events');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/events');
  };

  return (
    <div style={styles.container}>
      <style>
        {`
        .form-input:focus {
          border-color: #977DFF;
          box-shadow: 0 0 0 3px rgba(151, 125, 255, 0.2);
          background: rgba(255,255,255,0.1);
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(151, 125, 255, 0.5);
        }
        .secondary-btn:hover {
          background: rgba(255,255,255,0.15);
          border-color: #977DFF;
        }
        ::placeholder {
          color: rgba(255,255,255,0.5) !important;
        }
        select option {
          background: #1a1a2e !important;
          color: #ffffff !important;
          border: none !important;
          padding: 0.75rem !important;
        }
        select option:hover {
          background: rgba(151, 125, 255, 0.3) !important;
          color: #ffffff !important;
        }
        select option:checked {
          background: #977DFF !important;
          color: #ffffff !important;
        }
        `}
      </style>
      
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>✨ Create New Event</h1>
          <p style={styles.subtitle}>
            Fill out the details below to create an amazing event
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                🎪 Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                style={styles.input}
                className="form-input"
                placeholder="Enter event title"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                📍 Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={styles.input}
                className="form-input"
                placeholder="Enter event location"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                📅 Date & Time
              </label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                style={styles.input}
                className="form-input"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                🏷️ Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={styles.select}
                required
              >
                <option value="">Select a category</option>
                <option value="music">🎵 Music</option>
                <option value="sports">⚽ Sports</option>
                <option value="technology">💻 Technology</option>
                <option value="business">💼 Business</option>
                <option value="education">📚 Education</option>
                <option value="arts">🎨 Arts & Culture</option>
                <option value="food">🍽️ Food & Drink</option>
                <option value="health">🏥 Health & Wellness</option>
                <option value="entertainment">🎭 Entertainment</option>
                <option value="other">🔗 Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                💰 Ticket Price
              </label>
              <input
                type="number"
                name="ticket_price"
                value={formData.ticket_price}
                onChange={handleInputChange}
                style={styles.input}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                🎫 Total Tickets
              </label>
              <input
                type="number"
                name="total_tickets"
                value={formData.total_tickets}
                onChange={handleInputChange}
                style={styles.input}
                className="form-input"
                placeholder="100"
                min="1"
                required
              />
            </div>

            <div style={{...styles.formGroup, ...styles.fullWidth}}>
              <label style={styles.label}>
                📝 Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={styles.textarea}
                className="form-input"
                placeholder="Describe your event..."
                required
              />
            </div>

            <div style={{...styles.formGroup, ...styles.fullWidth}}>
              <label style={styles.label}>
                🖼️ Event Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                style={styles.input}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {userRole === 'System Admin' && (
              <div style={{...styles.formGroup, ...styles.fullWidth}}>
                <div style={styles.statusGroup}>
                  <label style={styles.statusLabel}>
                    ⚙️ Initial Event Status (Admin Only)
                  </label>
                  <select
                    name="event_status"
                    value={formData.event_status}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="pending">⏳ Pending Review</option>
                    <option value="approved">✅ Approved</option>
                    <option value="declined">❌ Declined</option>
                  </select>
                  <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    💡 As an admin, you can set the initial status. Regular organizers will always start with "Pending".
                  </p>
                </div>
              </div>
            )}
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              style={{...styles.button, ...styles.secondaryButton}}
              className="secondary-btn"
              disabled={loading}
            >
              ❌ Cancel
            </button>
            <button
              type="submit"
              style={{...styles.button, ...styles.primaryButton}}
              className="btn-hover"
              disabled={loading}
            >
              {loading ? (
                <>🔄 Creating...</>
              ) : (
                <>🎪 Create Event</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage; 