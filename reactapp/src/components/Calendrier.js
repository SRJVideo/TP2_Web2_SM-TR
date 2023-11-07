import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';


function DemoApp() {
    const [events, setEvents] = useState([]);

    const chargerEvenements = () => {
        axios.get('http://localhost:8081/events').then(response => {

            let evsJson = response.data.map(({ Titre, Date_event }) => {
            //  moment(Date_Event).format("YYYY-MM-DD")    --- C'est la supposée date
            console.log(Titre)
                return { titre: Titre, date: moment(Date_event).format("YYYY-MM-DD") }
            })
            

            setEvents(evsJson);
      
        });
    };

    useEffect(() => {
        chargerEvenements();
    }, []);


    const ajouterEvenement = () => {
        const title = prompt("Nom de l'événement:");
        const date = prompt("Date de l'événement (YYYY-MM-DD):");
        axios.post('http://localhost:8081/addEvents', { title, date }).then(response => {
            console.log(response)
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