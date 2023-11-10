import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';


function Calendrier(props) {
    const [events, setEvents] = useState([]);

    const chargerEvenements = () => {
        axios.get('https://samba-taha-node-tp2.onrender.com/events').then(response => {

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
        const titleE = prompt("Nom de l'événement:");
        const dateE = titleE!==null ? prompt("Date de l'événement (YYYY-MM-DD):",) : null;
        if (new RegExp("[A-Za-z0-9\\s]+").test(titleE) &&  new RegExp("\\d{4}-\\d{2}-\\d{2}").test(dateE)) {
            axios.post('https://samba-taha-node-tp2.onrender.com/addEvent', { title: titleE, date : dateE, idUser : props.user.Id }).then(response => {
                console.log(response)
                chargerEvenements();
            });
        }
    };


    const supprimerEvenement = (event) => {
        const [evTitre, evDate] = [event.title, event._instance.range.end];
        const confirmed = window.confirm(`Supprimer l'événement "${evTitre}" ?`);
        if (confirmed) {
            axios.delete('https://samba-taha-node-tp2.onrender.com/deleteEvent/', {
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

export default Calendrier;