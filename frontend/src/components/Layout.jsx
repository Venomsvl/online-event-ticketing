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
    main: {
      flex: 1,
      padding: '1rem',
    }
  };

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
} 