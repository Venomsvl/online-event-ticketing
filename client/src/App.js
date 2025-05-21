import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventAnalytics from './pages/EventAnalytics';
import AdminEventsPage from './pages/AdminEventsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer position="top-right" />
        <Routes>
          <Route path="/analytics" element={<EventAnalytics />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 