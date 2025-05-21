import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    logo: {
      height: 48,
      width: 'auto',
      display: 'block',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
    },
    nav: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '1rem',
    },
    logoutButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: '1rem',
    },
    main: {
      flex: 1,
      padding: '1rem',
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.left}>
          <Link to="/">
            <img src="/LogoWhite.png" alt="Logo" style={styles.logo} />
          </Link>
          <h1 style={styles.title}>Event Ticketing System</h1>
        </div>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Home</Link>
          {user?.role === "admin" && (
            <>
              <Link to="/admin/events" style={styles.link}>Manage Events</Link>
              <Link to="/admin/analytics" style={styles.link}>Analytics</Link>
            </>
          )}
          {user?.role === "organizer" && (
            <>
              <Link to="/my-events" style={styles.link}>My Events</Link>
              <Link to="/my-events/analytics" style={styles.link}>Event Analytics</Link>
            </>
          )}
          {user && (
            <button onClick={logout} style={styles.logoutButton}>
              Logout
            </button>
          )}
        </nav>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
} 