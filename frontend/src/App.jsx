import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Unauthorized from './pages/Unauthorized'
import EventAnalytics from './pages/EventAnalytics'
import AdminEventsPage from './pages/AdminEventsPage'
import Profile from './pages/Profile'
import AdminLogin from './pages/AdminLogin'
import Home from './pages/Home'
import { useState } from 'react'

const headerStyles = {
  nav: {
    background: 'rgba(34, 18, 58, 0.72)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(124,58,237,0.18)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    zIndex: 100,
    height: 60,
    boxShadow: '0 6px 32px 0 rgba(124,58,237,0.10)',
    transition: 'background 0.2s',
  },
  navInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    marginLeft: 0,
  },
  logoImg: {
    height: 44,
    width: 'auto',
    display: 'block',
    filter: 'drop-shadow(0 2px 8px #a78bfa88)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: 18,
    fontWeight: 600,
    padding: '8px 0',
    transition: 'color 0.2s',
    lineHeight: 1,
    letterSpacing: '0.01em',
    borderRadius: 8,
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    position: 'relative',
    margin: '0 2px',
    boxShadow: 'none',
    background: 'none',
    outline: 'none',
    cursor: 'pointer',
  },
  navLinkHover: {
    color: '#a78bfa',
    background: 'rgba(124,58,237,0.08)',
    textDecoration: 'none',
    transition: 'color 0.2s, background 0.2s',
  },
  loginBtn: {
    background: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)',
    color: '#fff',
    padding: '8px 28px',
    borderRadius: 9999,
    fontWeight: 700,
    fontSize: 18,
    border: 'none',
    marginLeft: 8,
    cursor: 'pointer',
    transition: 'background 0.2s',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 2px 8px 0 rgba(124,58,237,0.08)',
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: 28,
  },
  mobileMenu: {
    display: 'none',
    background: '#7c3aed',
    padding: '16px 0',
    position: 'absolute',
    top: 60,
    left: 0,
    width: '100%',
    zIndex: 20,
  },
  mobileMenuLink: {
    display: 'block',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 24px',
    fontSize: 18,
    borderRadius: 8,
    margin: '4px 0',
    background: 'none',
    transition: 'background 0.2s',
  },
  mobileMenuLinkActive: {
    background: '#a78bfa',
  },
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const { user, logout } = useAuth();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Role-based menu links
  const userLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Event List' },
    { to: '/bookings', label: 'My Bookings' },
    { to: '/profile', label: 'Profile' },
    { to: '/forgot-password', label: 'Forgot Password' },
    { to: '/logout', label: 'Logout', onClick: logout },
  ];
  const organizerLinks = [
    ...userLinks,
    { to: '/my-events', label: 'My Events' },
    { to: '/my-events/new', label: 'New Event' },
    { to: '/my-events/analytics', label: 'Analytics' },
    { to: '/my-events/:id/edit', label: 'Edit Event' },
  ];
  const adminLinks = [
    ...organizerLinks,
    { to: '/admin/events', label: 'Admin Events' },
    { to: '/admin/users', label: 'Admin Users' },
  ];
  let menuLinks = userLinks;
  if (user?.role === 'organizer') menuLinks = organizerLinks;
  if (user?.role === 'admin') menuLinks = adminLinks;

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <nav style={headerStyles.nav}>
            <div style={headerStyles.navInner}>
              <Link to="/" style={headerStyles.logoLink}>
                <img src="/images/take4white flat.png" alt="Tixify" style={headerStyles.logoImg} />
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => setSearchOpen((open) => !open)}
                  style={{ background: '#fff', color: '#7c3aed', border: 'none', borderRadius: '9999px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer', marginRight: 8, boxShadow: '0 2px 8px 0 rgba(124,58,237,0.08)' }}
                  aria-label="Search"
                >
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
                </button>
                {searchOpen && (
                  <div style={{ position: 'absolute', top: 60, right: 32, background: 'rgba(34,18,58,0.98)', color: '#fff', borderRadius: 16, boxShadow: '0 4px 24px 0 rgba(31,38,135,0.10)', padding: 24, zIndex: 100, minWidth: 320, backdropFilter: 'blur(16px)' }}>
                    <div style={{ marginBottom: 12, fontWeight: 700, color: '#a78bfa', fontSize: 18 }}>Search Events</div>
                    <input
                      type="text"
                      placeholder="Event, artist, or location..."
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #a78bfa', marginBottom: 12, fontSize: 16, background: '#18102a', color: '#fff' }}
                    />
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>Or pick a date:</div>
                    <input
                      type="date"
                      value={searchDate}
                      onChange={e => setSearchDate(e.target.value)}
                      style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #a78bfa', fontSize: 16, background: '#18102a', color: '#fff' }}
                    />
                    <button style={{ marginTop: 16, width: '100%', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: 10, fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={() => setSearchOpen(false)}>Search</button>
                  </div>
                )}
                {!user && (
                  <Link to="/login" style={headerStyles.loginBtn}>Log in</Link>
                )}
                {user && (
                  <Link to="/profile" style={{ ...headerStyles.navLink, fontWeight: 700, fontSize: 20, marginLeft: 8 }}>
                    <svg width="28" height="28" fill="none" stroke="#a78bfa" strokeWidth="2.2" viewBox="0 0 24 24" style={{ marginRight: 4, verticalAlign: 'middle' }}><circle cx="12" cy="8" r="4" /><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" /></svg>
                  </Link>
                )}
                <button
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  style={{ background: 'rgba(124,58,237,0.12)', color: '#fff', border: 'none', borderRadius: '9999px', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, cursor: 'pointer', marginLeft: 8, boxShadow: '0 2px 8px 0 rgba(124,58,237,0.08)' }}
                  aria-label="Open menu"
                >
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              </div>
            </div>
            {/* Hamburger menu drawer */}
            {mobileMenuOpen && (
              <div style={{ position: 'fixed', top: 0, right: 0, width: 320, height: '100vh', background: 'rgba(34,18,58,0.98)', color: '#fff', zIndex: 200, boxShadow: '-8px 0 32px 0 rgba(124,58,237,0.18)', padding: 32, display: 'flex', flexDirection: 'column', gap: 18, transition: 'right 0.2s', backdropFilter: 'blur(16px)' }}>
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 32, alignSelf: 'flex-end', marginBottom: 16, cursor: 'pointer' }} aria-label="Close menu">&times;</button>
                {menuLinks.map(link => (
                  link.onClick ? (
                    <button key={link.label} onClick={link.onClick} style={{ ...headerStyles.navLink, width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#fff', fontSize: 18, fontWeight: 600, margin: '6px 0', cursor: 'pointer' }}>{link.label}</button>
                  ) : (
                    <Link key={link.label} to={link.to} style={{ ...headerStyles.navLink, width: '100%', display: 'block', fontSize: 18, fontWeight: 600, margin: '6px 0' }} onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>
                  )
                ))}
              </div>
            )}
          </nav>
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute allowedRoles={['user', 'organizer', 'admin']} />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['organizer', 'admin']} />}>
                <Route path="/my-events" element={<AdminEventsPage />} />
                <Route path="/my-events/analytics" element={<EventAnalytics />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/events" element={<AdminEventsPage />} />
              </Route>
              <Route path="*" element={<Layout />} />
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 