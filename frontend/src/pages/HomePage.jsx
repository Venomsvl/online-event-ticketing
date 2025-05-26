import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css'

function HomePage() {
  const [countdown, setCountdown] = useState({
    days: '12',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(now);
      target.setDate(target.getDate() + 12);
      const diff = target - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };

    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-purple-600 px-4 py-4 md:px-8 z-50">
        {/* ...navigation code... */}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        {/* ...hero code... */}
      </section>

      {/* Events Section */}
      <section className="py-12 px-4 bg-purple-900 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Upcoming Events</h2>
          <div>
            {events.length === 0 ? (
              <p className="text-white">No events found.</p>
            ) : (
              events.map(event => (
                <div key={event._id} className="bg-purple-800 rounded-lg p-4 mb-4">
                  <h2 className="text-xl font-bold text-white">{event.title}</h2>
                  <p className="text-purple-200">{event.description}</p>
                  <p className="text-purple-200">{event.date}</p>
                  <p className="text-purple-200">{event.location}</p>
                  <p className="text-purple-200">{event.category}</p>
                  <p className="text-purple-200">{event.ticket_price}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 bg-purple-900 bg-opacity-50">
        {/* ...categories code... */}
      </section>
    </div>
  );
}

export default HomePage;