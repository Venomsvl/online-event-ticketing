import React from 'react';
import { format } from 'date-fns';

function EventCard({
  event,
  onEdit,
  onView,
  isOrganizer,
  onStatusUpdate,
  isSelected,
  onSelect
}) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return '#28a745'; // green
      case 'pending':
      case 'pending approval':
        return '#ffc107'; // yellow
      case 'declined':
      case 'cancelled':
        return '#dc3545'; // red
      default:
        return '#6c757d'; // gray
    }
  };

  const handleCardClick = (e) => {
    if (e.target.type === 'checkbox') return;
    if (onSelect) onSelect();
  };

  return (
    <div className="event-card" onClick={handleCardClick} style={{ position: 'relative', cursor: onSelect ? 'pointer' : 'default' }}>
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="select-checkbox"
          aria-label="Select event"
        />
      )}

      {event.image && (
        <div className="event-image">
          <img src={event.image} alt={event.title || event.name} />
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(event.event_status || event.status) }}
          >
            {(event.event_status || event.status || '').charAt(0).toUpperCase() +
              (event.event_status || event.status || '').slice(1)}
          </span>
        </div>
      )}

      <div className="event-content">
        <h3>{event.title || event.name}</h3>
        <p className="date">{formatDate(event.date)}</p>
        <p className="description">{event.description}</p>

        <div className="event-details">
          <p>Location: {event.location}</p>
          <p>Category: {event.category || 'N/A'}</p>
          <p>Price: ${event.ticket_price ?? event.price ?? 0}</p>
          <p>
            Tickets: {event.remaining_tickets ?? event.ticketsSold ?? 0}/
            {event.total_tickets ?? event.totalTickets ?? 0}
          </p>
          {isOrganizer && (event.event_status || event.status) && (
            <p className="status-text" style={{ color: getStatusColor(event.event_status || event.status) }}>
              Status: {event.event_status || event.status}
            </p>
          )}
        </div>

        <div className="actions">
          {onView && (
            <button onClick={onView} className="view-button" type="button">
              View Details
            </button>
          )}
          {isOrganizer && onEdit && (
            <button onClick={onEdit} className="edit-button" type="button">
              Edit Event
            </button>
          )}
          {onStatusUpdate && (
            <button onClick={onStatusUpdate} className="status-update-button" type="button">
              Update Status
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .event-card {
          border: 1px solid #ddd;
          border-radius: 28px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          color: #333;
          position: relative;
          padding: 0;
        }

        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .select-checkbox {
          position: absolute;
          top: 1rem;
          left: 1rem;
          width: 1.5rem;
          height: 1.5rem;
          accent-color: #977dff;
          cursor: pointer;
          z-index: 10;
        }

        .event-image {
          position: relative;
          height: 200px;
          overflow: hidden;
          border-bottom: 1.5px solid rgba(151, 125, 255, 0.3);
        }

        .event-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-transform: capitalize;
          user-select: none;
        }

        .event-content {
          padding: 1.5rem;
          color: #fff;
        }

        h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
        }

        .date {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .description {
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .event-details {
          font-size: 0.95rem;
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .event-details p {
          margin: 0.25rem 0;
        }

        .status-text {
          font-weight: 600;
          text-transform: capitalize;
          margin-top: 0.5rem;
        }

        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s ease;
          user-select: none;
        }

        .view-button {
          background-color: #977dff;
          color: white;
        }

        .view-button:hover {
          background-color: #7a5edb;
        }

        .edit-button {
          background-color: #6c757d;
          color: white;
        }

        .edit-button:hover {
          background-color: #545b62;
        }

        .status-update-button {
          background-color: #28a745;
          color: white;
        }

        .status-update-button:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
}

export default EventCard;
