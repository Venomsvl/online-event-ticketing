import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConnectionTest from '../components/shared/ConnectionTest';

const styles = {
  container: {
    backgroundColor: '#000000',
    color: '#ffffff'
  },
  heroSection: {
    position: 'relative',
    background: 'linear-gradient(to bottom right, #4C1D95, #7C3AED)',
    padding: '3rem 0',
    '@media (min-width: 768px)': {
      padding: '5rem 0'
    }
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    pointerEvents: 'none'
  },
  heroContent: {
    position: 'relative',
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1rem',
    textAlign: 'center'
  },
  welcomeSection: {
    marginBottom: '2rem'
  },
  welcomeText: {
    fontSize: '1.5rem',
    color: '#E9D5FF',
    marginBottom: '1rem',
    '@media (min-width: 768px)': {
      fontSize: '1.875rem'
    }
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem'
  },
  logo: {
    width: '16rem',
    height: 'auto',
    '@media (min-width: 768px)': {
      width: '20rem'
    }
  },
  heroDescription: {
    fontSize: '1.125rem',
    color: '#F3E8FF',
    marginBottom: '2rem',
    '@media (min-width: 768px)': {
      fontSize: '1.25rem',
      marginBottom: '3rem'
    }
  },
  countdownContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
    '@media (min-width: 768px)': {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '3rem'
    }
  },
  countdownBox: {
    padding: '1rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(76, 29, 149, 0.5)'
  },
  countdownNumber: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    '@media (min-width: 768px)': {
      fontSize: '2.25rem'
    }
  },
  countdownLabel: {
    fontSize: '0.875rem',
    color: '#D8B4FE'
  },
  eventSection: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '2rem 1rem',
    '@media (min-width: 768px)': {
      padding: '3rem 1rem'
    }
  },
  eventList: {
    position: 'relative',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  eventContainer: {
    display: 'flex',
    gap: '1rem',
    paddingBottom: '1rem',
    '@media (min-width: 768px)': {
      gap: '1.5rem'
    }
  },
  eventCard: {
    backgroundColor: '#4C1D95',
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    flex: '0 0 auto',
    width: '18rem',
    overflow: 'hidden',
    '@media (min-width: 768px)': {
      width: '20rem'
    }
  },
  eventImage: {
    width: '100%',
    height: '10rem',
    objectFit: 'cover',
    '@media (min-width: 768px)': {
      height: '12rem'
    }
  },
  eventDate: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    backgroundColor: '#7C3AED',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem'
  },
  eventContent: {
    padding: '1rem'
  },
  eventTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#ffffff',
    '@media (min-width: 768px)': {
      fontSize: '1.25rem'
    }
  },
  eventInfo: {
    color: '#D8B4FE',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
    '@media (min-width: 768px)': {
      fontSize: '1rem'
    }
  },
  eventFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem'
  },
  eventPrice: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#C4B5FD'
  },
  bookButton: {
    backgroundColor: '#7C3AED',
    color: '#ffffff',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    '@media (min-width: 768px)': {
      padding: '0.5rem 1rem',
      fontSize: '1rem'
    },
    '&:hover': {
      backgroundColor: '#6D28D9'
    }
  },
  scrollButton: {
    display: 'none',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#7C3AED',
    padding: '0.5rem',
    borderRadius: '9999px',
    color: '#ffffff',
    '@media (min-width: 768px)': {
      display: 'block'
    },
    '&:hover': {
      backgroundColor: '#6D28D9'
    }
  },
  leftButton: {
    left: 0
  },
  rightButton: {
    right: 0
  },
  categoriesSection: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '2rem 1rem',
    '@media (min-width: 768px)': {
      padding: '3rem 1rem'
    }
  },
  categoriesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    '@media (min-width: 768px)': {
      marginBottom: '2rem'
    }
  },
  categoriesTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    '@media (min-width: 768px)': {
      fontSize: '1.5rem'
    }
  },
  categoriesLink: {
    color: '#C4B5FD',
    '&:hover': {
      color: '#D8B4FE'
    }
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem'
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(6, 1fr)'
    }
  },
  categoryCard: {
    position: 'relative',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    aspectRatio: '1'
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  categoryOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, #4C1D95, transparent)'
  },
  categoryName: {
    position: 'absolute',
    bottom: '1rem',
    left: '1rem',
    color: '#ffffff',
    fontWeight: 600
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
      <div key={event.id} style={styles.eventCard}>
        <div style={{ position: 'relative' }}>
          <img src={event.image} alt={event.title} style={styles.eventImage} />
          <div style={styles.eventDate}>
            {date.getDate()} {date.toLocaleString('default', { month: 'short' }).toUpperCase()}
          </div>
        </div>
        <div style={styles.eventContent}>
          <h3 style={styles.eventTitle}>{event.title}</h3>
          <div style={styles.eventInfo}>
            <p>{date.toLocaleDateString()} at {event.time}</p>
            <p>{event.location}</p>
          </div>
          <div style={styles.eventFooter}>
            <span style={styles.eventPrice}>${event.price}</span>
            <button
              onClick={() => bookEvent(event.id)}
              style={styles.bookButton}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Hero Section with Countdown */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <div style={styles.welcomeSection}>
            <div style={styles.welcomeText}>Welcome to</div>
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
              Explore the vibrant events happening locally and globally.
            </p>
          </div>

          {/* Countdown Timer */}
          <div style={styles.countdownContainer}>
            <div style={styles.countdownBox}>
              <div style={styles.countdownNumber}>{countdown.days}</div>
              <div style={styles.countdownLabel}>Days</div>
            </div>
            <div style={styles.countdownBox}>
              <div style={styles.countdownNumber}>{countdown.hours}</div>
              <div style={styles.countdownLabel}>Hours</div>
            </div>
            <div style={styles.countdownBox}>
              <div style={styles.countdownNumber}>{countdown.minutes}</div>
              <div style={styles.countdownLabel}>Minutes</div>
            </div>
            <div style={styles.countdownBox}>
              <div style={styles.countdownNumber}>{countdown.seconds}</div>
              <div style={styles.countdownLabel}>Seconds</div>
            </div>
          </div>
        </div>
      </div>

      {/* Event List Section */}
      <div style={styles.eventSection}>
        <div style={{ position: 'relative' }}>
          <div style={styles.eventList}>
            <div style={styles.eventContainer} id="eventContainer">
              {events.map(createEventCard)}
            </div>
          </div>
          {/* Navigation Arrows */}
          <button
            style={{ ...styles.scrollButton, ...styles.leftButton }}
            onClick={() => scrollEvents('left')}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            style={{ ...styles.scrollButton, ...styles.rightButton }}
            onClick={() => scrollEvents('right')}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Event Categories */}
      <div style={styles.categoriesSection}>
        <div style={styles.categoriesHeader}>
          <h2 style={styles.categoriesTitle}>Event Categories</h2>
          <Link to="/categories" style={styles.categoriesLink}>
            See all categories →
          </Link>
        </div>
        <div style={styles.categoriesGrid}>
          <Link to="/category/music" style={{ display: 'block' }}>
            <div style={styles.categoryCard}>
              <img
                src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop"
                alt="Music"
                style={styles.categoryImage}
              />
              <div style={styles.categoryOverlay}></div>
              <div style={styles.categoryName}>Music</div>
            </div>
          </Link>
          {/* Add more category cards as needed */}
        </div>
      </div>

      <ConnectionTest />
    </div>
  );
};

export default HomePage;
