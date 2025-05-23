import React, { useState, useEffect } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { toast } from 'react-toastify';
import axios from '../utils/axios';

const EventAnalytics = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const styles = {
        container: {
            padding: '2rem',
            backgroundColor: '#000000',
            color: '#ffffff',
            minHeight: '100vh'
        },
        header: {
            marginBottom: '2rem',
            textAlign: 'center'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        },
        subtitle: {
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.7)'
        },
        chartsContainer: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
            '@media (min-width: 1024px)': {
                gridTemplateColumns: 'repeat(2, 1fr)'
            }
        },
        chartCard: {
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(151, 125, 255, 0.3)'
        },
        chartTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: '#C4B5FD'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
        },
        statCard: {
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            border: '1px solid rgba(151, 125, 255, 0.3)'
        },
        statNumber: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#977DFF',
            marginBottom: '0.5rem'
        },
        statLabel: {
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.7)'
        },
        loading: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.7)'
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
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/users/events/analytics');
            setEvents(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError(err.response?.data?.message || 'Failed to load analytics');
            toast.error('Failed to load event analytics');
        } finally {
            setLoading(false);
        }
    };

    const formatChartData = () => {
        return events.map(event => ({
            name: event.name.length > 15 ? event.name.substring(0, 15) + '...' : event.name,
            fullName: event.name,
            ticketsSold: event.ticketsSold || 0,
            totalTickets: event.totalTickets || 0,
            percentage: event.totalTickets > 0 ? 
                Math.round((event.ticketsSold / event.totalTickets) * 100) : 0,
            revenue: (event.ticketsSold || 0) * (event.price || 0)
        }));
    };

    const calculateTotalStats = () => {
        return events.reduce((acc, event) => ({
            totalEvents: acc.totalEvents + 1,
            totalTicketsSold: acc.totalTicketsSold + (event.ticketsSold || 0),
            totalRevenue: acc.totalRevenue + ((event.ticketsSold || 0) * (event.price || 0)),
            soldOutEvents: acc.soldOutEvents + (event.ticketsSold >= event.totalTickets ? 1 : 0)
        }), { totalEvents: 0, totalTicketsSold: 0, totalRevenue: 0, soldOutEvents: 0 });
    };

    const pieChartData = () => {
        const data = formatChartData().map(event => ({
            name: event.name,
            value: event.ticketsSold,
            fullName: event.fullName
        }));
        return data.filter(item => item.value > 0);
    };

    const COLORS = ['#977DFF', '#C4B5FD', '#E9D5FF', '#F3E8FF', '#DDD6FE'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(151, 125, 255, 0.3)'
                }}>
                    <p style={{ color: '#C4B5FD', marginBottom: '0.5rem' }}>{data.fullName}</p>
                    <p style={{ color: '#fff' }}>{`Tickets Sold: ${data.ticketsSold}/${data.totalTickets}`}</p>
                    <p style={{ color: '#fff' }}>{`Percentage: ${data.percentage}%`}</p>
                    <p style={{ color: '#fff' }}>{`Revenue: $${data.revenue}`}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    <div style={{
                        border: '3px solid rgba(151, 125, 255, 0.3)',
                        borderTop: '3px solid #977DFF',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        animation: 'spin 1s linear infinite',
                        marginRight: '1rem'
                    }}></div>
                    Loading analytics...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>
                    <p>{error}</p>
                    <button 
                        onClick={fetchAnalytics}
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

    if (!events || events.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Your Event Analytics</h1>
                    <p style={styles.subtitle}>Track your event performance and ticket sales</p>
                </div>
                <div style={styles.noData}>
                    <p>No events found. Create your first event to see analytics!</p>
                </div>
            </div>
        );
    }

    const stats = calculateTotalStats();
    const chartData = formatChartData();
    const pieData = pieChartData();

    return (
        <div style={styles.container}>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            
            <div style={styles.header}>
                <h1 style={styles.title}>Your Event Analytics</h1>
                <p style={styles.subtitle}>Track your event performance and ticket sales</p>
            </div>

            {/* Stats Overview */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.totalEvents}</div>
                    <div style={styles.statLabel}>Total Events</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.totalTicketsSold}</div>
                    <div style={styles.statLabel}>Tickets Sold</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>${stats.totalRevenue}</div>
                    <div style={styles.statLabel}>Total Revenue</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statNumber}>{stats.soldOutEvents}</div>
                    <div style={styles.statLabel}>Sold Out Events</div>
                </div>
            </div>

            {/* Charts */}
            <div style={styles.chartsContainer}>
                {/* Bar Chart */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Ticket Sales by Event</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#C4B5FD"
                                fontSize={12}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis stroke="#C4B5FD" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="percentage" fill="#977DFF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                {pieData.length > 0 && (
                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>Tickets Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventAnalytics; 