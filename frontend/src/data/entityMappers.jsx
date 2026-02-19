// src/data/entityMappers.jsx (AŽURIRANO ZA FINALNE ULOGE I PRAVILA)
import React from 'react';
import { Tag } from 'antd';
import { formatDate, getStatusTagColor, getPriorityTagColor, calculateAgeFromJMBG } from '../utils/dataHelpers';
import TimesheetViewer from '../components/TimesheetViewer/TimesheetViewer.jsx';

//Definisanje Testnih Podataka
export const mockData = {
    REPORT: { id: 'RPT-001', naslov: 'Kvar na trafostanici', datum: '2025-12-01', autor: 'Nikola Nikolić', status: 'Otvoren' },
    PROJECT: {
        id: 'PROJ-042', naziv: 'Instalacija Vila Sunce', opis: 'Kompletna instalacija jake i slabe struje...',
        lokacija: 'Novi Sad, Bulevar Oslobođenja 12', pocetakRada: '2025-03-15T00:00:00Z', krajRada: null,
        rok: '2025-12-20T00:00:00Z', statusProjekta: 'Aktivan', datumKreiranja: '2024-10-01T08:00:00Z',
        posljednjaIzmjena: '2025-01-15T14:30:00Z', prioritet: 'Visok',
    },
    EMPLOYEE: {
        id: 'EMP-012', ime: 'Marko', prezime: 'Petrović', email: 'marko.petrovic@vas.com',
        telefon: '+387 65 111 222',
        timesheet: [
            { datum: '2025-12-01', projekat: 'Vila Sunce', sati: 8.0, tip: 'Redovan' },
            { datum: '2025-12-02', projekat: 'Vila Sunce', sati: 4.0, tip: 'Redovan' },
            { datum: '2025-12-02', projekat: 'Terenski rad', sati: 4.0, tip: 'Teren' },
            { datum: '2025-12-03', projekat: 'Klijent Alfa', sati: 8.0, tip: 'Teren' },
            { datum: '2025-12-07', projekat: 'Hitna Intervencija', sati: 5.0, tip: 'Nedelja' },
            { datum: '2025-12-08', projekat: 'Vila Sunce', sati: 4.0, tip: 'Redovan' },
            { datum: '2025-12-09', projekat: 'Instalacija 1', sati: 8.0, tip: 'Noćni' },
        ],
    },
    TECHNICIAN: {
        id: '1010995500123', ime: 'Nikola', prezime: 'Nikolić', telefon: '+387 65 333 444',
        projekti: ['Vila Sunce', 'Instalacija 1', 'Klijent Alfa'],
        statusTerena: 'Aktivan',
    },
};

// Pomoćna RBAC i Grupisanje funkcija
const isVisible = (role, allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(role);
};

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

// Funkcije za mapiranje

const mapProjectDetails = (data, role) => {
    const allItems = [
        // SEKCIJA 1: Opšte informacije (Direktor, Poslovođa)
        { section: 'Osnovni Detalji', label: 'Naziv', value: data.naziv, key: 'naziv' },
        { section: 'Osnovni Detalji', label: 'Lokacija', value: data.lokacija, key: 'lokacija' },
        { section: 'Osnovni Detalji', label: 'Opis', value: data.opis, key: 'opis' },
        { section: 'Osnovni Detalji', label: 'Prioritet', value: data.prioritet, key: 'prioritet',
            render: (value) => (<Tag color={getPriorityTagColor(value)}>{value}</Tag>),
            roles: ['Direktor', 'Poslovodja']
        },

        // SEKCIJA 2: Statusi i Datumi (Direktor, Poslovođa)
        { section: 'Status i Vremenski Okvir', label: 'Status', value: data.statusProjekta, key: 'statusProjekta',
            render: (value) => (<Tag color={getStatusTagColor(value)}>{value}</Tag>)
        },
        { section: 'Status i Vremenski Okvir', label: 'Početak Rada', value: formatDate(data.pocetakRada), key: 'pocetakRada', roles: ['Direktor', 'Poslovodja'] },
        { section: 'Status i Vremenski Okvir', label: 'Rok (Deadline)', value: formatDate(data.rok), key: 'rok', roles: ['Direktor', 'Poslovodja'] },
        { section: 'Status i Vremenski Okvir', label: 'Kraj Rada', value: data.krajRada ? formatDate(data.krajRada) : 'U toku', key: 'krajRada', roles: ['Direktor'] },

        // SEKCIJA 3: Administrativni podaci (Samo Direktor)
        { section: 'Administracija', label: 'Datum Kreiranja', value: formatDate(data.datumKreiranja), key: 'datumKreiranja', roles: ['Direktor'] },
        { section: 'Administracija', label: 'Poslednja Izmjena', value: formatDate(data.posljednjaIzmjena), key: 'posljednjaIzmjena', roles: ['Direktor'] },
    ];

    // Knjigovođa ne vidi Projekte
    const filteredItems = allItems.filter(item => isVisible(role, item.roles));
    return groupItems(filteredItems);
};


const mapEmployeeDetails = (data, role) => {
    const allItems = [
        // SEKCIJA 1: Lične Informacije (Direktor, Knjigovođa)
        { section: 'Lične Informacije', label: 'Ime', value: data.ime, key: 'ime', roles: ['Direktor', 'Knjigovodja'] },
        { section: 'Lične Informacije', label: 'Prezime', value: data.prezime, key: 'prezime', roles: ['Direktor', 'Knjigovodja'] },
        { section: 'Lične Informacije', label: 'Email', value: data.email, key: 'email', roles: ['Direktor', 'Knjigovodja'] },
        { section: 'Lične Informacije', label: 'Telefon', value: data.telefon, key: 'telefon', roles: ['Direktor', 'Knjigovodja'] },

        // SEKCIJA 2: Analiza Radnog Vremena (Direktor, Knjigovođa)
        {
            section: 'Analiza Radnog Vremena',
            value: data.timesheet,
            key: 'timesheet',
            span: 3,
            roles: ['Direktor', 'Knjigovodja'],
            render: (timesheetData) => (<TimesheetViewer timesheet={timesheetData} />)
        },
    ];

    // Poslovođa ne vidi Zaposlene
    const filteredItems = allItems.filter(item => isVisible(role, item.roles));
    return groupItems(filteredItems);
};


const mapTechnicianDetails = (data, role) => {
    // samo Poslovodja vidi tehnicare
    const allItems = [
        // SEKCIJA 1: Lične Informacije
        { section: 'Lične Informacije', label: 'Ime', value: data.ime, key: 'ime', roles: ['Poslovodja'] },
        { section: 'Lične Informacije', label: 'Prezime', value: data.prezime, key: 'prezime', roles: ['Poslovodja'] },
        { section: 'Lične Informacije', label: 'Telefon', value: data.telefon, key: 'telefon', roles: ['Poslovodja'] },
        {
            section: 'Lične Informacije',
            label: 'Godine Starosti',
            value: calculateAgeFromJMBG(data.id),
            key: 'godine',
            roles: ['Poslovodja']
        },

        // SEKCIJA 2: Status i Angažman
        {
            section: 'Status i Angažman',
            label: 'Trenutni Status',
            value: data.statusTerena,
            key: 'status',
            render: (value) => (<Tag color={value === 'Aktivan' ? 'green' : 'red'}>{value}</Tag>),
            roles: ['Poslovodja']
        },
        {
            section: 'Status i Angažman',
            label: 'Aktivni Projekti',
            value: data.projekti.join(', '),
            key: 'projekti',
            span: 3,
            roles: ['Poslovodja']
        },
    ];


    const filteredItems = allItems.filter(item => isVisible(role, item.roles));
    return groupItems(filteredItems);
};


// Glavni Maper Objekat
export const entityMappers = {
    PROJECT: { title: 'Detalji Projekta', mapper: mapProjectDetails },
    EMPLOYEE: { title: 'Detalji Zaposlenog', mapper: mapEmployeeDetails },
    TECHNICIAN: { title: 'Detalji Tehničara', mapper: mapTechnicianDetails },
    //REPORT: { title: 'Detalji Izveštaja', mapper: (data, role) => ([/* ... logika ... */]) },
};