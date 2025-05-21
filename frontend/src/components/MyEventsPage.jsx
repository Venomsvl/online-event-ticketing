import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../../online-event-ticketing/frontend/src/EventCard';

function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/events/my/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/my-events/new');
  };

  const handleEditEvent = (eventId) => {
    navigate(`/my-events/${eventId}/edit`);
  };

  const handleViewEvent = (eventId) => {
    navigate(`/my-events/${eventId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="my-events-page">
      <div className="header">
        <h1>My Events</h1>
        <button 
          onClick={handleCreateNew}
          className="create-button"
        >
          Create New Event
        </button>
      </div>

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="no-events">
            <p>You haven't created any events yet.</p>
            <button onClick={handleCreateNew}>Create Your First Event</button>
          </div>
        ) : (
          events.map(event => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={() => handleEditEvent(event._id)}
              onView={() => handleViewEvent(event._id)}
              isOrganizer={true}
            />
          ))
        )}
      </div>

      <style jsx>{`
        .my-events-page {
          padding: 2rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .create-button {
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .create-button:hover {
          background-color: #0056b3;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .no-events {
          text-align: center;
          padding: 2rem;
          grid-column: 1 / -1;
        }

        .no-events button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default MyEventsPage;