import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";

import {fetchProjects} from "../services/apiHelpers.js";
import CenteredOverlay from "./CenteredOverlay/CenteredOverlay.jsx";
import { reverseGeocode } from "../utils/reverseGeocode.js";

function Calendar() {
    const [events, setEvents] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

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

                    if (p.krajRada) {
                        projectEvents.push({
                            id: `finished-${p.id}`,
                            title: `završen - ${p.naziv}`,
                            start: p.krajRada,
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

    const handleEventClick = async (info) => {
        info.jsEvent.preventDefault();


        const projectData = { ...info.event.extendedProps };


        if (projectData.lokacija && !projectData.lokacijaNaziv) {

            setSelectedProject({ ...projectData, lokacijaNaziv: "Učitavanje lokacije..." });

            const adresa = await reverseGeocode(projectData.lokacija);


            setSelectedProject({ ...projectData, lokacijaNaziv: adresa });
        } else {
            setSelectedProject(projectData);
        }
    };

    return (
        <div className="calendar-container">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale={{
                    code: 'sr-latn',
                    week: {
                        dow: 1,
                        doy: 4,
                    },
                    buttonText: {
                        prev: 'Prethodna',
                        next: 'Sljedeća',
                        today: 'Danas',
                        month: 'Mjesec',
                        week: 'Nedelja',
                        day: 'Dan',
                        list: 'Planer',
                    },
                    weekText: 'Sed',
                    allDayText: 'Cijeli dan',
                    noEventsText: 'Nema događaja za prikaz',
                    monthNames: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
                    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'],
                    dayNames: ['Nedelja', 'Ponedeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota'],
                    dayNamesShort: ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'],
                    dayNamesMin: ['Ne', 'Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su'],
                }}
                events={events}
                height="95%"
                eventDisplay="block"
                eventClick={handleEventClick}
            />

            <CenteredOverlay
                isVisible={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            >
            {selectedProject && (
                <div className="modal-overlay">
                    <div className="modal fade-in">
                        <h3>Projekat: {selectedProject.naziv}</h3>
                        <p>
                            <strong>Lokacija:</strong> {selectedProject.lokacijaNaziv || selectedProject.lokacija || "Nije definisana"}
                        </p>
                        <p>
                            <strong>Početak:</strong> {
                            selectedProject.pocetakRada
                                ? new Date(selectedProject.pocetakRada).toLocaleDateString("sr-RS")
                                : "Nije definisan"
                        }
                        </p>
                        <p>
                            <strong>Rok:</strong> {
                            selectedProject.rok
                                ? new Date(selectedProject.rok).toLocaleDateString("sr-RS")
                                : "Nema roka"
                        }
                        </p>
                        <p><strong>Završetak:</strong> {selectedProject.krajRada ? new Date(selectedProject.krajRada).toLocaleDateString("sr-SR") : "Nije definisan"}</p>

                        <button className="close-btn" onClick={() => setSelectedProject(null)}>
                            Zatvori
                        </button>
                    </div>
                </div>
            )}
            </CenteredOverlay>
        </div>
    );
}

export default Calendar;