import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EventForm() {
  const { eventid } = useParams();
  const navigate = useNavigate();

  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Load data if editing
  useEffect(() => {
    if (eventid) {
      fetch(`http://localhost:3001/my-events/${eventid}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setDate(data.date);
          setDescription(data.description);
        })
        .catch(() => {
          console.error("Event not found.");
          navigate('/my-events');
        });
    }
  }, [eventid, navigate]);

  // Submit (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = { title, date, description };

    const url = eventid
      ? `http://localhost:3001/my-events/${eventid}`
      : `http://localhost:3001/my-events`;

    const method = eventid ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    })
      .then(() => navigate('/my-events'))
      .catch(err => console.error("Submit error", err));
  };

  // Delete event
  const handleDelete = () => {
    if (!eventid) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    fetch(`http://localhost:3001/my-events/${eventid}`, {
      method: 'DELETE'
    })
      .then(() => navigate('/my-events'))
      .catch(err => console.error("Delete error", err));
  };

  return (
    <div>
      <h1>{eventid ? 'Edit Event' : 'Create New Event'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <br />
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <button type="submit">{eventid ? 'Update' : 'Create'}</button>
        <button type="button" onClick={() => navigate('/my-events')}>Cancel</button>
        {eventid && (
          <button type="button" onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>
            Delete
          </button>
        )}
      </form>
    </div>
  );
}

export default EventForm;
