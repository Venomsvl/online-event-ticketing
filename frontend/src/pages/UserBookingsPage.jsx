import React, { useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCancel = (bookingId) => {
    fetch(`/api/user/bookings/${bookingId}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        }
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "2rem auto",
      padding: "2rem",
      background: "#18103a",
      borderRadius: "24px",
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)"
    }}>
      <h2 style={{ color: "#fff", marginBottom: "2rem" }}>Your Bookings</h2>
      {bookings.length === 0 ? (
        <p style={{ color: "#fff" }}>No bookings found.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem"
        }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={{ position: "relative" }}>
              <EventCard event={booking.event} />
              <div style={{ position: "absolute", top: 20, right: 20 }}>
                <button
                  onClick={() => handleCancel(booking.id)}
                  style={{
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.2)"
                  }}
                >
                  Cancel
                </button>
              </div>
              <div style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                fontWeight: "bold"
              }}>
                Quantity: {booking.quantity} &nbsp; | &nbsp; Price: ${booking.price}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;