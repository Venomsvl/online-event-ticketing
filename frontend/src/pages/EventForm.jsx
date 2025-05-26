import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    image: '',
    ticket_price: '',
    total_tickets: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and has the right role
    if (!user) {
      toast.error('Please login to create/edit events');
      navigate('/login');
      return;
    }

    if (user.role !== 'organizer' && user.role !== 'admin') {
      toast.error('You do not have permission to create/edit events');
      navigate('/');
      return;
    }

    if (isEditMode) {
      fetchEventData();
    }
  }, [id, user, navigate]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/v1/events/${id}`);
      if (response.data && response.data.event) {
        const event = response.data.event;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
          location: event.location || '',
          category: event.category || '',
          image: event.image || '',
          ticket_price: event.ticket_price?.toString() || '',
          total_tickets: event.total_tickets?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event data');
      toast.error('Failed to load event data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.date) errors.push('Date is required');
    if (!formData.location.trim()) errors.push('Location is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.ticket_price || Number(formData.ticket_price) <= 0) {
      errors.push('Valid ticket price is required');
    }
    if (!formData.total_tickets || Number(formData.total_tickets) <= 0) {
      errors.push('Valid number of tickets is required');
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        ticket_price: Number(formData.ticket_price),
        total_tickets: Number(formData.total_tickets),
        date: new Date(formData.date).toISOString()
      };

      console.log('Submitting event data:', payload);

      let response;
      if (isEditMode) {
        response = await axios.put(`/api/v1/events/${id}`, payload);
        toast.success('Event updated successfully');
      } else {
        response = await axios.post('/api/v1/events', payload);
        toast.success('Event created successfully');
      }

      console.log('Server response:', response.data);
      navigate('/my-events');
    } catch (error) {
      console.error('Error saving event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save event';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '28px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
      border: '1.5px solid rgba(151,125,255,0.3)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '2rem',
      color: '#fff',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#fff',
    },
    input: {
      background: 'rgba(255,255,255,0.1)',
      border: '1.5px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      padding: '0.75rem',
      fontSize: '1rem',
      color: '#fff',
      outline: 'none',
      width: '100%',
      transition: 'all 0.3s ease',
    },
    select: {
      background: 'rgba(255,255,255,0.1)',
      border: '1.5px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      padding: '0.75rem',
      fontSize: '1rem',
      color: '#fff',
      outline: 'none',
      width: '100%',
      cursor: 'pointer',
    },
    textarea: {
      background: 'rgba(255,255,255,0.1)',
      border: '1.5px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      padding: '0.75rem',
      fontSize: '1rem',
      color: '#fff',
      outline: 'none',
      width: '100%',
      minHeight: '120px',
      resize: 'vertical',
    },
    button: {
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '1rem',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1rem',
      fontWeight: '500',
    },
    cancelButton: {
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      border: '1.5px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      padding: '1rem',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1rem',
      fontWeight: '500',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter event title"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={styles.textarea}
              placeholder="Enter event description"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={styles.input}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter event location"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select a category</option>
              <option value="conference">Conference</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="concert">Concert</option>
              <option value="exhibition">Exhibition</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter image URL (optional)"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Ticket Price ($)</label>
            <input
              type="number"
              name="ticket_price"
              value={formData.ticket_price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={styles.input}
              placeholder="Enter ticket price"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Total Tickets</label>
            <input
              type="number"
              name="total_tickets"
              value={formData.total_tickets}
              onChange={handleChange}
              required
              min="1"
              style={styles.input}
              placeholder="Enter total number of tickets"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                flex: 1,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(151,125,255,0.4)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-events')}
              style={{
                ...styles.cancelButton,
                flex: 1,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 