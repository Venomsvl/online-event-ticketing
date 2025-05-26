import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format, subMonths } from 'date-fns';
import theme from '../../styles/theme';

const EventAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState([]);
  const [dateRange, setDateRange] = useState('all');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const navigate = useNavigate();

  const COLORS = [theme.colors.primary, theme.colors.primaryLight, '#e94256', '#f87171'];

  const styles = {
    outer: {
      minHeight: '100vh',
      background: theme.colors.lightGray,
      color: theme.colors.text.primary,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: theme.spacing.xl,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
      background: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.md,
      border: `1.5px solid ${theme.colors.border}`,
      padding: theme.spacing.xl,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text.primary,
      margin: 0,
    },
    chartContainer: {
      background: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.md,
      border: `1.5px solid ${theme.colors.border}`,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      height: '400px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: theme.spacing.xl,
      marginTop: theme.spacing.xl,
    },
    card: {
      background: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.md,
      border: `1.5px solid ${theme.colors.border}`,
      padding: theme.spacing.xl,
    },
    cardTitle: {
      ...theme.typography.h2,
      marginBottom: theme.spacing.md,
      color: theme.colors.text.primary,
    },
    stat: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
      color: theme.colors.text.secondary,
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
      border: `4px solid ${theme.colors.border}`,
      borderTop: `4px solid ${theme.colors.primary}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    select: {
      ...theme.components.input,
      width: '200px',
    },
    summaryCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    summaryCard: {
      ...theme.components.card,
      padding: theme.spacing.lg,
    },
    summaryValue: {
      ...theme.typography.h1,
      color: theme.colors.primary,
      margin: `${theme.spacing.sm} 0`,
    },
    statusIndicator: {
      display: 'inline-block',
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.typography.small.fontSize,
      fontWeight: '600',
    },
    statusActive: {
      backgroundColor: '#dcfce7',
      color: theme.colors.success,
    },
    statusUpcoming: {
      backgroundColor: '#dbeafe',
      color: '#2563eb',
    },
    statusCompleted: {
      backgroundColor: '#f3f4f6',
      color: theme.colors.text.secondary,
    },
  };

  const fetchEventData = async () => {
    try {
      setLoading(true);
      let startDate = null;
      if (dateRange !== 'all') {
        const months = parseInt(dateRange);
        startDate = subMonths(new Date(), months);
      }

      const response = await axios.get('/api/v1/users/events/analytics', {
        params: { startDate: startDate?.toISOString() }
      });

      const formattedData = response.data.map(event => ({
        name: event.name,
        ticketsBooked: event.ticketsBooked,
        totalTickets: event.totalTickets,
        percentage: ((event.ticketsBooked / event.totalTickets) * 100).toFixed(1),
        revenue: event.revenue || 0,
        status: event.status || 'upcoming',
        date: new Date(event.date),
      }));

      setEventData(formattedData);
      
      // Calculate totals
      const revenue = formattedData.reduce((sum, event) => sum + event.revenue, 0);
      const tickets = formattedData.reduce((sum, event) => sum + event.ticketsBooked, 0);
      setTotalRevenue(revenue);
      setTotalTickets(tickets);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch event analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [navigate, dateRange]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return { ...styles.statusIndicator, ...styles.statusActive };
      case 'upcoming':
        return { ...styles.statusIndicator, ...styles.statusUpcoming };
      case 'completed':
        return { ...styles.statusIndicator, ...styles.statusCompleted };
      default:
        return { ...styles.statusIndicator, ...styles.statusUpcoming };
    }
  };

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

        <div style={styles.summaryCards}>
          <div style={styles.summaryCard}>
            <h3 style={styles.cardTitle}>Total Revenue</h3>
            <div style={styles.summaryValue}>${totalRevenue.toLocaleString()}</div>
          </div>
          <div style={styles.summaryCard}>
            <h3 style={styles.cardTitle}>Total Tickets Sold</h3>
            <div style={styles.summaryValue}>{totalTickets.toLocaleString()}</div>
          </div>
          <div style={styles.summaryCard}>
            <h3 style={styles.cardTitle}>Active Events</h3>
            <div style={styles.summaryValue}>
              {eventData.filter(e => e.status === 'active').length}
            </div>
          </div>
        </div>

        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
              <XAxis dataKey="name" stroke={theme.colors.text.secondary} />
              <YAxis stroke={theme.colors.text.secondary} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'percentage') return [`${value}%`, 'Booking Percentage'];
                  if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                  return [value, name === 'ticketsBooked' ? 'Tickets Booked' : 'Total Tickets'];
                }}
                contentStyle={{
                  backgroundColor: theme.colors.white,
                  border: `1.5px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  color: theme.colors.text.primary,
                }}
              />
              <Legend />
              <Bar dataKey="ticketsBooked" fill={theme.colors.primary} name="Tickets Booked" />
              <Bar dataKey="revenue" fill={theme.colors.primaryLight} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.grid}>
          {eventData.map((event) => (
            <div key={event.name} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
                <h3 style={styles.cardTitle}>{event.name}</h3>
                <span style={getStatusStyle(event.status)}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
              <div style={styles.stat}>
                <span>Date:</span>
                <span>{format(event.date, 'MMM d, yyyy')}</span>
              </div>
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
              <div style={styles.stat}>
                <span>Revenue:</span>
                <span>${event.revenue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics; 