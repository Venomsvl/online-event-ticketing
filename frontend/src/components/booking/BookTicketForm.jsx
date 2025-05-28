import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from '../utils/axios'
import EventDetail from '../../pages/EventDetail'


const BookTicketForm = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch event')
        return res.json()
      })
      .then(data => {
        setEvent(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!event) return <div>No event found.</div>

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Available Tickets: {event.availableTickets}</p>
      {user ? (
        <BookTicketForm event={event} />
      ) : (
        <p>Please log in to book tickets.</p>
      )}
    </div>
  )
}

export default BookTicketForm