import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import eng from "@fullcalendar/core/locales/en-gb.cjs";
import "./Calendar.css";

import {fetchProjects} from "../services/apiHelpers.js";

function Calendar() {
    const [events, setEvents] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    // TODO srediti lokaciju (trenutno su koordinate)

    useEffect(() => {
        const getEvents = async () => {
            try {
                const projects = await fetchProjects();

                if (!projects || !Array.isArray(projects)) {
                    console.error("Server nije vratio niz!");
                    return;
                }

                const projectsArray = Array.isArray(projects) ? projects : [projects];

                const eventList = projectsArray.flatMap((p) => {
                    const projectEvents = [];

                    if (p.pocetakRada) {
                        projectEvents.push({
                            id: `start-${p.id}`,
                            title: `početak - ${p.naziv}`,
                            start: p.pocetakRada,
                            backgroundColor: "#9ef01a",
                            textColor: "#000",
                            extendedProps: { ...p },
                        });
                    }

                    if (p.rok) {
                        projectEvents.push({
                            id: `deadline-${p.id}`,
                            title: `rok - ${p.naziv}`,
                            start: p.rok,
                            backgroundColor: "#ff595e",
                            textColor: "#000",
                            extendedProps: { ...p },
                        });
                    }

                    if (p.zavrsetakRada) {
                        projectEvents.push({
                            id: `finished-${p.id}`,
                            title: `završen - ${p.naziv}`,
                            start: p.zavrsetakRada,
                            backgroundColor: "#b0b0b0",
                            textColor: "#000",
                            extendedProps: { ...p },
                        });
                    }
                    return projectEvents;
                });

                setEvents(eventList);
            } catch (err) {
                console.error("Greška pri punjenju kalendara:", err);
            }
        };
        getEvents();
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
                        <p><strong>Početak:</strong> {new Date(selectedProject.pocetakRada).toLocaleDateString("hr-HR")}</p>
                        <p><strong>Rok:</strong> {new Date(selectedProject.rok).toLocaleDateString("hr-HR")}</p>
                        <p><strong>Završetak:</strong> {selectedProject.zavrsetakRada ? new Date(selectedProject.zavrsetakRada).toLocaleDateString("hr-HR") : "/"}</p>

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