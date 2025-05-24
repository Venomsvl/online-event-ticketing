import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [countdown, setCountdown] = useState({
    days: '12',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const events = [
  {
    id: 1,
      title: 'Summer Music Festival',
      date: '15/07/2024',
      time: '18:00',
      location: 'Central Park',
      image: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800&h=600&fit=crop',
      price: 50.00,
      tag: '15 JUL'
  },
  {
    id: 2,
      title: 'Tech Conference 2024',
      date: '20/08/2024',
      time: '09:00',
      location: 'Convention Center',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      price: 199.00,
      tag: '20 AUG'
  },
  {
    id: 3,
      title: 'Food & Wine Festival',
      date: '10/09/2024',
      time: '12:00',
      location: 'City Square',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      price: 75.00,
      tag: '10 SEPT'
  },
  {
    id: 4,
      title: 'Comedy Night',
      date: '25/07/2024',
    time: '20:00',
      location: 'Laugh Factory',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=600&fit=crop',
      price: 35.00,
      tag: '25 JUL'
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-purple-600 px-4 py-4 md:px-8 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">Tixify</div>
          
          <button 
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>

          <div className={`
            ${isMobileMenuOpen ? 'flex' : 'hidden'} 
            md:flex flex-col md:flex-row items-center gap-6 
            absolute md:relative top-full left-0 right-0 md:top-auto
            bg-purple-600 md:bg-transparent p-4 md:p-0
            ${isMobileMenuOpen ? 'border-t border-purple-500' : ''}
          `}>
            <Link to="/" className="text-white hover:text-purple-200">Home</Link>
            <Link to="/events" className="text-white hover:text-purple-200">Events</Link>
            <Link to="/about" className="text-white hover:text-purple-200">About</Link>
            <Link to="/contact" className="text-white hover:text-purple-200">Contact</Link>
            <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800">
              Create Event
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to</h1>
          <div className="text-5xl md:text-6xl font-bold text-white mb-8">Tixify</div>
          <p className="text-lg text-purple-100 mb-12 max-w-2xl mx-auto">
            Explore the vibrant events happening locally and globally.
          </p>

        {/* Countdown */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(countdown).map(([key, value]) => (
              <div key={key} className="bg-purple-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
                <div className="text-3xl font-bold text-white mb-2">{value}</div>
                <div className="text-purple-200 text-sm capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Events Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-purple-800 rounded-lg overflow-hidden shadow-lg">
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-purple-600 px-3 py-1 rounded-md text-white font-semibold">
                    {event.tag}
        </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-purple-200 mb-1">{event.date} at {event.time}</p>
                  <p className="text-purple-200 mb-4">{event.location}</p>
                  <p className="text-2xl font-bold text-white mb-4">
                    ${event.price.toFixed(2)}
                  </p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Book Now
                    </button>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>

    {/* Categories Section */}
      <section className="py-12 px-4 bg-purple-900 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Event Categories</h2>
            <Link to="/categories" className="text-purple-300 hover:text-purple-100">
              See all categories →
            </Link>
          </div>
          {/* Add categories grid here */}
      </div>
    </section>
  </div>
);
};

export default Home;