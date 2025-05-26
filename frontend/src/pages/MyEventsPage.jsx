import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

// EventCard component - clickable card for each event
const EventCard = ({ event, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on buttons
    if (e.target.tagName.toLowerCase() === 'button') {
      return;
    }
    navigate(`/event/${event._id}`);
  };

  return (
    <div 
      style={{
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        cursor: "pointer",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all 0.3s ease",
      }}
      onClick={handleCardClick}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
      }}
      role="button"
      tabIndex={0}
    >
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "8px" }}>
          {event.title}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
          📅 {format(new Date(event.date), 'PPP')}
        </p>
        <p style={{ color: "rgba(255,255,255,0.8)" }}>
          📍 {event.location}
        </p>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(event._id);
          }}
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event._id);
          }}
          style={{
            backgroundColor: "rgba(255,0,0,0.2)",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,0,0,0.3)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,0,0,0.2)")}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEvents();
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/events/organizer/my-events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/my-events/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`/api/v1/events/${id}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 50%, #0600AB 100%)',
      padding: '2rem',
    },
    content: {
      maxWidth: '1000px',
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
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      margin: 0,
    },
    createButton: {
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 100%)',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      display: 'inline-block',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 0',
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Events</h1>
          <Link
            to="/my-events/new"
            style={styles.createButton}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(151,125,255,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Create New Event
          </Link>
        </div>

        {loading ? (
          <div style={styles.loadingSpinner}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : events.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              You haven't created any events yet
            </p>
            <Link
              to="/my-events/new"
              style={{
                ...styles.createButton,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div>
            {events.map(event => (
              <EventCard 
                key={event._id} 
                event={event} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage; 