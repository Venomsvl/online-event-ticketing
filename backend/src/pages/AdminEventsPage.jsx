import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const AdminEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const { token } = useAuth();

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/api/v1/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [token]);

    const handleStatusUpdate = async (eventId, newStatus) => {
        try {
            await axios.put(
                `/api/v1/events/${eventId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Event ${newStatus} successfully`);
            fetchEvents(); // Refresh the events list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update event status');
        }
    };

    const filteredEvents = events.filter(event => 
        statusFilter === 'all' || event.event_status === statusFilter
    );

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Event Management</h1>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="all">All Events</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                </select>
            </div>

            {filteredEvents.length === 0 ? (
                <p className="text-gray-500">No events found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents.map(event => (
                        <div key={event._id} className="relative">
                            <EventCard event={event} />
                            {event.event_status === 'pending' && (
                                <div className="absolute bottom-4 right-4 space-x-2">
                                    <button
                                        onClick={() => handleStatusUpdate(event._id, 'approved')}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(event._id, 'declined')}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminEventsPage;
