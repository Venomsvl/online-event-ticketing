import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format, subMonths } from 'date-fns';
import theme from '../styles/theme';

const EventAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState([]);
  const [dateRange, setDateRange] = useState('all');
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
    chartContainer: {
      background: 'rgba(255,255,255,0.18)',
      borderRadius: '28px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
      border: '1.5px solid rgba(151,125,255,0.3)',
      padding: '2rem',
      marginBottom: '2rem',
      height: '400px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '2rem',
    },
    card: {
      background: 'rgba(255,255,255,0.18)',
      borderRadius: '28px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
      border: '1.5px solid rgba(151,125,255,0.3)',
      padding: '1.5rem',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    },
    cardTitle: {
      ...theme.typography.h2,
      marginBottom: '1rem',
      color: '#fff',
    },
    stat: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
      color: '#fff',
      ...theme.typography.body,
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
    select: {
      background: 'rgba(255,255,255,0.7)',
      border: '1.5px solid #977DFF',
      borderRadius: '12px',
      color: '#0033FF',
      padding: '0.75rem',
      fontSize: '1rem',
      cursor: 'pointer',
      outline: 'none',
      boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)',
      transition: 'border 0.2s',
      width: '200px',
    },
  };

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let startDate = null;
      if (dateRange !== 'all') {
        const months = parseInt(dateRange);
        startDate = subMonths(new Date(), months);
      }

      const response = await axios.get('http://localhost:3000/api/v1/events/analytics', {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate: startDate?.toISOString() }
      });

      const formattedData = response.data.map(event => ({
        name: event.name,
        ticketsBooked: event.ticketsBooked,
        totalTickets: event.totalTickets,
        percentage: ((event.ticketsBooked / event.totalTickets) * 100).toFixed(1)
      }));

      setEventData(formattedData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch event analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [navigate, dateRange]);

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (eventData.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>No events found</h2>
      </div>
    );
  }

  return (
    <div style={styles.outer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Event Analytics</h1>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Time</option>
            <option value="1">Last Month</option>
            <option value="3">Last 3 Months</option>
            <option value="6">Last 6 Months</option>
            <option value="12">Last Year</option>
          </select>
        </div>

        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'percentage') return [`${value}%`, 'Booking Percentage'];
                  return [value, name === 'ticketsBooked' ? 'Tickets Booked' : 'Total Tickets'];
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: '1.5px solid #977DFF',
                  borderRadius: '12px',
                  color: '#0033FF',
                }}
              />
              <Legend />
              <Bar dataKey="ticketsBooked" fill="#977DFF" name="Tickets Booked" />
              <Bar dataKey="totalTickets" fill="#0033FF" name="Total Tickets" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.grid}>
          {eventData.map((event) => (
            <div key={event.name} style={styles.card}>
              <h3 style={styles.cardTitle}>{event.name}</h3>
              <div style={styles.stat}>
                <span>Tickets Booked:</span>
                <span>{event.ticketsBooked}</span>
              </div>
              <div style={styles.stat}>
                <span>Total Tickets:</span>
                <span>{event.totalTickets}</span>
              </div>
              <div style={styles.stat}>
                <span>Booking Rate:</span>
                <span>{event.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics; 