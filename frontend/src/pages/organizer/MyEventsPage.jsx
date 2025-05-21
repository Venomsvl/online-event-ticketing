import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../../components/EventCard';

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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/events/my/events', {
        headers: {
          'Authorization': `Bearer ${token}`
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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
        <button 
          onClick={handleCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
            <button 
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Create Your First Event
            </button>
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
    </div>
  );
}

export default MyEventsPage; 