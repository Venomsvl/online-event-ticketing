import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line } from 'recharts';
import { toast } from 'react-toastify';
import axios from '../utils/axios';

const EventAnalytics = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [organizerFilter, setOrganizerFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('revenue');
    const [animatedStats, setAnimatedStats] = useState({
        totalEvents: 0,
        totalTicketsSold: 0,
        totalRevenue: 0,
        soldOutEvents: 0
    });

    const isAdmin = localStorage.getItem('userRole') === 'admin';
    const COLORS = ['#977DFF', '#C4B5FD', '#E9D5FF', '#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ef4444'];

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Recalculate analytics when filters change
    useEffect(() => {
        if (events.length > 0) {
            const filteredEvents = getFilteredEvents();
            const newStats = calculateTotalStats(filteredEvents);
            animateNumbers(newStats);
            
            console.log(`Analytics updated: ${filteredEvents.length} events after filtering`);
        }
    }, [dateFilter, categoryFilter, organizerFilter, locationFilter, timeFilter, sortBy, events]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/events/my/analytics', {
                withCredentials: true
            });
            
            if (response.data && Array.isArray(response.data)) {
                // Transform backend data to match frontend expectations
                const transformedEvents = response.data.map(event => ({
                    title: event.name || event.title,
                    total_tickets: event.totalTickets || event.total_tickets,
                    remaining_tickets: (event.totalTickets || event.total_tickets) - (event.ticketsSold || 0),
                    ticket_price: event.price || event.ticket_price || 0,
                    category: event.category,
                    location: event.location,
                    date: event.date,
                    organizer: event.organizer,
                    revenue: event.revenue || 0
                }));
                
                setEvents(transformedEvents);
                const totalStats = calculateTotalStats(transformedEvents);
                animateNumbers(totalStats);
            } else {
                console.warn('No events data received');
                setEvents([]);
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError(err.response?.data?.message || 'Failed to fetch analytics data');
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const animateNumbers = (targetStats) => {
        const duration = 1500;
        const steps = 60;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        
        const interval = setInterval(() => {
            const progress = currentStep / steps;
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            
            setAnimatedStats({
                totalEvents: Math.round(targetStats.totalEvents * easeOutCubic),
                totalTicketsSold: Math.round(targetStats.totalTicketsSold * easeOutCubic),
                totalRevenue: Math.round(targetStats.totalRevenue * easeOutCubic),
                soldOutEvents: Math.round(targetStats.soldOutEvents * easeOutCubic)
            });
            
            currentStep++;
            if (currentStep > steps) {
                clearInterval(interval);
                setAnimatedStats(targetStats);
            }
        }, stepDuration);
    };

    const calculateTotalStats = (eventsData = events) => {
        return eventsData.reduce((acc, event) => {
            const ticketsSold = event.total_tickets - event.remaining_tickets;
            const revenue = event.revenue || (ticketsSold * event.ticket_price);
            
            return {
                totalEvents: acc.totalEvents + 1,
                totalTicketsSold: acc.totalTicketsSold + ticketsSold,
                totalRevenue: acc.totalRevenue + revenue,
                soldOutEvents: acc.soldOutEvents + (event.remaining_tickets === 0 ? 1 : 0)
            };
        }, { totalEvents: 0, totalTicketsSold: 0, totalRevenue: 0, soldOutEvents: 0 });
    };

    const getFilteredEvents = () => {
        let filtered = [...events];
        
        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();
            
            switch (dateFilter) {
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    filterDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            filtered = filtered.filter(event => new Date(event.date) >= filterDate);
        }
        
        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(event => event.category === categoryFilter);
        }
        
        // Organizer filter (admin only)
        if (isAdmin && organizerFilter !== 'all') {
            filtered = filtered.filter(event => 
                event.organizer && event.organizer._id === organizerFilter
            );
        }
        
        // Location filter
        if (locationFilter !== 'all') {
            filtered = filtered.filter(event => event.location === locationFilter);
        }
        
        // Time filter (by event date)
        if (timeFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);
                switch (timeFilter) {
                    case 'upcoming':
                        return eventDate >= now;
                    case 'past':
                        return eventDate < now;
                    case 'this-month':
                        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                    case 'this-year':
                        return eventDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }
        
        // Sort events
        filtered.sort((a, b) => {
            const aTicketsSold = a.total_tickets - a.remaining_tickets;
            const bTicketsSold = b.total_tickets - b.remaining_tickets;
            const aRevenue = a.revenue || (aTicketsSold * a.ticket_price);
            const bRevenue = b.revenue || (bTicketsSold * b.ticket_price);
            const aPercentage = (aTicketsSold / a.total_tickets) * 100;
            const bPercentage = (bTicketsSold / b.total_tickets) * 100;
            
            switch (sortBy) {
                case 'revenue':
                    return bRevenue - aRevenue;
                case 'tickets':
                    return bTicketsSold - aTicketsSold;
                case 'percentage':
                    return bPercentage - aPercentage;
                default:
                    return 0;
            }
        });
        
        return filtered;
    };

    const formatChartData = () => {
        return getFilteredEvents().slice(0, 10).map(event => {
            const ticketsSold = event.total_tickets - event.remaining_tickets;
            const revenue = event.revenue || (ticketsSold * event.ticket_price);
            const percentage = (ticketsSold / event.total_tickets) * 100;
            
            return {
                name: event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title,
                fullName: event.title,
                ticketsSold,
                revenue,
                percentage: Math.round(percentage),
                totalTickets: event.total_tickets,
                category: event.category,
                organizer: event.organizer
            };
        });
    };

    const getCategoryData = () => {
        const categoryStats = {};
        
        getFilteredEvents().forEach(event => {
            const ticketsSold = event.total_tickets - event.remaining_tickets;
            const revenue = event.revenue || (ticketsSold * event.ticket_price);
            
            if (!categoryStats[event.category]) {
                categoryStats[event.category] = { revenue: 0, tickets: 0 };
            }
            
            categoryStats[event.category].revenue += revenue;
            categoryStats[event.category].tickets += ticketsSold;
        });
        
        return Object.entries(categoryStats).map(([name, data]) => ({
            name,
            revenue: data.revenue,
            tickets: data.tickets
        }));
    };

    const getMonthlyTrends = () => {
        const monthlyData = {};
        const last6Months = [];
        
        // Generate last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            monthlyData[key] = { revenue: 0, tickets: 0 };
            last6Months.push(key);
        }
        
        getFilteredEvents().forEach(event => {
            const eventDate = new Date(event.date);
            const key = eventDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (monthlyData[key]) {
                const ticketsSold = event.total_tickets - event.remaining_tickets;
                const revenue = event.revenue || (ticketsSold * event.ticket_price);
                monthlyData[key].revenue += revenue;
                monthlyData[key].tickets += ticketsSold;
            }
        });
        
        return last6Months.map(month => ({
            month,
            revenue: monthlyData[month].revenue,
            tickets: monthlyData[month].tickets
        }));
    };

    const getRevenueVsTicketData = () => {
        return getFilteredEvents().slice(0, 5).map(event => {
            const ticketsSold = event.total_tickets - event.remaining_tickets;
            const revenue = event.revenue || (ticketsSold * event.ticket_price);
            
            return {
                name: event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title,
                tickets: ticketsSold,
                revenue: revenue
            };
        });
    };

    const getKeyInsights = () => {
        const filtered = getFilteredEvents();
        const stats = calculateTotalStats(filtered);
        const avgAttendance = filtered.length > 0 
            ? ((stats.totalTicketsSold / filtered.reduce((sum, e) => sum + e.total_tickets, 0)) * 100)
            : 0;
        
        const bestPerformer = filtered.reduce((best, event) => {
            const revenue = event.revenue || ((event.total_tickets - event.remaining_tickets) * event.ticket_price);
            const bestRevenue = best.revenue || ((best.total_tickets - best.remaining_tickets) * best.ticket_price);
            return revenue > bestRevenue ? event : best;
        }, filtered[0] || {});
        
        const topCategory = getCategoryData().reduce((top, cat) => 
            cat.revenue > (top.revenue || 0) ? cat : top, {});

        return {
            bestPerformer: bestPerformer.title || 'N/A',
            bestPerformerRevenue: bestPerformer.revenue || ((bestPerformer.total_tickets - bestPerformer.remaining_tickets) * bestPerformer.ticket_price) || 0,
            avgAttendance: avgAttendance.toFixed(1),
            topCategory: topCategory.name || 'N/A',
            topCategoryRevenue: topCategory.revenue || 0,
            soldOutEvents: stats.soldOutEvents
        };
    };

    const exportToCSV = () => {
        const filtered = getFilteredEvents();
        let csvContent = isAdmin 
            ? "Event Title,Category,Date,Location,Total Tickets,Tickets Sold,Revenue,Attendance %,Organizer Name,Organizer Email\n"
            : "Event Title,Category,Date,Location,Total Tickets,Tickets Sold,Revenue,Attendance %\n";
        
        filtered.forEach(event => {
            const ticketsSold = event.total_tickets - event.remaining_tickets;
            const revenue = event.revenue || (ticketsSold * event.ticket_price);
            const percentage = Math.round((ticketsSold / event.total_tickets) * 100);
            
            let row = `"${event.title}","${event.category}","${new Date(event.date).toLocaleDateString()}","${event.location}",${event.total_tickets},${ticketsSold},$${revenue},${percentage}%`;
            
            if (isAdmin && event.organizer) {
                row += `,"${event.organizer.name || 'N/A'}","${event.organizer.email || 'N/A'}"`;
            }
            
            csvContent += row + "\n";
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `event-analytics-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Analytics data exported successfully!');
    };

    // Get unique categories, organizers, and locations for filters
    const categories = [...new Set(events.map(event => event.category))];
    const organizers = isAdmin ? [...new Map(events
        .filter(event => event.organizer)
        .map(event => [event.organizer._id, event.organizer])
    ).values()] : [];
    const locations = [...new Set(events.map(event => event.location))];

    // Calculate all analytics data based on current filters
    const filteredEvents = getFilteredEvents();
    const stats = calculateTotalStats(filteredEvents);
    const chartData = formatChartData();
    const categoryData = getCategoryData();
    const monthlyTrends = getMonthlyTrends();
    const revenueVsTicketData = getRevenueVsTicketData();
    const insights = getKeyInsights();

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <h3 style={styles.errorTitle}>Error Loading Analytics</h3>
                <p style={styles.errorMessage}>{error}</p>
                <button onClick={fetchAnalytics} style={styles.retryButton}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                select option {
                    background-color: #1a1a2e !important;
                    color: #fff !important;
                    padding: 10px !important;
                    border: none !important;
                }
                select option:hover {
                    background-color: #977DFF !important;
                    color: #fff !important;
                }
                select option:checked {
                    background-color: #977DFF !important;
                    color: #fff !important;
                }
                `}
            </style>
            
            <div style={styles.header}>
                <h1 style={styles.title}>Event Analytics Dashboard</h1>
                <p style={styles.subtitle}>
                    {isAdmin 
                        ? "Comprehensive insights into your event performance" 
                        : "Comprehensive insights into your event performance"}
                </p>
                <div style={styles.filterStatus}>
                    Showing {filteredEvents.length} of {events.length} events
                    {(dateFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all' || timeFilter !== 'all' || (isAdmin && organizerFilter !== 'all')) && 
                        <span style={styles.filterBadge}>FILTERED</span>
                    }
                </div>
            </div>

            {/* Filter Controls */}
            <div style={styles.filterContainer}>
                <select 
                    value={dateFilter} 
                    onChange={(e) => setDateFilter(e.target.value)}
                    style={styles.select}
                >
                    <option value="all">📅 All Time</option>
                    <option value="week">📅 Last Week</option>
                    <option value="month">📅 Last Month</option>
                    <option value="quarter">📅 Last Quarter</option>
                    <option value="year">📅 Last Year</option>
                </select>
                
                <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={styles.select}
                >
                    <option value="all">🎯 All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>🎯 {cat}</option>
                    ))}
                </select>
                
                <select 
                    value={locationFilter} 
                    onChange={(e) => setLocationFilter(e.target.value)}
                    style={styles.select}
                >
                    <option value="all">📍 All Locations</option>
                    {locations.map(loc => (
                        <option key={loc} value={loc}>📍 {loc}</option>
                    ))}
                </select>
                
                <select 
                    value={timeFilter} 
                    onChange={(e) => setTimeFilter(e.target.value)}
                    style={styles.select}
                >
                    <option value="all">⏰ All Events</option>
                    <option value="upcoming">⏰ Upcoming Events</option>
                    <option value="past">⏰ Past Events</option>
                    <option value="this-month">⏰ This Month</option>
                    <option value="this-year">⏰ This Year</option>
                </select>
                
                {/* Organizer Filter for Admins */}
                {isAdmin && organizers.length > 0 && (
                    <select 
                        value={organizerFilter} 
                        onChange={(e) => setOrganizerFilter(e.target.value)}
                        style={styles.select}
                    >
                        <option value="all">👥 All Organizers</option>
                        {organizers.map(org => (
                            <option key={org._id} value={org._id}>
                                👤 {org.name}
                            </option>
                        ))}
                    </select>
                )}
                
                <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={styles.select}
                >
                    <option value="revenue">💰 Sort by Revenue</option>
                    <option value="tickets">🎫 Sort by Tickets</option>
                    <option value="percentage">📊 Sort by Attendance</option>
                </select>
                
                <button 
                    onClick={exportToCSV}
                    style={styles.exportButton}
                >
                    📊 Export Data
                </button>
            </div>

            {/* Statistics Cards */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>🎪</div>
                    <div style={styles.statNumber}>{animatedStats.totalEvents}</div>
                    <div style={styles.statLabel}>Total Events</div>
                    <div style={styles.statSubtext}>100% Active</div>
                </div>
                
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>🎫</div>
                    <div style={styles.statNumber}>{animatedStats.totalTicketsSold.toLocaleString()}</div>
                    <div style={styles.statLabel}>Tickets Sold</div>
                    <div style={styles.statSubtext}>Avg: 75 per event</div>
                </div>
                
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>💰</div>
                    <div style={styles.statNumber}>${animatedStats.totalRevenue.toLocaleString()}</div>
                    <div style={styles.statLabel}>Total Revenue</div>
                    <div style={styles.statSubtext}>Avg: $8,900 per event</div>
                </div>
                
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>🔥</div>
                    <div style={styles.statNumber}>{animatedStats.soldOutEvents}</div>
                    <div style={styles.statLabel}>Sold Out Events</div>
                    <div style={styles.statSubtext}>20% Success Rate</div>
                </div>
            </div>

            {/* Key Insights */}
            <div style={styles.insightsSection}>
                <h2 style={styles.sectionTitle}>💡 Key Insights & Recommendations</h2>
                <div style={styles.insightsGrid}>
                    <div style={styles.insightCard}>
                        <div style={styles.insightIcon}>🏆</div>
                        <div style={styles.insightText}>
                            Best performer: "{insights.bestPerformer}" with ${insights.bestPerformerRevenue.toLocaleString()} revenue
                        </div>
                    </div>
                    
                    <div style={styles.insightCard}>
                        <div style={styles.insightIcon}>📊</div>
                        <div style={styles.insightText}>
                            Average attendance rate: {insights.avgAttendance}%
                        </div>
                    </div>
                    
                    <div style={styles.insightCard}>
                        <div style={styles.insightIcon}>🎯</div>
                        <div style={styles.insightText}>
                            Top category: {insights.topCategory} ({insights.topCategoryRevenue ? events.filter(e => e.category === insights.topCategory).length : 0} events, ${insights.topCategoryRevenue.toLocaleString()})
                        </div>
                    </div>
                    
                    <div style={styles.insightCard}>
                        <div style={styles.insightIcon}>🔥</div>
                        <div style={styles.insightText}>
                            {insights.soldOutEvents} event(s) sold out - consider increasing capacity for similar events
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div style={styles.chartsContainer}>
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>🎯 Event Performance Overview</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(196, 181, 253, 0.2)" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#C4B5FD"
                                fontSize={12}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis stroke="#C4B5FD" fontSize={12} />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'rgba(151, 125, 255, 0.9)',
                                    border: '1px solid rgba(196, 181, 253, 0.3)',
                                    borderRadius: '12px',
                                    color: '#fff'
                                }}
                            />
                            <Bar 
                                dataKey="percentage" 
                                fill="#977DFF" 
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={styles.chartsRow}>
                    {categoryData.length > 0 && (
                        <div style={styles.chartCard}>
                            <h3 style={styles.chartTitle}>🎨 Revenue by Category</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="revenue"
                                        label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                        contentStyle={{
                                            backgroundColor: 'rgba(151, 125, 255, 0.9)',
                                            border: '1px solid rgba(196, 181, 253, 0.3)',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{
                                            color: '#C4B5FD'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>📈 Monthly Revenue Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(196, 181, 253, 0.2)" />
                                <XAxis 
                                    dataKey="month" 
                                    stroke="#C4B5FD"
                                    fontSize={12}
                                />
                                <YAxis stroke="#C4B5FD" fontSize={12} />
                                <Tooltip 
                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                    contentStyle={{
                                        backgroundColor: 'rgba(151, 125, 255, 0.9)',
                                        border: '1px solid rgba(196, 181, 253, 0.3)',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#977DFF" 
                                    fill="rgba(151, 125, 255, 0.3)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>💰 Revenue vs Ticket Sales Analysis</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={revenueVsTicketData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(196, 181, 253, 0.2)" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#C4B5FD"
                                fontSize={12}
                            />
                            <YAxis yAxisId="left" stroke="#C4B5FD" fontSize={12} />
                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'rgba(151, 125, 255, 0.9)',
                                    border: '1px solid rgba(196, 181, 253, 0.3)',
                                    borderRadius: '12px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Line 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="tickets" 
                                stroke="#977DFF" 
                                strokeWidth={3}
                                dot={{ fill: '#977DFF', strokeWidth: 2, r: 6 }}
                                name="Tickets Sold"
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                                name="Revenue ($)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '20px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: '#C4B5FD'
    },
    loadingSpinner: {
        width: '50px',
        height: '50px',
        border: '4px solid rgba(196, 181, 253, 0.3)',
        borderTop: '4px solid #C4B5FD',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
    },
    loadingText: {
        fontSize: '18px',
        fontWeight: '500'
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        color: '#fff'
    },
    errorTitle: {
        fontSize: '24px',
        marginBottom: '10px',
        color: '#C4B5FD'
    },
    errorMessage: {
        fontSize: '16px',
        marginBottom: '30px',
        color: '#E2E8F0'
    },
    retryButton: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
        transition: 'all 0.3s ease'
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(151, 125, 255, 0.2)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    },
    title: {
        fontSize: '3rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 50%, #E9D5FF 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '10px',
        textShadow: '0 0 30px rgba(151, 125, 255, 0.5)'
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#E2E8F0',
        fontWeight: '400'
    },
    filterStatus: {
        marginTop: '15px',
        fontSize: '1rem',
        color: '#10b981',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    },
    filterBadge: {
        backgroundColor: '#977DFF',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: '600',
        letterSpacing: '1px'
    },
    filterContainer: {
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(151, 125, 255, 0.2)',
        padding: '25px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    },
    select: {
        padding: '12px 16px',
        borderRadius: '12px',
        border: '2px solid #977DFF',
        backgroundColor: 'rgba(151, 125, 255, 0.2)',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        minWidth: '150px',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)'
    },
    exportButton: {
        padding: '12px 20px',
        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
        transition: 'all 0.3s ease'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
    },
    statCard: {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(151, 125, 255, 0.2)',
        borderRadius: '20px',
        padding: '30px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease'
    },
    statIcon: {
        fontSize: '2.5rem',
        marginBottom: '15px',
        display: 'block'
    },
    statNumber: {
        fontSize: '2.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '8px',
        textShadow: '0 0 20px rgba(151, 125, 255, 0.3)'
    },
    statLabel: {
        fontSize: '1rem',
        color: '#E2E8F0',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginBottom: '5px'
    },
    statSubtext: {
        fontSize: '0.85rem',
        color: '#10b981',
        fontWeight: '400'
    },
    insightsSection: {
        marginBottom: '40px'
    },
    sectionTitle: {
        fontSize: '1.8rem',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '20px',
        textAlign: 'center'
    },
    insightsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '15px'
    },
    insightCard: {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(151, 125, 255, 0.2)',
        borderRadius: '15px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    },
    insightIcon: {
        fontSize: '2rem',
        flexShrink: 0
    },
    insightText: {
        fontSize: '0.95rem',
        color: '#E2E8F0',
        lineHeight: '1.5'
    },
    chartsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
    },
    chartsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '30px'
    },
    chartCard: {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(151, 125, 255, 0.2)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    },
    chartTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '25px',
        textAlign: 'center'
    }
};

export default EventAnalytics; 