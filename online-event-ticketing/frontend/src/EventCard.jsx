import React from 'react';
import { format } from 'date-fns';

function EventCard({ event, onEdit, onView, isOrganizer }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'declined':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="event-card">
      {event.image && (
        <div className="event-image">
          <img src={event.image} alt={event.title} />
        </div>
      )}
      
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="date">{formatDate(event.date)}</p>
        <p className="description">{event.description}</p>
        
        <div className="event-details">
          <p>Location: {event.location}</p>
          <p>Category: {event.category}</p>
          <p>Price: ${event.ticket_price}</p>
          <p>Available Tickets: {event.remaining_tickets}/{event.total_tickets}</p>
          {isOrganizer && (
            <p className="status" style={{ color: getStatusColor(event.event_status) }}>
              Status: {event.event_status}
            </p>
          )}
        </div>

        <div className="actions">
          <button onClick={onView} className="view-button">
            View Details
          </button>
          {isOrganizer && (
            <button onClick={onEdit} className="edit-button">
              Edit Event
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .event-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .event-card:hover {
          transform: translateY(-4px);
        }

        .event-image {
          height: 200px;
          overflow: hidden;
        }

        .event-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .event-content {
          padding: 1.5rem;
        }

        h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          color: #333;
        }

        .date {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .description {
          color: #444;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .event-details {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .event-details p {
          margin: 0.25rem 0;
        }

        .status {
          font-weight: bold;
          text-transform: capitalize;
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
        }

        .view-button {
          background-color: #007bff;
          color: white;
        }

        .view-button:hover {
          background-color: #0056b3;
        }

        .edit-button {
          background-color: #6c757d;
          color: white;
        }

        .edit-button:hover {
          background-color: #545b62;
        }
      `}</style>
    </div>
  );
}

export default EventCard; 