import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
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

  // Add navigation buttons styles
  const navButtonsStyle = {
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    display: 'flex',
    gap: '1rem',
    zIndex: 50,
  };

  const navButtonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const primaryButtonStyle = {
    ...navButtonStyle,
    background: 'linear-gradient(135deg, #977DFF 0%, #6B46C1 100%)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
  };

  const secondaryButtonStyle = {
    ...navButtonStyle,
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    border: '1px solid rgba(151, 125, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  };

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
    axios.get('/api/v1/events')
      .then(res => setEvents(res.data))
      .catch(err => {
        console.error(err);
        toast.error('Failed to fetch events');
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getMonthAbbr = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  };

  const getDay = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Buttons */}
      <div style={navButtonsStyle} className="nav-buttons-container">
        <Link 
          to="/register" 
          style={primaryButtonStyle} 
          className="nav-button primary"
        >
          ✨ Register
        </Link>
        <Link 
          to="/login" 
          style={secondaryButtonStyle} 
          className="nav-button secondary"
        >
          🔑 Login
        </Link>
        <Link 
          to="/create-event" 
          style={secondaryButtonStyle} 
          className="nav-button secondary"
        >
          🎪 Create Event
        </Link>
        <Link 
          to="/contact" 
          style={secondaryButtonStyle} 
          className="nav-button secondary"
        >
          📧 Contact
        </Link>
      </div>

      {/* Hero Section */}
      <section className="welcome-section hero-section flex flex-col items-center justify-center min-h-screen bg-[#2D1B69] text-center px-4">
        <div className="hero-content">
          <h1 className="welcome-text text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-200">
            Welcome to
          </h1>
          <div className="logo-container mb-12 transform hover:scale-105 transition-transform duration-300">
            <img
              src="/take3gradient.png"
              alt="Tixify Logo"
              className="w-80 h-40 object-contain mx-auto logo-animation"
            />
          </div>
          <p className="text-xl md:text-2xl mb-16 text-gray-200 max-w-2xl mx-auto">
            Explore the vibrant events happening locally and globally.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <div className="countdown-box bg-[#1a103f] p-6 rounded-lg w-28">
              <span className="countdown-number text-4xl font-bold block">{countdown.days}</span>
              <span className="countdown-label text-sm">Days</span>
            </div>
            <div className="countdown-box bg-[#1a103f] p-6 rounded-lg w-28">
              <span className="countdown-number text-4xl font-bold block">{countdown.hours}</span>
              <span className="countdown-label text-sm">Hours</span>
            </div>
            <div className="countdown-box bg-[#1a103f] p-6 rounded-lg w-28">
              <span className="countdown-number text-4xl font-bold block">{countdown.minutes}</span>
              <span className="countdown-label text-sm">Minutes</span>
            </div>
            <div className="countdown-box bg-[#1a103f] p-6 rounded-lg w-28">
              <span className="countdown-number text-4xl font-bold block">{countdown.seconds}</span>
              <span className="countdown-label text-sm">Seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map(event => (
              <div key={event._id} className="event-card bg-[#2D1B69] rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={event.image || 'https://via.placeholder.com/400x200'}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#8B5CF6] text-white px-3 py-1 rounded-md">
                    <div className="text-sm font-bold">{getDay(event.date)} {getMonthAbbr(event.date)}</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">{formatDate(event.date)}</p>
                  <p className="text-sm text-gray-300 mb-4">{event.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8B5CF6] font-bold">${event.price}</span>
                    <Link to={`/event/${event._id}`}>
                      <button className="bg-[#8B5CF6] text-white px-6 py-2 rounded-md hover:bg-[#7C3AED] transition-colors">
                        Book Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Event Categories</h2>
            <Link to="/categories" className="text-[#8B5CF6] hover:text-[#7C3AED]">
              See all categories →
            </Link>
          </div>
          {/* Add your categories grid here */}
        </div>
      </section>
    </div>
  );
}

export default HomePage;