import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axios';

const EditEventPage = () => {
  const { id } = useParams();
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
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch event data
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/v1/events/${id}`);
        const event = res.data.event;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date ? event.date.slice(0, 16) : '',
          location: event.location || '',
          category: event.category || '',
          image: event.image || '',
          ticket_price: event.ticket_price || '',
          total_tickets: event.total_tickets || '',
          event_status: event.event_status || 'pending'
        });
      } catch (err) {
        toast.error('Failed to load event');
        navigate('/my-events');
      }
    };
    fetchEvent();
  }, [id, navigate]);

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
      await axios.put(`/api/v1/events/${id}`, submitData, { withCredentials: true });
      toast.success('Event updated!');
      navigate('/my-events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-events');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '2rem', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '0 0 1rem 0' }}>
          ✏️ Edit Event
        </h1>
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '25px', padding: '3rem', backdropFilter: 'blur(20px)', border: '1px solid rgba(151, 125, 255, 0.3)', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* ...repeat form fields as in CreateEventPage... */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontWeight: '600', color: '#C4B5FD' }}>🎪 Event Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(151, 125, 255, 0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontWeight: '600', color: '#C4B5FD' }}>📍 Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(151, 125, 255, 0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontWeight: '600', color: '#C4B5FD' }}>📅 Date & Time</label>
              <input type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(151, 125, 255, 0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontWeight: '600', color: '#C4B5FD' }}>🏷️ Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(151, 125, 255, 0.3)', background: 'rgba(26, 26, 46, 0.95)', color: '#fff', fontSize: '1rem' }} required>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontWeight: '600', color: '#C4B5FD' }}>💰 Ticket Price</label>
              <input type="number" name="ticket_price" value={formData.ticket_price} onChange={handleInputChange} style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(151, 125, 255, 0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} min="0" step="0.01" required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontWeight: '600', color: '#C4B5FD' }}>🎫 Total Tickets</label>
              <input type="number" name="total_tickets" value={formData.total_tickets} onChange={handleInputChange} style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(151, 125, 255, 0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} min="1" required />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontWeight: '600', color: '#C4B5FD' }}>📝 Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(151, 125, 255, 0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', minHeight: '120px' }} required />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ fontWeight: '600', color: '#C4B5FD' }}>🖼️ Event Image URL</label>
              <input type="url" name="image" value={formData.image} onChange={handleInputChange} style={{ padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(151, 125, 255, 0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', justifyContent: 'center' }}>
            <button type="button" onClick={handleCancel} style={{ padding: '1rem 2.5rem', borderRadius: '12px', border: 'none', fontSize: '1.1rem', fontWeight: '600', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(151,125,255,0.3)', cursor: 'pointer' }} disabled={loading}>❌ Cancel</button>
            <button type="submit" style={{ padding: '1rem 2.5rem', borderRadius: '12px', border: 'none', fontSize: '1.1rem', fontWeight: '600', background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)', color: '#fff', boxShadow: '0 4px 15px rgba(151, 125, 255, 0.4)', cursor: 'pointer' }} disabled={loading}>{loading ? '🔄 Saving...' : '💾 Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
