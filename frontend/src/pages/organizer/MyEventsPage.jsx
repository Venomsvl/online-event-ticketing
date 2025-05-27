import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../../components/EventCard';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(storedEvents);
    setLoading(false);
  }, []);

  const handleCreateNew = () => {
    navigate('/my-events/new');
  };

  const handleEditEvent = (eventId) => {
    navigate(`/my-events/${eventId}/edit`);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleViewEvent = (eventId) => {
    // Just show event details in a modal or navigate to details page
    const event = events.find(e => e.id === eventId);
    if (event) {
      alert(`
        Event Details:
        Title: ${event.title}
        Description: ${event.description}
        Date: ${event.date}
        Time: ${event.time}
        Location: ${event.location}
        Category: ${event.category}
        Price: $${event.price}
        Available Tickets: ${event.totalTickets}
      `);
    }
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
              key={event.id}
              event={event}
              onEdit={() => handleEditEvent(event.id)}
              onView={() => handleViewEvent(event.id)}
              onDelete={() => handleDeleteEvent(event.id)}
              isOrganizer={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyEventsPage; 