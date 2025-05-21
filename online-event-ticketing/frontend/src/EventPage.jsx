import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EventPage() {
const { eventid } = useParams();
const [event, setEvent] = useState(null);
const navigate = useNavigate();

useEffect(() => {
fetch(`http://localhost:3001/my-events/${eventid}`)
.then((res) => {
if (!res.ok) {
throw new Error('Event not found');
}
return res.json();
})
.then((data) => setEvent(data))
.catch((err) => {
console.error('Error fetching event:', err);
setEvent(null);
});
}, [eventid]);

if (!event) {
return (
<div>
<h2>Event not found</h2>
<button onClick={() => navigate('/my-events')}>Back</button>
</div>
);
}

return (
<div>
<h1>Event Details</h1>
<p><strong>ID:</strong> {event.id}</p>
<p><strong>Title:</strong> {event.title}</p>
<p><strong>Date:</strong> {event.date}</p>
<p><strong>Description:</strong> {event.description}</p>
<button onClick={() => navigate('/my-events')}>Back to Events</button>
</div>
);
}

export default EventPage;