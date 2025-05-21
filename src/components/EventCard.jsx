import React from 'react';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {event.image && (
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(event.event_status)}`}>
                        {event.event_status}
                    </span>
                </div>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <div className="space-y-2">
                    <p className="text-sm">
                        <span className="font-medium">Date:</span>{' '}
                        {format(new Date(event.date), 'PPP')}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Location:</span> {event.location}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Category:</span> {event.category}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Price:</span> ${event.ticket_price}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Tickets:</span> {event.remaining_tickets} remaining
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
