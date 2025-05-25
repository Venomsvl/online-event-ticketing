import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Unauthorized from './pages/Unauthorized'
import EventAnalytics from './pages/EventAnalytics'
import AdminEventsPage from './pages/AdminEventsPage'
import Profile from './pages/Profile'
import AdminLogin from './pages/AdminLogin'
import MyEventsPage from './pages/organizer/MyEventsPage'
import EventForm from './pages/organizer/EventForm'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<div>Home Page</div>} />
              
              {/* Protected routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Organizer routes */}
              <Route 
                path="/my-events/analytics" 
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <EventAnalytics />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin/events" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminEventsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EventAnalytics />
                  </ProtectedRoute>
                } 
              />

              {/* Organizer routes */}
              <Route path="/my-events" element={<MyEventsPage />} />
              <Route path="/my-events/new" element={<EventForm />} />
              <Route path="/my-events/:id/edit" element={<EventForm />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App 