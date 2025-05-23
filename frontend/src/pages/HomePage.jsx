import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConnectionTest from '../components/shared/ConnectionTest';

const styles = {
  container: {
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
  },
  heroSection: {
    position: 'relative',
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 50%, #E9D5FF 100%)',
    padding: '4rem 0',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.3)',
      pointerEvents: 'none'
    }
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(151, 125, 255, 0.8) 0%, rgba(196, 181, 253, 0.6) 50%, rgba(233, 213, 255, 0.4) 100%)',
    pointerEvents: 'none'
  },
  heroContent: {
    position: 'relative',
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 2rem',
    textAlign: 'center',
    zIndex: 1
  },
  welcomeSection: {
    marginBottom: '3rem'
  },
  welcomeText: {
    fontSize: '2rem',
    color: '#ffffff',
    marginBottom: '1rem',
    fontWeight: '300',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    '@media (min-width: 768px)': {
      fontSize: '2.5rem'
    }
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  logo: {
    width: '20rem',
    height: 'auto',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
    '@media (min-width: 768px)': {
      width: '24rem'
    }
  },
  heroDescription: {
    fontSize: '1.25rem',
    color: '#ffffff',
    marginBottom: '3rem',
    fontWeight: '300',
    maxWidth: '600px',
    margin: '0 auto 3rem auto',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    '@media (min-width: 768px)': {
      fontSize: '1.5rem'
    }
  },
  countdownContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto',
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '2rem'
    }
  },
  countdownBox: {
    padding: '2rem 1rem',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.2)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  },
  countdownNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    marginBottom: '0.5rem',
    '@media (min-width: 768px)': {
      fontSize: '3rem'
    }
  },
  countdownLabel: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  eventSection: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 50%, #E9D5FF 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(151, 125, 255, 0.5)'
  },
  eventList: {
    position: 'relative',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    paddingBottom: '2rem',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  eventContainer: {
    display: 'flex',
    gap: '2rem',
    paddingBottom: '1rem',
  },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    flex: '0 0 auto',
    width: '20rem',
    overflow: 'hidden',
    border: '1px solid rgba(151, 125, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '@media (min-width: 768px)': {
      width: '22rem'
    }
  },
  eventImage: {
    width: '100%',
    height: '12rem',
    objectFit: 'cover',
  },
  eventDate: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(151, 125, 255, 0.3)',
    backdropFilter: 'blur(10px)'
  },
  eventContent: {
    padding: '1.5rem'
  },
  eventTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#ffffff',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  eventInfo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '1rem',
    marginBottom: '1rem',
    lineHeight: '1.5'
  },
  eventFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem'
  },
  eventPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#977DFF',
    textShadow: '0 0 10px rgba(151, 125, 255, 0.3)'
  },
  bookButton: {
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(151, 125, 255, 0.4)'
    }
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
    padding: '1rem',
    borderRadius: '50%',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(151, 125, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
    '&:hover': {
      transform: 'translateY(-50%) scale(1.1)',
      boxShadow: '0 6px 20px rgba(151, 125, 255, 0.4)'
    }
  },
  leftButton: {
    left: '-1rem'
  },
  rightButton: {
    right: '-1rem'
  },
  categoriesSection: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  categoriesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  categoriesTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 50%, #E9D5FF 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(151, 125, 255, 0.5)'
  },
  categoriesLink: {
    color: '#C4B5FD',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#977DFF',
      textShadow: '0 0 10px rgba(151, 125, 255, 0.5)'
    }
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  categoryCard: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    aspectRatio: '1',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(151, 125, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 30px rgba(151, 125, 255, 0.3)'
    }
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  categoryOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(151, 125, 255, 0.3) 50%, transparent 100%)'
  },
  categoryName: {
    position: 'absolute',
    bottom: '1.5rem',
    left: '1.5rem',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '1.1rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  }
};

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [countdown, setCountdown] = useState({
    days: '12',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Update countdown every second
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch events from API
    fetchEvents();
  }, []);

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

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to sample events if API fails
      setEvents([
        {
          id: 1,
          title: 'Summer Music Festival',
          date: '2024-07-15',
          time: '18:00',
          location: 'Central Park',
          image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=500&h=300&fit=crop',
          price: '50.00'
        },
        {
          id: 2,
          title: 'Tech Conference 2024',
          date: '2024-08-20',
          time: '09:00',
          location: 'Convention Center',
          image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&h=300&fit=crop',
          price: '199.00'
        },
        {
          id: 3,
          title: 'Food & Wine Festival',
          date: '2024-09-10',
          time: '12:00',
          location: 'City Square',
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop',
          price: '75.00'
        },
        {
          id: 4,
          title: 'Comedy Night',
          date: '2024-07-25',
          time: '20:00',
          location: 'Laugh Factory',
          image: 'https://images.unsplash.com/photo-1485282826741-1b5d56f7e268?w=500&h=300&fit=crop',
          price: '35.00'
        }
      ]);
    }
  };

  const scrollEvents = (direction) => {
    const container = document.getElementById('eventContainer');
    const scrollAmount = window.innerWidth >= 768 ? 400 : 300;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const bookEvent = (eventId) => {
    // Check if user is logged in
    const isLoggedIn = false; // This should be determined by your authentication logic
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    // Handle booking logic here
    console.log('Booking event:', eventId);
  };

  const createEventCard = (event) => {
    const date = new Date(event.date);
    return (
      <div key={event.id} style={styles.eventCard} className="event-card">
        <div style={{ position: 'relative' }}>
          <img src={event.image} alt={event.title} style={styles.eventImage} />
          <div style={styles.eventDate}>
            {date.getDate()} {date.toLocaleString('default', { month: 'short' }).toUpperCase()}
          </div>
        </div>
        <div style={styles.eventContent}>
          <h3 style={styles.eventTitle}>{event.title}</h3>
          <div style={styles.eventInfo}>
            <p>📅 {date.toLocaleDateString()} at {event.time}</p>
            <p>📍 {event.location}</p>
          </div>
          <div style={styles.eventFooter}>
            <span style={styles.eventPrice}>${event.price}</span>
            <button
              onClick={() => bookEvent(event.id)}
              style={styles.bookButton}
            >
              🎫 Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .countdown-box:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(151, 125, 255, 0.2);
        }
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(151, 125, 255, 0.3);
        }
        .category-card:hover .category-image {
          transform: scale(1.1);
        }
        .scroll-btn:hover {
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(151, 125, 255, 0.4);
        }
        `}
      </style>

      {/* Hero Section with Countdown */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <div style={styles.welcomeSection}>
            <div style={styles.welcomeText}>✨ Welcome to</div>
            <div style={styles.logoContainer}>
              <img
                src="/images/take3gradient.png"
                alt="Tixify"
                style={styles.logo}
                onError={(e) => {
                  e.target.onerror = null;
                  console.error('Error loading logo:', e.target.src);
                  e.target.classList.add('error-loading');
                }}
              />
            </div>
            <p style={styles.heroDescription}>
              🎪 Discover amazing events happening locally and globally. From concerts to conferences, we've got you covered!
            </p>
          </div>

          {/* Enhanced Countdown Timer */}
          <div style={styles.countdownContainer}>
            <div style={styles.countdownBox} className="countdown-box">
              <div style={styles.countdownNumber}>{countdown.days}</div>
              <div style={styles.countdownLabel}>Days</div>
            </div>
            <div style={styles.countdownBox} className="countdown-box">
              <div style={styles.countdownNumber}>{countdown.hours}</div>
              <div style={styles.countdownLabel}>Hours</div>
            </div>
            <div style={styles.countdownBox} className="countdown-box">
              <div style={styles.countdownNumber}>{countdown.minutes}</div>
              <div style={styles.countdownLabel}>Minutes</div>
            </div>
            <div style={styles.countdownBox} className="countdown-box">
              <div style={styles.countdownNumber}>{countdown.seconds}</div>
              <div style={styles.countdownLabel}>Seconds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Event List Section */}
      <div style={styles.eventSection}>
        <h2 style={styles.sectionTitle}>🎟️ Featured Events</h2>
        <div style={{ position: 'relative' }}>
          <div style={styles.eventList}>
            <div style={styles.eventContainer} id="eventContainer">
              {events.map(createEventCard)}
            </div>
          </div>
          {/* Enhanced Navigation Arrows */}
          <button
            style={{ ...styles.scrollButton, ...styles.leftButton }}
            className="scroll-btn"
            onClick={() => scrollEvents('left')}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            style={{ ...styles.scrollButton, ...styles.rightButton }}
            className="scroll-btn"
            onClick={() => scrollEvents('right')}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced Event Categories */}
      <div style={styles.categoriesSection}>
        <div style={styles.categoriesHeader}>
          <h2 style={styles.categoriesTitle}>🎨 Event Categories</h2>
          <Link to="/categories" style={styles.categoriesLink}>
            Explore all categories →
          </Link>
        </div>
        <div style={styles.categoriesGrid}>
          <Link to="/category/music" style={{ display: 'block' }}>
            <div style={styles.categoryCard} className="category-card">
              <img
                src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop"
                alt="Music"
                style={styles.categoryImage}
                className="category-image"
              />
              <div style={styles.categoryOverlay}></div>
              <div style={styles.categoryName}>🎵 Music</div>
            </div>
          </Link>
          <Link to="/category/tech" style={{ display: 'block' }}>
            <div style={styles.categoryCard} className="category-card">
              <img
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&h=300&fit=crop"
                alt="Technology"
                style={styles.categoryImage}
                className="category-image"
              />
              <div style={styles.categoryOverlay}></div>
              <div style={styles.categoryName}>💻 Technology</div>
            </div>
          </Link>
          <Link to="/category/food" style={{ display: 'block' }}>
            <div style={styles.categoryCard} className="category-card">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop"
                alt="Food & Drink"
                style={styles.categoryImage}
                className="category-image"
              />
              <div style={styles.categoryOverlay}></div>
              <div style={styles.categoryName}>🍽️ Food & Drink</div>
            </div>
          </Link>
          <Link to="/category/sports" style={{ display: 'block' }}>
            <div style={styles.categoryCard} className="category-card">
              <img
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop"
                alt="Sports"
                style={styles.categoryImage}
                className="category-image"
              />
              <div style={styles.categoryOverlay}></div>
              <div style={styles.categoryName}>⚽ Sports</div>
            </div>
          </Link>
          <Link to="/category/arts" style={{ display: 'block' }}>
            <div style={styles.categoryCard} className="category-card">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop"
                alt="Arts & Culture"
                style={styles.categoryImage}
                className="category-image"
              />
              <div style={styles.categoryOverlay}></div>
              <div style={styles.categoryName}>🎨 Arts & Culture</div>
            </div>
          </Link>
          <Link to="/category/business" style={{ display: 'block' }}>
            <div style={styles.categoryCard} className="category-card">
              <img
                src="https://images.unsplash.com/photo-1560472355-536de3962603?w=500&h=300&fit=crop"
                alt="Business"
                style={styles.categoryImage}
                className="category-image"
              />
              <div style={styles.categoryOverlay}></div>
              <div style={styles.categoryName}>💼 Business</div>
            </div>
          </Link>
        </div>
      </div>

      <ConnectionTest />
    </div>
  );
};

export default HomePage;
