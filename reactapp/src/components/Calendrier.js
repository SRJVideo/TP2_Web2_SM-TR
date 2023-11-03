import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

function Calendrier  ()  {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = () => {
    setLoading(true);
    // Chargez les événements depuis la base de données (remplacez l'URL par votre propre API)
    axios.get('/api/events')
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleEventAdd = (eventInfo) => {
    // Envoyez la demande d'ajout d'événement à la base de données (POST request)
    axios.post('/api/events', eventInfo.event.toPlainObject())
      .then((response) => {
        setEvents([...events, response.data]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEventRemove = (eventInfo) => {
    // Envoyez la demande de suppression d'événement à la base de données (DELETE request)
    axios.delete(`/api/events/${eventInfo.event.id}`)
      .then(() => {
        setEvents(events.filter((event) => event.id !== eventInfo.event.id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1 className='MyCalendar' style={{ textAlign: 'left' }}>Calendrier</h1>
      <button onClick={loadEvents} disabled={loading}>
        Charger les événements
      </button>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView='dayGridMonth'
        weekends={true}
        events={events}
        eventClick={handleEventRemove}
        dateClick={handleEventAdd}
      />
    </div>
  );
};

export default Calendrier;