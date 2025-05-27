import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: '',
    totalTickets: ''
  });
  const navigate = useNavigate();
  const { id } = useParams(); // Get event ID from URL if editing

  useEffect(() => {
    if (id) {
      // If editing, load event data
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      const event = events.find(e => e.id === parseInt(id));
      if (event) {
        setFormData(event);
      }
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const events = JSON.parse(localStorage.getItem('events') || '[]');

    if (id) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === parseInt(id) ? { ...formData, id: parseInt(id) } : event
      );
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    } else {
      // Create new event
      const newEvent = {
        id: Date.now(),
        ...formData
      };
      events.push(newEvent);
      localStorage.setItem('events', JSON.stringify(events));
    }

    navigate('/my-events');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full p-2 border rounded"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Concert">Concert</option>
            <option value="Sports">Sports</option>
            <option value="Theater">Theater</option>
            <option value="Conference">Conference</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Ticket Price ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full p-2 border rounded"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Total Tickets</label>
          <input
            type="number"
            value={formData.totalTickets}
            onChange={(e) => setFormData({...formData, totalTickets: e.target.value})}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>
      </div>

      <div className="mt-6 space-x-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
        <button
          type="button"
          onClick={() => navigate('/my-events')}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EventForm; 