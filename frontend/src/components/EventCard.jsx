import React from 'react';
import { format } from 'date-fns';

const EventCard = ({ event, onStatusUpdate, isSelected, onSelect }) => {
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

    const statusStyle = {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        fontSize: '0.875rem',
        fontWeight: '500',
        background: event.status === 'active' ? 'rgba(16, 185, 129, 0.9)' : 
                   event.status === 'cancelled' ? 'rgba(239, 68, 68, 0.9)' : 
                   'rgba(245, 158, 11, 0.9)',
        color: '#fff',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.2)',
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

    const handleClick = (e) => {
        if (e.target.type === 'checkbox') return;
        if (onSelect) onSelect();
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
                    src={event.image || 'https://via.placeholder.com/400x200'} 
                    alt={event.name}
                    style={imageStyle}
                />
                <span style={statusStyle}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
            </div>
            <div style={contentStyle}>
                <h3 style={titleStyle}>{event.name}</h3>
                <p style={descriptionStyle}>{event.description}</p>
                <div style={infoStyle}>
                    <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(event.date), 'PPP')}
                </div>
                <div style={infoStyle}>
                    <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                </div>
                <div style={infoStyle}>
                    <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    {event.ticketsSold} / {event.totalTickets} tickets sold
                </div>
                <div style={infoStyle}>
                    <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${event.price}
                </div>
            </div>
        </div>
    );
};

export default EventCard; 