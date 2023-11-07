import React, { useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';


function DemoApp() {
    const [events, setEvents] = useState([]);

    const chargerEvenements = () => {
        axios.get('http://localhost:8081/events').then(response => {
            setEvents(response.data);
        });
    };

    const ajouterEvenement = () => {
        const title = prompt("Nom de l'événement:");
        const date = prompt("Date de l'événement (DD/MM/YYYY):");
        axios.post('http://localhost:8081/addEvents', { title, date }).then(response => {
            setEvents([...events, response.data]);
        });
    };

    const supprimerEvenement = (event) => {
        const confirmed = window.confirm(`Supprimer l'événement "${event.title}" ?`);
        if (confirmed) {
            axios.delete('http://localhost:8081/deleteEvents/:id/${event.id}').then(() => {
                const newEvents = events.filter(e => e.id !== event.id);
                setEvents(newEvents);
            });
        }
    };

    return (
        <div>
            <h1 className='MyCalendar' style={{ textAlign: "left" }}>Calendrier</h1>
            <button onClick={chargerEvenements}>Charger les événements</button>
            <button onClick={ajouterEvenement}>Ajouter un événement</button>
            <button onClick={supprimerEvenement}>supprimer un événement</button>

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                events={events}
                eventClick={(info) => supprimerEvenement(info.event)}
                locale={frLocale}
            />
        </div>
    );
}

export default DemoApp;