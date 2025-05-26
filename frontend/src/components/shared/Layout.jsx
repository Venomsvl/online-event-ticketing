import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    },
    header: {
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(151, 125, 255, 0.2)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    },
    logo: {
      height: 48,
      width: 'auto',
      display: 'block',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #977DFF 0%, #C4B5FD 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: 'none',
    },
    nav: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
    },
    link: {
      color: 'rgba(255,255,255,0.9)',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      padding: '0.5rem 1rem',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      position: 'relative',
      '&:hover': {
        color: '#977DFF',
        background: 'rgba(151, 125, 255, 0.1)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(151, 125, 255, 0.2)'
      }
    },
    logoutButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      border: 'none',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
      }
    },
    main: {
      flex: 1,
      minHeight: 'calc(100vh - 80px)',
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
        .nav-link {
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
        }
        .nav-link:hover {
          color: #977DFF;
          background: rgba(151, 125, 255, 0.1);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(151, 125, 255, 0.2);
        }
        .logo:hover {
          transform: scale(1.05);
        }
        .logout-btn {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }
        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }
        `}
      </style>
      <header style={styles.header}>
        <div style={styles.left}>
          <Link to="/">
            <img src="/LogoWhite.png" alt="Logo" style={styles.logo} className="logo" />
          </Link>
          <h1 style={styles.title}>✨ Tixify</h1>
        </div>
        <nav style={styles.nav}>
          <Link to="/" className="nav-link">🏠 Home</Link>
          {user?.role === "admin" && (
            <>
              <Link to="/admin/events" className="nav-link">⚙️ Manage Events</Link>
              <Link to="/admin/users" className="nav-link">👥 Manage Users</Link>
              <Link to="/admin/analytics" className="nav-link">📊 Analytics</Link>
            </>
          )}
          {user?.role === "organizer" && (
            <>
              <Link to="/my-events" className="nav-link">🎪 My Events</Link>
              <Link to="/my-events/analytics" className="nav-link">📈 Event Analytics</Link>
            </>
          )}
          {user ? (
            <>
              <Link to="/profile" className="nav-link">👤 Profile</Link>
              <button onClick={logout} className="logout-btn">
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">🔑 Login</Link>
              <Link to="/register" className="nav-link">📝 Register</Link>
            </>
          )}
        </nav>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
} 