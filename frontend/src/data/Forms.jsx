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
                { max: 100, message: "Naziv ne smije biti duži od 100 karaktera" },
                { min: 3, message: "Naziv mora imati bar 3 karaktera" }
            ]
        },
        {
            name: "klijent",
            label: "Klijent/Firma",
            type: "input",
            required: true,
            span: 12,
            rules: [{ max: 150, message: "Ime klijenta predugačko (max 150)" }]
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
            type: "location",
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
            rules: [{ max: 1000, message: "Opis ne smije prelaziti 1000 karaktera" }]
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
            rules: [{ max: 60, message: "Maksimalno 60 karaktera" }]
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
            rules: [
                { required: true, message: "Unesite broj putnika!" },
                {
                    type: "number",
                    min: 1,
                    message: "Broj putnika mora biti najmanje 1 (vozač)!"
                }
            ],
        },
        {
            name: "maksimalnaNosivost",
            label: "Maksimalna nosivost (kg)",
            type: "number",
            span: 12,
            rules: [
                {
                    type: "number",
                    min: 0,
                    message: "Nosivost ne može biti negativna!"
                }
            ],
        },
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
            rules: [{ max: 80, message: "Naziv radne opreme predugačak (max 80)" }]
        },
        {
            name: "stanjeMagacina",
            label: "Stanje magacina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
            rules: [
                {
                    type: "number",
                    min: 0,
                    message: "Ne može biti negativan broj!"
                }
            ],
        },
        {
            name: "minimalnaKolicina",
            label: "Minimalna količina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
            rules: [
                {
                    type: "number",
                    min: 0,
                    message: "Ne može biti negativan broj!"
                }
            ],
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
            span: 12,
            rules: [{ max: 80, message: "Naziv materijala predugačak (max 80)" }]
        },
        {
            name: "stanjeMagacina",
            label: "Stanje magacina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
            rules: [
                {
                    type: "number",
                    min: 0,
                    message: "Ne može biti negativan broj!"
                }
            ],
        },
        {
            name: "minimalnaKolicina",
            label: "Minimalna količina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
            rules: [
                {
                    type: "number",
                    min: 0,
                    message: "Ne može biti negativan broj!"
                }
            ],
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
    title: "Zahtjev za zaduživanje resursa",
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
                placeholder: "Unesite detaljan opis stavki i razloga zahtjeva..."
            }
        },
        {
            name: 'magacionerJmb',
            label: 'Magacioner',
            type: "select",
            required: true,
            span: 24,
            optionsTag: "magacioneri",
            props: {
                placeholder: "Izaberite magacionera",
                showSearch: true,
                optionFilterProp: "label"
            }
        }
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
            rules: [
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        const datumZaduzenja = getFieldValue('datumZaduzenja');

                        if (!value || !datumZaduzenja || value.isSameOrAfter(datumZaduzenja)) {
                            return Promise.resolve();
                        }

                        return Promise.reject(new Error('Datum razduženja ne može biti prije datuma zaduženja!'));
                    },
                }),
            ],
        },
        {
            name: "zaduzenaKolicina",
            label: "Zadužena količina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
            rules: [
                { required: true, message: "Ovo polje je obavezno!" },
                {
                    type: "number",
                    min: 0,
                    message: "Količina ne može biti negativna!"
                },
                {
                    validator: (_, value) =>
                        value > 0 ? Promise.resolve() : Promise.reject(new Error("Količina mora biti veća od 0!"))
                }
            ],
        },
        {
            name: "razduzenaKolicina",
            label: "Razdužena količina",
            type: "number",
            required: false,
            min: 0,
            span: 12,
            rules: [
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        const zaduzeno = getFieldValue('zaduzenaKolicina');

                        if (value === undefined || value === null || !zaduzeno || value <= zaduzeno) {
                            return Promise.resolve();
                        }

                        return Promise.reject(
                            new Error(`Razdužena količina ne može biti veća od zadužene (${zaduzeno})!`)
                        );
                    },
                }),
            ],
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
            rules: [{ max: 500, message: "Opis ne smije prelaziti 500 karaktera" }]
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
    title: "Podaci o dnevnom zadatku",
    submitLabel: "Kreiraj moj zadatak",
    layout: "vertical",
    fields: [
        {
            name: "opis",
            label: "Opis zadatka",
            type: "textarea",
            required: true,
            span: 24,
            rules: [{ max: 500, message: "Opis ne smije prelaziti 500 karaktera" }]
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

export const utroseniMaterijalSchema = [
    {
        name: "idMaterijala",
        label: "Materijal",
        type: "select",
        required: true,
        span: 24,
        apiEndpoint: "http://localhost:8080/api/materijal",
        optionLabel: "naziv",
        optionValue: "idResursa",
        rules: [{ required: true, message: "Molimo odaberite materijal!" }],
    },
    {
        name: "kolicina",
        label: "Količina",
        type: "number",
        required: true,
        span: 12,
        rules: [
            { required: true, message: "Unesite količinu!" },
            { type: "number", min: 0.01, message: "Količina mora biti veća od 0!" }
        ],
    },
    {
        name: "etaza",
        label: "Etaža / Sprat",
        type: "text",
        span: 12,
        rules: [{ max: 45, message: "Maksimalno 45 karaktera!" }],
    },
    {
        name: "pozicija",
        label: "Pozicija (Mjesto ugradnje)",
        type: "text",
        required: true,
        span: 12,
        rules: [
            { required: true, message: "Unesite poziciju!" },
            { max: 45, message: "Maksimalno 45 karaktera!" }
        ],
    },
    {
        name: "strujniKrug",
        label: "Strujni krug",
        type: "text",
        span: 12,
        rules: [{ max: 45, message: "Maksimalno 45 karaktera!" }],
    },
    {
        name: "namjena",
        label: "Namjena",
        type: "text",
        span: 24,
        rules: [{ max: 100, message: "Maksimalno 100 karaktera!" }],
    },
    {
        name: "napomena",
        label: "Napomena",
        type: "textarea",
        span: 24,
    }
];