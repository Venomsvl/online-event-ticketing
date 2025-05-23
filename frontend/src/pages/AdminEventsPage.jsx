import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import EventCard from '../components/events/EventCard';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvents, setSelectedEvents] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const styles = {
    outer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '2rem',
      color: '#fff',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
    },
    subtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '1.1rem',
      margin: '0.5rem 0 0 0',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'rgba(255,255,255,0.18)',
      borderRadius: '20px',
      padding: '1.5rem',
      textAlign: 'center',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(151,125,255,0.3)',
      transition: 'transform 0.3s ease',
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    input: {
      flex: '1',
      minWidth: '300px',
      padding: '1rem 1.5rem',
      borderRadius: '15px',
      border: '1px solid rgba(151,125,255,0.3)',
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
      fontSize: '1rem',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    filterButtons: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    },
    activeFilter: {
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(151, 125, 255, 0.4)',
    },
    inactiveFilter: {
      background: 'rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(151,125,255,0.2)',
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
    },
    bulkActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '15px',
      padding: '1rem 1.5rem',
      marginBottom: '1.5rem',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(151,125,255,0.2)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '2rem',
    },
    noData: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '20px',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: '1px solid rgba(151,125,255,0.2)',
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid rgba(151, 125, 255, 0.3)',
      borderTop: '4px solid #977DFF',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem',
    },
    error: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '20px',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    statusDropdown: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: '1px solid rgba(151,125,255,0.3)',
      background: 'rgba(26, 26, 46, 0.95)',
      color: '#fff',
      fontSize: '0.9rem',
      cursor: 'pointer',
      outline: 'none',
      minWidth: '120px',
    },
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/v1/events', {
        withCredentials: true
      });
      
      if (response.data && response.data.events) {
        setEvents(response.data.events);
      } else if (Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (eventId, status) => {
    try {
      const backendStatus = status === 'rejected' ? 'declined' : status;
      
      await axios.put(`/api/v1/events/${eventId}/status`, { 
        status: backendStatus 
      }, {
        withCredentials: true
      });
      
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: backendStatus, event_status: backendStatus } : event
      ));
      
      toast.success(`Event ${status} successfully! 🎉`);
    } catch (err) {
      console.error('Error updating event status:', err);
      toast.error(err.response?.data?.message || 'Failed to update event status');
      throw err;
    }
  };

  const handleDirectStatusChange = async (eventId, newStatus) => {
    try {
      await handleStatusUpdate(eventId, newStatus);
    } catch (err) {
      // Error already handled in handleStatusUpdate
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEvents(new Set());
    } else {
      setSelectedEvents(new Set(filteredAndSortedEvents.map(event => event._id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectEvent = (eventId) => {
    const newSelectedEvents = new Set(selectedEvents);
    if (newSelectedEvents.has(eventId)) {
      newSelectedEvents.delete(eventId);
    } else {
      newSelectedEvents.add(eventId);
    }
    setSelectedEvents(newSelectedEvents);
    setSelectAll(newSelectedEvents.size === filteredAndSortedEvents.length);
  };

  const exportToCSV = () => {
    const csvData = filteredAndSortedEvents.map(event => ({
      Title: event.title || event.name || 'Untitled Event',
      Date: format(new Date(event.date || event.event_date || new Date()), 'PPP'),
      Location: event.location || event.venue || 'TBD',
      Price: `$${event.price || event.ticket_price || 0}`,
      Status: event.status || event.event_status || 'pending',
      'Tickets Sold': event.ticketsSold || event.tickets_sold || (event.total_tickets - event.remaining_tickets) || 0,
      'Total Tickets': event.totalTickets || event.total_tickets || 100,
      Category: event.category || 'General',
      Organizer: event.organizer?.name || event.organizer?.username || 'Unknown',
      'Organizer Email': event.organizer?.email || 'unknown@email.com',
      'Created At': event.createdAt ? format(new Date(event.createdAt), 'PPP') : 'Unknown'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      const eventStatus = event.status || event.event_status;
      const matchesFilter = filter === 'all' || eventStatus === filter || 
                           (filter === 'rejected' && eventStatus === 'declined');
      const matchesSearch = (event.title || event.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (event.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (event.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (event.organizer?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || a.event_date || a.createdAt);
      const dateB = new Date(b.date || b.event_date || b.createdAt);
      return dateB - dateA; // Most recent first
    });

  const getStatValue = (status) => {
    return events.filter(e => (e.status || e.event_status) === status).length;
  };

  if (loading) {
    return (
      <div style={styles.outer}>
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          `}
        </style>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
            ✨ Loading events...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.outer}>
        <div style={styles.error}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Something went wrong!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={styles.button}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.outer}>
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(151, 125, 255, 0.4);
        }
        .filter-btn:hover {
          transform: translateY(-2px);
        }
        .input-focus:focus {
          border-color: #977DFF;
          box-shadow: 0 0 0 3px rgba(151, 125, 255, 0.2);
          background: rgba(255,255,255,0.15);
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(151, 125, 255, 0.3);
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
      
      <div style={styles.container}>
        <div style={styles.header} className="fade-in">
          <div>
            <h1 style={styles.title}>⚙️ Admin Events Dashboard</h1>
            <p style={styles.subtitle}>📋 Review and manage all events from organizers</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              style={styles.button}
              className="btn-hover"
              onClick={() => window.location.reload()}
            >
              🔄 Refresh Data
            </button>
            <button
              style={styles.button}
              className="btn-hover"
              onClick={() => navigate('/admin/create-event')}
            >
              ➕ Create New Event
            </button>
          </div>
        </div>

        {/* Statistics Summary */}
        <div style={styles.statsGrid} className="fade-in">
          {[
            { 
              label: 'Total Events', 
              value: events.length, 
              icon: '📊',
              color: '#977DFF'
            },
            { 
              label: 'Pending Review', 
              value: getStatValue('pending'), 
              icon: '⏳',
              color: '#f59e0b'
            },
            { 
              label: 'Approved Events', 
              value: getStatValue('approved'), 
              icon: '✅',
              color: '#10b981'
            },
            { 
              label: 'Rejected Events', 
              value: getStatValue('declined'), 
              icon: '❌',
              color: '#ef4444'
            }
          ].map((stat, index) => (
            <div key={index} style={{
              ...styles.statCard,
              border: `1px solid ${stat.color}40`
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: stat.color,
                marginBottom: '0.25rem'
              }}>
                {stat.value}
              </div>
              <div style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.controls} className="fade-in">
          <input
            type="text"
            placeholder="🔍 Search events, organizers, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
            className="input-focus"
          />
          
          <div style={styles.filterButtons}>
            {['all', 'pending', 'approved', 'rejected'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                style={{
                  ...styles.filterButton,
                  ...(filter === filterType ? styles.activeFilter : styles.inactiveFilter)
                }}
                className="filter-btn"
              >
                {filterType === 'all' && '📊'} 
                {filterType === 'pending' && '⏳'} 
                {filterType === 'approved' && '✅'} 
                {filterType === 'rejected' && '❌'} 
                {' '}
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType !== 'all' && (
                  <span style={{ 
                    marginLeft: '0.5rem',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}>
                    {getStatValue(filterType === 'rejected' ? 'declined' : filterType)}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            style={styles.button}
            className="btn-hover"
            onClick={exportToCSV}
          >
            📥 Export CSV
          </button>
        </div>

        {selectedEvents.size > 0 && (
          <div style={styles.bulkActions} className="fade-in">
            <span style={{ color: '#fff', fontSize: '1rem', fontWeight: '500' }}>
              🎯 {selectedEvents.size} event(s) selected
            </span>
            <button
              style={styles.button}
              className="btn-hover"
              onClick={() => {
                setSelectedEvents(new Set());
                setSelectAll(false);
              }}
            >
              ❌ Clear Selection
            </button>
          </div>
        )}

        <div style={styles.bulkActions} className="fade-in">
          <label style={{ color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              style={{ marginRight: '0.75rem', accentColor: '#977DFF', transform: 'scale(1.2)' }}
            />
            📌 Select All ({filteredAndSortedEvents.length} events)
          </label>
          <div style={{ color: 'rgba(255,255,255,0.7)' }}>
            Showing {filteredAndSortedEvents.length} of {events.length} events
          </div>
        </div>

        {filteredAndSortedEvents.length === 0 ? (
          <div style={styles.noData} className="fade-in">
            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', fontWeight: '500' }}>
              No {filter !== 'all' ? filter : ''} events found.
              {filter !== 'all' && ' Try changing the filter or create a new event.'}
            </p>
          </div>
        ) : (
          <div style={styles.grid} className="fade-in">
            {filteredAndSortedEvents.map(event => (
              <div key={event._id} style={{ position: 'relative' }} className="card-hover">
                <input
                  type="checkbox"
                  checked={selectedEvents.has(event._id)}
                  onChange={() => handleSelectEvent(event._id)}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '1.5rem',
                    zIndex: 10,
                    accentColor: '#977DFF',
                    transform: 'scale(1.3)',
                    cursor: 'pointer'
                  }}
                />
                
                {/* Status Dropdown for Easy Status Changes */}
                <select
                  value={event.status || event.event_status || 'pending'}
                  onChange={(e) => handleDirectStatusChange(event._id, e.target.value)}
                  style={{
                    ...styles.statusDropdown,
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    zIndex: 10,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="approved">✅ Approved</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
                
                <EventCard
                  event={event}
                  isAdmin={true}
                  onStatusUpdate={handleStatusUpdate}
                  isSelected={selectedEvents.has(event._id)}
                  onSelect={() => handleSelectEvent(event._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsPage; 