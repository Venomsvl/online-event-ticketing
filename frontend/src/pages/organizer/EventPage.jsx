import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EventPage() {
  const { eventid } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/events/${eventid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Event not found');
        }

        const data = await response.json();
        setEvent(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventid]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate('/my-events')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h2>
        <button
          onClick={() => navigate('/my-events')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {event.image && (
          <div className="h-64 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Event Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleString()}</p>
                <p><span className="font-medium">Location:</span> {event.location}</p>
                <p><span className="font-medium">Category:</span> {event.category}</p>
                <p><span className="font-medium">Price:</span> ${event.ticket_price}</p>
                <p><span className="font-medium">Available Tickets:</span> {event.remaining_tickets}/{event.total_tickets}</p>
                <p><span className="font-medium">Status:</span> {event.event_status}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/my-events/${eventid}/edit`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Edit Event
            </button>
            <button
              onClick={() => navigate('/my-events')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPage; 