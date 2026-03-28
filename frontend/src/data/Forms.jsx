import {getJmb} from "../auth/auth.js";

export const projectSchema = {
    title:"Podaci o projektu",
    submitLabel: "Potvrdi",
    layout: "vertical",
    fields: [
        {
            name: "naziv",
            label: "Naziv projekta",
            type: "input",
            required: true,
            span: 12,
            rules: [
                { max: 100, message: "Naziv ne smije biti duži od 100 karaktera" }
            ]
        },
        {
            name: "klijent",
            label: "Klijent/Firma",
            type: "input",
            required: true,
            span: 12,
        },

        {
            name: "manager",
            label: "Poslovođa na projektu",
            type: "select",
            required: true,
            span: 8,
            apiEndpoint: "http://localhost:8080/api/poslovodje",
            optionLabel: "ime",
            optionValue: "jmb",
        },

        {
            name: "prioritet",
            label: "Prioritet",
            type: "select",
            required: true,
            span: 8,
            options: [
                { value: "VISOK", label: "Visok" },
                { value: "SREDNJI", label: "Srednji" },
                { value: "NIZAK", label: "Nizak" },
            ],
        },

        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            span: 8,
            options: [
                { value: "DOGOVOREN", label: "Dogovoren" },
                { value: "AKTIVAN", label: "Aktivan" },
                { value: "NEAKTIVAN", label: "Neaktivan" },
                { value: "ZAVRŠEN", label: "Završen" },
            ],
        },

        {
            name: "rok",
            label: "Rok završetka",
            type: "date",
            required: true,
            span: 8,
        },
        {
            name: "pocetakRada",
            label: "Početak radova",
            type: "date",
            required: false,
            span: 8,
        },
        {
            name: "krajRada",
            label: "Kraj radova",
            type: "date",
            required: false,
            span: 8,
            rules: [
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        const pocetak = getFieldValue('pocetakRada');
                        if (!value || !pocetak || value.isAfter(pocetak)) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Kraj radova mora biti nakon početka!'));
                    },
                }),
            ],
        },

        {
            name: "lokacija",
            label: "Adresa / Lokacija radilišta",
            type: "textarea",
            required: true,
            span: 24,
        },


        {
            name: "projectTeam",
            label: "Tehničari na projektu",
            type: "select",
            required: false,
            span: 24,
            mode: "multiple",
            apiEndpoint: "http://localhost:8080/api/tehnicari/only",
            optionLabel: "ime",
            optionValue: "jmb",
        },

        {
            name: "opis",
            label: "Opis projekta",
            type: "textarea",
            required: false,
            span: 24,
        },
    ],
};

export const vehicleSchema = {
    title:"Podaci o vozilu",
    submitLabel: "Sačuvaj vozilo",
    layout: "vertical",
    fields: [
        {
            name: "naziv",
            label: "Naziv (Marka i model)",
            type: "input",
            required: true,
            span: 12,
        },
        {
            name: "registarskiBroj",
            label: "Registarski broj",
            type: "input",
            required: true,
            span: 12,
            rules: [
                {
                    pattern: /^[A-EJKMOTV]\d{2}-[A-EJKMOTV]-\d{3}$/,
                    message: "Format mora biti npr. K12-M-345"
                }
            ]
        },
        {
            name: "tipVozila",
            label: "Tip vozila",
            type: "select",
            required: true,
            span: 12,
            options: [
                { value: "putnicko", label: "Putničko vozilo" },
                { value: "teretno", label: "Teretno vozilo" },
                { value: "kombi", label: "Kombi / Dostavno" }
            ],
        },
        {
            name: "brojPutnika",
            label: "Broj putnika",
            type: "number",
            span: 12,
            required: true,
        },
        {
            name: "maksimalnaNosivost",
            label: "Maksimalna nosivost (kg)",
            type: "number",
            span: 12,
        },
        /*{
            name: "stanjeMagacina",
            label: "Stanje magacina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: "minimalnaKolicina",
            label: "Minimalna količina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },*/
        {
            name: "datumRegistracije",
            label: "Datum registracije",
            type: "date",
            required: true,
            span: 12,
        },
        {
            name: "datumIstekaRegistracije",
            label: "Datum isteka registracije",
            type: "date",
            required: true,
            span: 12,
            rules: [
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        const pocetak = getFieldValue('datumRegistracije');
                        if (!value || !pocetak || value.isAfter(pocetak)) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Datum isteka mora biti nakon datuma registracije!'));
                    },
                }),
            ],
        },
    ],
};

export const equipmentSchema = {
    title:"Podaci o opremi",
    submitLabel: "Sačuvaj opremu",
    layout: "vertical",
    fields: [
        {
            name: "naziv",
            label: "Naziv (Marka i model)",
            type: "input",
            required: true,
            span: 12,
        },
        {
            name: "stanjeMagacina",
            label: "Stanje magacina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: "minimalnaKolicina",
            label: "Minimalna količina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: "kategorija",
            label: "Kategorija",
            type: "select",
            required: true,
            span: 12,
            options: [
                { value: "alat", label: "Alat" },
                { value: "radna_odjeca", label: "Radna odjeća" },
            ],
        },
    ],
};

export const materialSchema = {
    title:"Podaci o materijalu",
    submitLabel: "Sačuvaj materijal",
    layout: "vertical",
    fields: [
        {
            name: 'naziv',
            label: 'Naziv materijala',
            type: "input",
            required: true,
            span: 12
        },
        {
            name: "stanjeMagacina",
            label: "Stanje magacina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: "minimalnaKolicina",
            label: "Minimalna količina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: 'kategorija',
            label: 'Kategorija',
            type: 'select',
            required: true,
            span: 12,
            options: [
                { value: 'kablovi', label: 'Kablovi i vodiči' },
                { value: 'prekidaci', label: 'Prekidači i utičnice' },
                { value: 'kutije', label: 'Razvodne kutije' },
                { value: 'osiguraci', label: 'Osigurači i zaštitni elementi' },
                { value: 'ormari', label: 'Razvodni ormari' },
                { value: 'rasvjeta', label: 'Rasvjeta' },
                { value: 'cijevi', label: 'Instalacione cijevi i kanali' },
                { value: 'spojni', label: 'Spojni materijal' },
                { value: 'montazni', label: 'Montažni materijal' }
            ]
        },
        {
            name: 'jedinicaMjere',
            label: 'Jedinica mjere',
            type: 'select',
            required: true,
            span: 12,
            options: [
                { value: 'kom', label: 'Komad (kom)' },
                { value: 'm', label: 'Metar (m)' },
                { value: 'm2', label: 'Kvadratni metar (m²)' },
                { value: 'kg', label: 'Kilogram (kg)' }
            ]
        },
    ],
};

export const requestSchema = {
    submitLabel: "Pošalji zahtjev",
    layout: "vertical",
    fields: [
        {
            name: 'opis',
            label: 'Opis zahtjeva',
            type: "textarea",
            required: true,
            span: 24,
            props: {
                rows: 4,
                placeholder: "Unesite detaljan opis zahtjeva..."
            }
        },
    ],
};

export const changePasswordSchema = {
    title: "Promjena lozinke",
    submitLabel: "Promijeni lozinku",
    layout: "vertical",
    fields: [
        {
            name: "oldPassword",
            label: "Trenutna lozinka",
            type: "password",
            required: true,
            span: 24
        },
        {
            name: "newPassword",
            label: "Nova lozinka",
            type: "password",
            required: true,
            span: 24,
            rules: [
                { min: 6, message: "Lozinka mora imati barem 6 karaktera!" },
                { max: 20, message: "Lozinka ne može biti duža od 20 karaktera!" },
                {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: "Lozinka mora sadržati bar jedno veliko slovo i jedan broj!"
                }
            ]
        },
        {
            name: "confirmPassword",
            label: "Potvrdi novu lozinku",
            type: "password",
            required: true,
            span: 24,
            rules: [
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('Lozinke se ne poklapaju!'));
                    },
                }),
            ],
        }
    ]
};
export const assignmentSchema = {
    title: "Zaduživanje resursa",
    submitLabel: "Sačuvaj zaduženje",
    fields: [
        {
            name: "manager",
            label: "Poslovođa",
            type: "select",
            required: true,
            apiEndpoint: "http://localhost:8080/api/poslovodje",
            optionLabel: "ime",
            optionValue: "jmb",
        },
        {
            name: "resourceType",
            label: "Tip resursa",
            type: "select",
            required: true,
            options: [
                { value: "VOZILO", label: "Vozilo" },
                { value: "OPREMA", label: "Radna oprema" },
                { value: "MATERIJAL", label: "Materijal" }
            ],
        },
        {
            name: "resursId",
            label: "Odaberi stavku",
            type: "select",
            required: true,
            dependsOn: "resourceType",
            endpoints: {
                VOZILO: "http://localhost:8080/api/vozila",
                OPREMA: "http://localhost:8080/api/radna-oprema",
                MATERIJAL: "http://localhost:8080/api/materijal"
            },
            optionLabel: "naziv",
            optionValue: "id",
        },
        {
            name: "datumZaduzenja",
            label: "Datum zaduženja",
            type: "date",
            required: true,
            span: 12,
        },
        {
            name: "datumRazduzenja",
            label: "Datum razduženja",
            type: "date",
            required: false,
            span: 12,
        },
        {
            name: "zaduzenaKolicina",
            label: "Zadužena količina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: "razduzenaKolicina",
            label: "Razdužena količina",
            type: "number",
            required: false,
            min: 0,
            span: 12,
        },
    ],
};

export const dailyTaskSchema = {
    title:"Podaci o dnevnom zadatku",
    submitLabel: "Kreiraj zadatak",
    layout: "vertical",
    fields: [
        {
            name: "opis",
            label: "Opis zadatka",
            type: "textarea",
            required: true,
            span: 24,
        },
        {
            name: "tehnicarJmb",
            label: "Tehničar",
            type: "select",
            required: true,
            span: 12,
            apiEndpoint: `http://localhost:8080/api/tehnicari/za-poslovodju/:jmb`,
            optionLabel: "ime",
            optionValue: "jmb",
        },
        {
            name: "datum",
            label: "Datum",
            type: "date",
            required: true,
            span: 12,
        }
    ],
};
export const myDailyTaskSchema = {
    submitLabel: "Kreiraj moj zadatak",
    layout: "vertical",
    fields: [
        {
            name: "opis",
            label: "Opis zadatka",
            type: "textarea",
            required: true,
            span: 24,
        },
        {
            name: "datum",
            label: "Datum",
            type: "date",
            required: true,
            span: 12,
        }
    ],
};