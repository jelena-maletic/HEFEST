import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import eng from "@fullcalendar/core/locales/en-gb.cjs";
import "./Calendar.css";

function Calendar() {
    const [events, setEvents] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    // TODO zamijeniti hardkodovane podatke sa citanjem podataka iz baze !!!
    // TODO formatirati datume
    // Ovi podaci sluze samo za testiranje, kasnije ce biti implementirano ucitavanje iz baze
    useEffect(() => {
        const projects = [
            {
                id: "1",
                naziv: "Fructa Trade rasvjeta",
                lokacija: "Banja Luka",
                pocetakRada: "2025-01-05",
                rok: "2025-01-20",
                zavrsetakRada: "2025-01-18",
            },
            {
                id: "2",
                naziv: "Elektro instalacije u školi",
                lokacija: "Sarajevo",
                pocetakRada: "2025-02-02",
                rok: "2025-02-15",
                zavrsetakRada: null,
            },
        ];

        const eventList = projects.flatMap((p) => {
            const events = [];

            // Start - zeleno
            events.push({
                id: `start-${p.id}`,
                title: `početak - ${p.naziv}`,
                start: p.pocetakRada,
                backgroundColor: "#9ef01a",
                textColor: "#000",
                extendedProps: { ...p },
            });

            // Rok - crveno
            events.push({
                id: `deadline-${p.id}`,
                title: `rok - ${p.naziv}`,
                start: p.rok,
                backgroundColor: "#ff595e",
                textColor: "#000",
                extendedProps: { ...p },
            });

            // Zavrsetak - sivo (ako postoji)
            if (p.zavrsetakRada) {
                events.push({
                    id: `finished-${p.id}`,
                    title: `završen - ${p.naziv}`,
                    start: p.zavrsetakRada,
                    backgroundColor: "#b0b0b0",
                    textColor: "#000",
                    extendedProps: { ...p },
                });
            }

            return events;
        });

        setEvents(eventList);
    }, []);

    const handleEventClick = (info) => {
        info.jsEvent.preventDefault();
        setSelectedProject(info.event.extendedProps);
    };

    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale={eng}
                events={events}
                height="100%"
                eventDisplay="block"
                eventClick={handleEventClick}
            />

            {selectedProject && (
                <div className="modal-overlay">
                    <div className="modal fade-in">
                        <h3>Projekat: {selectedProject.naziv}</h3>
                        <p><strong>Lokacija:</strong> {selectedProject.lokacija}</p>
                        <p><strong>Početak:</strong> {selectedProject.pocetakRada}</p>
                        <p><strong>Rok:</strong> {selectedProject.rok}</p>
                        <p><strong>Završetak:</strong> {selectedProject.zavrsetakRada ? selectedProject.zavrsetakRada : "/"}</p>

                        <button className="close-btn" onClick={() => setSelectedProject(null)}>
                            Zatvori
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calendar;