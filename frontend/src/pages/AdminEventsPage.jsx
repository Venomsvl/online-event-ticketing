import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
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
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/events');
        setEvents(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch events');
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
      toast.success('Event status updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event status');
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const eventIds = Array.from(selectedEvents);
      
      await Promise.all(eventIds.map(eventId =>
        axios.put(
          `http://localhost:3000/api/v1/admin/events/${eventId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ));

      setEvents(events.map(event => 
        selectedEvents.has(event._id) ? { ...event, status: newStatus } : event
      ));

      setSelectedEvents(new Set());
      setSelectAll(false);
      toast.success(`Successfully updated ${eventIds.length} events to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update events status');
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
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId);
    } else {
      newSelected.add(eventId);
    }
    setSelectedEvents(newSelected);
    setSelectAll(newSelected.size === filteredAndSortedEvents.length);
  };

  const exportToCSV = () => {
    const headers = ['Event Name', 'Date', 'Location', 'Status', 'Tickets Booked', 'Total Tickets', 'Organizer'];
    const csvData = filteredAndSortedEvents.map(event => [
      event.name,
      format(new Date(event.date), 'PPP'),
      event.location,
      event.status,
      event.ticketsBooked,
      event.totalTickets,
      event.organizer.name
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `events_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesFilter = filter === 'all' || event.status === filter;
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'tickets':
          comparison = a.ticketsBooked - b.ticketsBooked;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.outer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Event Management</h1>
        </div>

        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Events</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            style={styles.select}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="tickets">Sort by Tickets</option>
          </select>
        </div>

        {selectedEvents.size > 0 && (
          <div style={styles.bulkActions}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                style={styles.checkbox}
              />
              Select All
            </label>
            <button
              onClick={() => handleBulkStatusUpdate('active')}
              style={styles.button}
            >
              Activate Selected
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('cancelled')}
              style={styles.button}
            >
              Cancel Selected
            </button>
            <button
              onClick={exportToCSV}
              style={styles.button}
            >
              Export to CSV
            </button>
          </div>
        )}

        {filteredAndSortedEvents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No events found</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredAndSortedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onStatusUpdate={handleStatusUpdate}
                isSelected={selectedEvents.has(event._id)}
                onSelect={() => handleSelectEvent(event._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsPage; 