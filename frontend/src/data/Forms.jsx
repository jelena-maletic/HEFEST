export const projectSchema = {
    submitLabel: "Potvrdi",
    layout: "vertical",
    fields: [
        {
            name: "naziv",
            label: "Naziv projekta",
            type: "input",
            required: true,
            span: 12,
        },
        {
            name: "klijent",
            label: "Klijent/Firma",
            type: "input",
            required: true,
            span: 12,
        },

        // DINAMIČKI SELECT – manager iz baze
        {
            name: "manager",
            label: "Poslovođa na projektu",
            type: "select",
            required: true,
            span: 8,
            apiEndpoint: "http://localhost:8080/api/poslovodje",
            optionLabel: "ime",   // polje iz DTO
            optionValue: "jmb",         // polje iz DTO
        },

        // STATIČKI SELECT – nema potrebe da ide iz baze
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
                { value: "U_TOKU", label: "Radovi u toku" },
                { value: "ZAVRSEN", label: "Završen" },
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
            required: true,
            span: 8,
        },
        {
            name: "krajRada",
            label: "Kraj radova",
            type: "date",
            required: true,
            span: 8,
        },

        {
            name: "lokacija",
            label: "Adresa / Lokacija radilišta",
            type: "textarea",
            required: true,
            span: 24,
        },

        // DINAMIČKI MULTISELECT – tim iz baze
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
            required: true,
            span: 24,
        },
    ],
};

export const vehicleSchema = {
    submitLabel: "Sačuvaj vozilo",
    layout: "vertical",
    fields: [
        {
            name: "naziv", // Match: String naziv
            label: "Naziv (Marka i model)",
            type: "input",
            required: true,
            span: 12,
        },
        {
            name: "registarskiBroj", // Match: String registarskiBroj
            label: "Registarski broj",
            type: "input",
            required: true,
            span: 12,
        },
        {
            name: "tipVozila", // Match: TipVozila tipVozila (Enum)
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
            name: "brojPutnika", // Match: Integer brojPutnika
            label: "Broj putnika",
            type: "number",
            span: 12,
        },
        {
            name: "maksimalnaNosivost", // Match: BigDecimal maksimalnaNosivost
            label: "Maksimalna nosivost (kg)",
            type: "number",
            span: 12,
        },
        {
            name: "stanjeMagacina", // Match: BigDecimal stanjeMagacina
            label: "Stanje magacina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: "minimalnaKolicina", // Match: BigDecimal minimalnaKolicina
            label: "Minimalna količina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: "datumRegistracije", // Match: LocalDate datumRegistracije
            label: "Datum registracije",
            type: "date",
            required: false,
            span: 12,
        },
        {
            name: "datumIstekaRegistracije", // Match: LocalDate datumIstekaRegistracije
            label: "Datum isteka registracije",
            type: "date",
            required: false,
            span: 12,
        },
    ],
};

export const equipmentSchema = {
    submitLabel: "Sačuvaj opremu",
    layout: "vertical",
    fields: [
        {
            name: "naziv", // Match: String naziv
            label: "Naziv (Marka i model)",
            type: "input",
            required: true,
            span: 12,
        },
        {
            name: "stanjeMagacina", // Match: BigDecimal stanjeMagacina
            label: "Stanje magacina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: "minimalnaKolicina", // Match: BigDecimal minimalnaKolicina
            label: "Minimalna količina",
            type: "number",
            required: true,
            min: 0,
            span: 12,
        },
        {
            name: "kategorija", // Match: TipVozila tipVozila (Enum)
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