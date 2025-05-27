import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import MyEventsPage from './pages/organizer/MyEventsPage';
import EventForm from './pages/organizer/EventForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/my-events" replace />} />
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="/my-events/new" element={<EventForm />} />
            <Route path="/my-events/:id/edit" element={<EventForm />} />
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
