import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/events/EventCard';
import { format } from 'date-fns';
import theme from '../styles/theme';

const AdminEventsPage = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedEvents, setSelectedEvents] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState(null);
  const [bulkAction, setBulkAction] = useState('');
  const navigate = useNavigate();

  const styles = {
    outer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 50%, #0600AB 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
    },
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      background: 'rgba(255,255,255,0.18)',
      borderRadius: '28px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
      border: '1.5px solid rgba(151,125,255,0.3)',
      padding: '1.5rem 2rem',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    },
    title: {
      ...theme.typography.h1,
      color: '#fff',
      margin: 0,
    },
    subtitle: {
      fontSize: '1.125rem',
      color: 'rgba(255,255,255,0.7)'
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.18)',
      borderRadius: '28px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
      border: '1.5px solid rgba(151,125,255,0.3)',
      padding: '1.5rem',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    },
    input: {
      background: 'rgba(255,255,255,0.7)',
      border: '1.5px solid #977DFF',
      borderRadius: '12px',
      color: '#0033FF',
      padding: '0.75rem',
      fontSize: '1rem',
      flex: '1',
      minWidth: '200px',
      outline: 'none',
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)',
      transition: 'border 0.2s',
    },
    select: {
      background: 'rgba(255,255,255,0.7)',
      border: '1.5px solid #977DFF',
      borderRadius: '12px',
      color: '#0033FF',
      padding: '0.75rem',
      fontSize: '1rem',
      cursor: 'pointer',
      minWidth: '150px',
      outline: 'none',
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)',
      transition: 'border 0.2s',
    },
    button: {
      background: 'linear-gradient(135deg, #977DFF 0%, #0033FF 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    buttonDisabled: {
      background: 'rgba(255,255,255,0.3)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      cursor: 'not-allowed',
      opacity: 0.7,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
    },
    spinner: {
      width: '3rem',
      height: '3rem',
      border: '4px solid rgba(255,255,255,0.3)',
      borderTop: '4px solid #fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    bulkActions: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      padding: '1.5rem',
      background: 'rgba(255,255,255,0.18)',
      borderRadius: '28px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
      border: '1.5px solid rgba(151,125,255,0.3)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    },
    checkbox: {
      marginRight: '0.5rem',
      cursor: 'pointer',
      accentColor: '#977DFF',
    },
    checkboxLabel: {
      ...theme.typography.body,
      color: '#fff',
      cursor: 'pointer',
    },
    filterButtons: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    filterButton: {
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    activeFilter: {
      backgroundColor: '#977DFF',
      color: '#fff'
    },
    inactiveFilter: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.7)',
      border: '1px solid rgba(151, 125, 255, 0.3)'
    },
    actionButton: {
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    approveButton: {
      backgroundColor: '#10b981',
      color: '#fff'
    },
    rejectButton: {
      backgroundColor: '#ef4444',
      color: '#fff'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: 'rgba(151, 125, 255, 0.2)',
      padding: '1rem',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#C4B5FD'
    },
    tableCell: {
      padding: '1rem',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      fontSize: '0.875rem'
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '500',
      textTransform: 'capitalize'
    },
    pendingStatus: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      color: '#fbbf24',
      border: '1px solid rgba(245, 158, 11, 0.3)'
    },
    approvedStatus: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.3)'
    },
    rejectedStatus: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem'
    },
    smallButton: {
      padding: '0.25rem 0.75rem',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    error: {
      textAlign: 'center',
      color: '#ef4444',
      fontSize: '1.125rem',
      padding: '2rem'
    },
    noData: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.7)',
      fontSize: '1.125rem',
      padding: '2rem'
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/events');
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.response?.data?.message || 'Failed to load events');
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleStatusUpdate = async (eventId, status) => {
    try {
      await axios.put(`/api/v1/events/${eventId}`, { status });
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status } : event
      ));
      toast.success(`Event ${status} successfully`);
    } catch (err) {
      console.error('Error updating event status:', err);
      toast.error(err.response?.data?.message || 'Failed to update event status');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedEvents.size === 0) {
      toast.error('Please select events and an action');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const eventIds = Array.from(selectedEvents);
      
      await Promise.all(eventIds.map(eventId =>
        axios.put(
          `http://localhost:3000/api/v1/admin/events/${eventId}/status`,
          { status: bulkAction },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ));

      setEvents(events.map(event => 
        selectedEvents.has(event._id) ? { ...event, status: bulkAction } : event
      ));
      
      toast.success(`${selectedEvents.size} events updated to ${bulkAction}`);
      setSelectedEvents(new Set());
      setSelectAll(false);
      setBulkAction('');
    } catch (err) {
      console.error('Error with bulk action:', err);
      toast.error('Failed to perform bulk action');
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
      Title: event.title,
      Date: format(new Date(event.date), 'PPP'),
      Location: event.location,
      Price: `$${event.price}`,
      Status: event.status,
      'Tickets Sold': event.ticketsSold || 0,
      Category: event.category,
      Organizer: event.organizer?.name || 'Unknown'
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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesFilter = filter === 'all' || event.status === filter;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div style={styles.outer}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.outer}>
        <div style={styles.error}>
          <p>{error}</p>
          <button 
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchEvents();
            }}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#977DFF',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.outer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Manage Events</h1>
          <p style={styles.subtitle}>Review and approve events from organizers</p>
          <button
            style={styles.button}
            onClick={() => navigate('/admin/create-event')}
          >
            Create New Event
          </button>
        </div>

        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
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
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType !== 'all' && (
                  <span style={{ marginLeft: '0.5rem' }}>
                    ({events.filter(e => e.status === filterType).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            style={styles.button}
            onClick={exportToCSV}
          >
            Export CSV
          </button>
        </div>

        {selectedEvents.size > 0 && (
          <div style={styles.bulkActions}>
            <span style={styles.checkboxLabel}>
              {selectedEvents.size} event(s) selected
            </span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              style={styles.select}
            >
              <option value="">Select Action</option>
              <option value="approved">Approve</option>
              <option value="rejected">Reject</option>
            </select>
            <button
              style={styles.button}
              onClick={handleBulkAction}
            >
              Apply to {selectedEvents.size} events
            </button>
          </div>
        )}

        <div style={styles.bulkActions}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              style={styles.checkbox}
            />
            Select All ({filteredAndSortedEvents.length} events)
          </label>
        </div>

        {filteredAndSortedEvents.length === 0 ? (
          <div style={styles.noData}>
            <p>No {filter !== 'all' ? filter : ''} events found.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredAndSortedEvents.map(event => (
              <div key={event._id} style={{ position: 'relative' }}>
                <input
                  type="checkbox"
                  checked={selectedEvents.has(event._id)}
                  onChange={() => handleSelectEvent(event._id)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 10,
                    accentColor: '#977DFF',
                    transform: 'scale(1.2)',
                  }}
                />
                <EventCard
                  event={event}
                  isAdmin={true}
                  onStatusUpdate={handleStatusUpdate}
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