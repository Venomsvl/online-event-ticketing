import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{
      background: 'linear-gradient(135deg, #E9D5FF 0%, #A855F7 50%, #6B21A8 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">
            Welcome to Event Ticketing
          </h1>
          <div className="space-y-4">
            <Link
              to="/analytics"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 mr-4"
            >
              View Analytics
            </Link>
            <Link
              to="/admin/events"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Manage Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 