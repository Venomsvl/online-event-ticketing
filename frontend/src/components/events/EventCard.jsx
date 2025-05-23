import React, { useState } from 'react';
import { format } from 'date-fns';
import { eventAPI } from '../../utils/api';

const EventCard = ({ event, onStatusUpdate, isSelected, onSelect, isAdmin = false }) => {
    const [isBooking, setIsBooking] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(null);

    const cardStyle = {
        background: 'rgba(255,255,255,0.18)',
        borderRadius: '28px',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
        border: '1.5px solid rgba(151,125,255,0.3)',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        color: '#fff',
    };

    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderBottom: '1.5px solid rgba(151,125,255,0.3)',
    };

    const contentStyle = {
        padding: '1.5rem',
    };

    const titleStyle = {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.75rem',
        color: '#fff',
    };

    const descriptionStyle = {
        color: 'rgba(255,255,255,0.8)',
        marginBottom: '1rem',
        fontSize: '0.95rem',
        lineHeight: '1.5',
    };

    const infoStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.75rem',
        color: 'rgba(255,255,255,0.9)',
        fontSize: '0.95rem',
    };

    const iconStyle = {
        width: '1.25rem',
        height: '1.25rem',
        marginRight: '0.75rem',
        color: '#977DFF',
    };

    const getStatusStyle = (status) => {
        const baseStyle = {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: '600',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        };
        
        const displayStatus = status === 'declined' ? 'rejected' : status;
        
        switch (displayStatus) {
            case 'approved':
                return {
                    ...baseStyle,
                    background: 'rgba(16, 185, 129, 0.9)',
                    color: '#fff',
                };
            case 'rejected':
                return {
                    ...baseStyle,
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: '#fff',
                };
            case 'pending':
                return {
                    ...baseStyle,
                    background: 'rgba(245, 158, 11, 0.9)',
                    color: '#fff',
                };
            default:
                return {
                    ...baseStyle,
                    background: 'rgba(75, 85, 99, 0.9)',
                    color: '#fff',
                };
        }
    };

    const checkboxStyle = {
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        width: '1.5rem',
        height: '1.5rem',
        accentColor: '#977DFF',
        cursor: 'pointer',
        zIndex: 1,
    };

    const adminButtonStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        flex: '1',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const approveButtonStyle = {
        ...adminButtonStyle,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    };

    const rejectButtonStyle = {
        ...adminButtonStyle,
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
    };

    const bookButtonStyle = {
        background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
        color: '#fff',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        border: 'none',
        cursor: isBooking || event.ticketsSold >= event.totalTickets ? 'not-allowed' : 'pointer',
        opacity: isBooking || event.ticketsSold >= event.totalTickets ? 0.7 : 1,
        width: '100%',
        marginTop: '1rem',
        fontSize: '1rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
    };

    const handleClick = (e) => {
        if (e.target.type === 'checkbox') return;
        if (onSelect) onSelect();
    };

    const handleBookTicket = async () => {
        try {
            setIsBooking(true);
            setError(null);
            const response = await eventAPI.bookTicket(event._id, {
                quantity: 1,
            });
            if (response.data.success) {
                alert('Ticket booked successfully!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book ticket');
        } finally {
            setIsBooking(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (showConfirmation === newStatus) {
            try {
                setIsUpdating(true);
                setError(null);
                await onStatusUpdate(event._id, newStatus);
                setShowConfirmation(null);
            } catch (err) {
                setError(err.message || `Failed to ${newStatus} event`);
            } finally {
                setIsUpdating(false);
            }
        } else {
            setShowConfirmation(newStatus);
            setTimeout(() => setShowConfirmation(null), 5000);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return '✅';
            case 'rejected':
            case 'declined': return '❌';
            case 'pending': return '⏳';
            default: return '📋';
        }
    };

    // Extract event data from various possible backend formats
    const eventData = {
        title: event.title || event.name || 'Untitled Event',
        description: event.description || 'No description available',
        date: event.date || event.event_date || new Date(),
        location: event.location || event.venue || 'Location TBD',
        category: event.category || 'General',
        price: event.price || event.ticket_price || 0,
        ticketsSold: event.ticketsSold || event.tickets_sold || (event.total_tickets - event.remaining_tickets) || 0,
        totalTickets: event.totalTickets || event.total_tickets || 100,
        status: event.status || event.event_status || 'pending',
        image: event.image || event.poster_image || 'https://via.placeholder.com/400x200',
        organizer: event.organizer || (event.organizer_id ? { name: 'Unknown', email: 'unknown@email.com' } : null)
    };

    return (
        <div style={cardStyle} onClick={handleClick}>
            {onSelect && (
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onSelect}
                    style={checkboxStyle}
                />
            )}
            <div style={{ position: 'relative' }}>
                <img 
                    src={eventData.image} 
                    alt={eventData.title}
                    style={imageStyle}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200';
                    }}
                />
                <span style={getStatusStyle(eventData.status)}>
                    {getStatusIcon(eventData.status)} {eventData.status?.charAt(0).toUpperCase() + eventData.status?.slice(1)}
                </span>
            </div>
            <div style={contentStyle}>
                <h3 style={titleStyle}>{eventData.title}</h3>
                <p style={descriptionStyle}>{eventData.description}</p>
                
                <div style={infoStyle}>
                    <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(eventData.date), 'PPP')}
                </div>
                
                <div style={infoStyle}>
                    <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {eventData.location}
                </div>
                
                {eventData.category && (
                    <div style={infoStyle}>
                        <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {eventData.category}
                    </div>
                )}
                
                <div style={infoStyle}>
                    <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    {eventData.ticketsSold} / {eventData.totalTickets} tickets sold
                </div>
                
                <div style={infoStyle}>
                    <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${eventData.price}
                </div>

                {isAdmin && eventData.organizer && (
                    <div style={infoStyle}>
                        <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {eventData.organizer.name} ({eventData.organizer.email})
                    </div>
                )}

                                {isAdmin ? (                    <div style={{ marginTop: '1.5rem' }}>                        <div style={{                            background: 'rgba(151, 125, 255, 0.1)',                            border: '1px solid rgba(151, 125, 255, 0.3)',                            borderRadius: '12px',                            padding: '1rem',                            textAlign: 'center',                            color: '#C4B5FD'                        }}>                            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>                                💡 Use the dropdown above to change event status instantly                            </p>                        </div>                    </div>
                ) : (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBookTicket();
                        }}
                        disabled={isBooking || eventData.ticketsSold >= eventData.totalTickets}
                        style={bookButtonStyle}
                    >
                        {isBooking ? '⏳ Booking...' : 
                         eventData.ticketsSold >= eventData.totalTickets ? '🎫 Sold Out' : 
                         '🎫 Book Ticket'}
                    </button>
                )}
                
                {error && (
                    <div style={{
                        color: '#ef4444',
                        marginTop: '0.75rem',
                        fontSize: '0.875rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        textAlign: 'center'
                    }}>
                        ⚠️ {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard; 