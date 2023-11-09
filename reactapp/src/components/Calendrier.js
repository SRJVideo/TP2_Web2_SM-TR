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
                return { title: Titre, date: moment(Date_event).format("YYYY-MM-DD") }
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
        if (title != null && date != null) {
            axios.post('http://localhost:8081/addEvent', { title, date }).then(response => {
                console.log(response)
                chargerEvenements();
            });
        }
    };

    const supprimerEvenement = (event) => {
        const [evTitre, evDate] = [event.title, event._instance.range.end];
        const confirmed = window.confirm(`Supprimer l'événement "${evTitre}" ?`);
        if (confirmed) {
            axios.delete('http://localhost:8081/deleteEvent/', {
                params: {
                    titre: evTitre,
                    date: moment(evDate).format("YYYY-MM-DD")
                }
            }).then((response) => {
                console.log(response);
                chargerEvenements();
            });
        }
    };

    return (
        <div>
            <h1 className='MyCalendar' style={{ textAlign: "left" }}>Calendrier</h1>
            <button onClick={ajouterEvenement}>Ajouter un événement</button>

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