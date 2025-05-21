import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MyEventsPage from './MyEventsPage';
import EventForm from './EventForm';
import EventPage from './EventPage';

function App() {
return (
<Router>
<Routes>
<Route path="/" element={<Navigate to="/my-events" />} />
<Route path="/my-events" element={<MyEventsPage />} />
<Route path="/my-events/new" element={<EventForm />} />
<Route path="/my-events/:eventid/edit" element={<EventForm />} />
<Route path="/my-events/:eventid" element={<EventPage />} />
</Routes>
</Router>
);
}

export default App;