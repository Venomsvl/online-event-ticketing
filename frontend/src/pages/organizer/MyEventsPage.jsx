import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../../components/EventCard';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events/organizer');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
        <Link
          to="/my-events/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You haven't created any events yet.</p>
          <Link
            to="/my-events/new"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              isOrganizer={true}
              onEdit={() => navigate(`/my-events/${event._id}/edit`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage; 