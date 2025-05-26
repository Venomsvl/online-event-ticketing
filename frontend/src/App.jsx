import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import RoleBasedRoute from './components/shared/RoleBasedRoute'
import Layout from './components/shared/Layout'
import EventDetail from './pages/EventDetail'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Unauthorized from './pages/Unauthorized'
import EventAnalytics from './pages/EventAnalytics'
import AdminEventsPage from './pages/AdminEventsPage'
import CreateEventPage from './pages/CreateEventPage'
import ProfilePage from './pages/ProfilePage'
import AdminLogin from './components/auth/AdminLogin'
import HomePage from './pages/HomePage'

function App() {
  return (
    <AuthProvider>
   
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/event/:id" element={<EventDetail />} />
              
              {/* Protected routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Organizer routes */}
              <Route 
                path="/my-events/analytics" 
                element={
                  <RoleBasedRoute allowedRoles={['organizer']}>
                    <EventAnalytics />
                  </RoleBasedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin/events" 
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <AdminEventsPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/admin/create-event" 
                element={
                  <RoleBasedRoute allowedRoles={['admin', 'organizer']}>
                    <CreateEventPage />
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <RoleBasedRoute allowedRoles={['admin']}>
                    <EventAnalytics />
                  </RoleBasedRoute>
                } 
              />
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
      
   </AuthProvider>
  )
}

export default App 