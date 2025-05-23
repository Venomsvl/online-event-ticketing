import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user's bookings
    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/bookings');
            setBookings(response.data.bookings);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to fetch bookings');
            setLoading(false);
            toast.error('Failed to load bookings');
        }
    };

    // Cancel booking function
    const handleCancelBooking = async (bookingId) => {
        try {
            // Add confirmation dialog
            if (!window.confirm('Are you sure you want to cancel this booking?')) {
                return;
            }

            await axios.put(`http://localhost:3001/api/bookings/${bookingId}/cancel`);
            // Refresh bookings after cancellation
            fetchBookings();
            toast.success('Booking cancelled successfully');
        } catch (err) {
            console.error('Error cancelling booking:', err);
            toast.error('Failed to cancel booking');
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
            
            {bookings.length === 0 ? (
                <div className="text-center text-gray-500">
                    No bookings found
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => (
                        <div 
                            key={booking._id} 
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        {booking.eventId?.title || 'Event Name'}
                                    </h2>
                                    <div className="grid gap-1 text-gray-600">
                                        <p>Ticket Type: {booking.ticketType}</p>
                                        <p>Quantity: {booking.quantity}</p>
                                        <p>Total Price: ${booking.totalPrice}</p>
                                        <p>Status: <span className={`font-semibold ${
                                            booking.bookingStatus === 'CONFIRMED' ? 'text-green-600' :
                                            booking.bookingStatus === 'PENDING' ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>{booking.bookingStatus}</span></p>
                                    </div>
                                </div>
                                
                                {booking.bookingStatus !== 'CANCELLED' && (
                                    <button
                                        onClick={() => handleCancelBooking(booking._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookingsPage;
