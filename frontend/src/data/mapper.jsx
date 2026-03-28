import React from 'react';
import { Tag } from 'antd';
import {formatDate, getStatusTagColor, getPriorityTagColor, calculateAgeFromJMBG} from '../utils/dataHelpers';
import TimesheetViewer from '../components/TimesheetViewer/TimesheetViewer.jsx';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import greenPinIcon from "../assets/green-pin.svg";
import {MapContainer, Marker, TileLayer} from "react-leaflet";


const detailIcon = new L.Icon({
    iconUrl: greenPinIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
const safeValue = (value, fallback = 'Nema informacija') => {
    if (value === null || value === undefined || value === "") return fallback;
    return value;
};
const isVisible = (userRole, allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(userRole?.toLowerCase());
};

// Pomoćna funkcija za grupisanje sekcija
const groupItems = (items) => {
    return items.reduce((acc, item) => {
        const lastSection = acc[acc.length - 1];
        if (lastSection && lastSection.title === item.section) {
            lastSection.items.push(item);
        } else {
            acc.push({ title: item.section, items: [item] });
        }
        return acc;
    }, []);
};

// --- MAPERI ZA SPECIFIČNE ENTITETE ---

const mapProjectDetails = (data,role) => {
    const allItems=[
        { section: 'Osnovni Detalji', label: 'Naziv', value: data.naziv, key: 'naziv' },
        { section: 'Osnovni Detalji', label: 'Opis', value: safeValue(data.opis), key: 'opis' },
        { section: 'Osnovni Detalji', label: 'Prioritet', value: data.prioritet, key: 'prio',
            render: (v) => <Tag color={getPriorityTagColor(v)}>{v}</Tag> },
        { section: 'Osnovni Detalji', label: 'Klijent', value: data.klijent, key: 'klijent' },
        {
            section: 'Osnovni Detalji',
            label: 'Lokacija',
            value: data.lokacijaNaziv || data.lokacija,
            key: 'lokacija',
            span: 3,
            render: (textValue) => {
                console.log("DEBUG LOKACIJA:", data.lokacija);
                // 1. Izdvajanje koordinata (očekuje se "44.79..., 17.20...")
                const rawLocation = data.lokacija;
                let coords = null;

                if (rawLocation && typeof rawLocation === 'string' && rawLocation.includes(',')) {
                    // split(',') pravi niz ["44.79...", " 17.20..."]
                    // trim() uklanja razmake, a Number() pretvara u čisti broj
                    const parts = rawLocation.split(',').map(p => p.trim());
                    const lat = Number(parts[0]);
                    const lng = Number(parts[1]);

                    // Provjera da li su oba broja ispravna (nisu NaN)
                    if (!isNaN(lat) && !isNaN(lng)) {
                        coords = [lat, lng];
                    }
                }

                return (
                    <div style={{ width: '100%' }}>
                        {/* Prikaz adrese (npr. Banja Luka, Kralja Petra...) */}
                        <div style={{ marginBottom: '10px', fontWeight: '500', color: 'rgba(0, 0, 0, 0.85)' }}>
                            {textValue || "Lokacija nije definisana"}
                        </div>

                        {coords ? (
                            <div style={{ height: '250px', width: '100%', borderRadius: '8px', border: '1px solid #d9d9d9', overflow: 'hidden' }}>
                                <MapContainer
                                    // key je obavezan da bi React "resetovao" mapu pri svakom novom otvaranju detalja
                                    key={`map-${coords[0]}-${coords[1]}`}
                                    center={coords}
                                    zoom={15}
                                    style={{ height: '100%', width: '100%' }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={coords} icon={detailIcon} />
                                </MapContainer>
                            </div>
                        ) : (
                            <div style={{ padding: '8px', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '4px', color: '#cf1322' }}>
                                ⚠️ Format koordinata u bazi nije ispravan za prikaz mape.
                            </div>
                        )}

                        {coords && (
                            <div style={{ marginTop: '10px' }}>
                                <a
                                    href={`https://www.google.com/maps?q=${coords[0]},${coords[1]}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: '13px', fontWeight: 'bold', color: '#1890ff' }}
                                >
                                    🗺️ Otvori navigaciju (Google Maps)
                                </a>
                            </div>
                        )}
                    </div>
                );
            }
        },
        { section: 'Vremenski Okvir', label: 'Status', value: data.status, key: 'status',
            render: (v) => <Tag color={getStatusTagColor(v)}>{v}</Tag> },
        { section: 'Vremenski Okvir', label: 'Početak rada', value: formatDate(data.pocetakRada)|| "Nije počelo", key: 'start' },
        { section: 'Vremenski Okvir', label: 'Rok', value: formatDate(data.rok), key: 'deadline' },
        { section: 'Vremenski Okvir', label: 'Završeno', value: data.krajRada ? formatDate(data.krajRada) : 'U toku', key: 'end' },
        {
            section: 'Tim na projektu',
            label: 'Odgovorni Poslovođa',
            value: data.managerIme || data.manager, // Mapira se sa @JsonProperty("manager")
            key: 'poslovodja_prikaz',
            roles: ['direktor'], // Samo direktor vidi ko je poslovođa
            render: (v) => v ? <strong>{v}</strong> : 'Nije dodijeljen'
        },
        {
            section: 'Tim na projektu',
            label: 'Tim Tehničara',
            value: data.projectTeamImena || data.projectTeam,
            key: 'tehnicari_prikaz',
            roles: ['direktor', 'poslovodja'],
            render: (imena) => (
                <div style={{ fontWeight: 'normal', color: 'rgba(0, 0, 0, 0.85)' }}>
                    {imena && imena.length > 0
                        ? imena.join(', ') // Ispisuje imena jedno pored drugog odvojena zarezom
                        : 'Nema dodijeljenih tehničara'}
                </div>
            )
        },
        {
            section: 'Kreiranje i izmjena projekta',
            label: 'Kreiranje projekta',
            value: formatDate(data.datumKreiranja),
            key: 'datumK',
            roles: ['direktor']
        },
        {
            section: 'Kreiranje i izmjena projekta',
            label: 'Posljednja izmjena projekta',
            value: formatDate(data.posljednjaIzmjena),
            key: 'datumI',
            roles: ['direktor']
        }
    ];
    const filteredItems = allItems.filter(item => isVisible(role, item.roles));
    return groupItems(filteredItems);
};

const mapEmployeeDetails = (data) => {
    return groupItems([
        { section: 'Lične Informacije', label: 'Ime i Prezime', value: `${data.ime} ${data.prezime}`, key: 'full_name' },

        {
            section: 'Lične Informacije',
            label: 'Godine',
            value: calculateAgeFromJMBG( data.jmb),
            key: 'age'
        },
        { section: 'Lične Informacije', label: 'Email', value: data.email, key: 'email' },
        { section: 'Lične Informacije', label: 'Telefon', value: data.brojTelefona, key: 'tel' },


       /* { section: 'Evidencija Rada', value: data.timesheet, key: 'ts', span: 3,
            render: (ts) => <TimesheetViewer timesheet={ts} /> }*/
    ]);
};

const mapVehicleDetails = (data) => {
    return groupItems([
        { section: 'Tehnički Podaci', label: 'Naziv', value: data.naziv, key: 'name' },
        { section: 'Tehnički Podaci', label: 'Registracija', value: data.registarskiBroj, key: 'reg' },
        { section: 'Tehnički Podaci', label: 'Tip Vozila', value: data.tipVozila, key: 'type' },
        { section: 'Tehnički Podaci', label: 'Broj Putnika', value: data.brojPutnika, key: 'type' },
        { section: 'Tehnički Podaci', label: 'Maksimalna Nosivost', value: data.maksimalnaNosivost? `${data.maksimalnaNosivost} kg` : 'Nije navedeno', key: 'type' },
        { section: 'Dokumentacija', label: 'Registracija važi od', value: formatDate(data.datumRegistracije), key: 'reg_from' },
        { section: 'Dokumentacija', label: 'Registracija ističe', value: formatDate(data.datumIstekaRegistracije), key: 'reg_to' }
    ]);
};

const mapToolDetails = (data) => {
    return groupItems([
        { section: 'Osnovne Informacije', label: 'Naziv', value: data.naziv, key: 'name' },
        { section: 'Osnovne Informacije', label: 'Kategorija', value: data.kategorija, key: 'cat' },//enum
        { section: 'Skladište', label: 'Stanje u magacinu', value: data.stanjeMagacina, key: 'stock' },
        { section: 'Skladište', label: 'Minimalna kolicina', value: data.stanjeMagacina, key: 'state' }
    ]);
};
const mapMaterialDetails = (data) => {
    return groupItems([
        { section: 'Osnovne Informacije', label: 'Naziv', value: data.naziv, key: 'name' },
        { section: 'Osnovne Informacije', label: 'Kategorija', value: data.kategorija, key: 'type' },
        { section: 'Skladište', label: 'Trenutna Količina', value: `${data.stanjeMagacina} ${data.jedinicaMjere || 'kom'}`, key: 'stock' },
        { section: 'Skladište', label: 'Minimalna Količina', value: data.minimalnaKolicina, key: 'min_stock' }
    ]);
};
//+ detalji o tehnicaru, o materijalu, o izvjestaju

// --- GLAVNI EKSPORT ---
export const mappers = {
    PROJECT: { title: 'Detalji Projekta', mapper: mapProjectDetails },
    EMPLOYEE: { title: 'Detalji Zaposlenog', mapper: mapEmployeeDetails },
    VEHICLE: { title: 'Detalji Vozila', mapper: mapVehicleDetails },
    TOOL: { title: 'Detalji Opreme', mapper: mapToolDetails },
    MATERIAL: {title: 'Detalji Materijala', mapper: mapMaterialDetails }


};