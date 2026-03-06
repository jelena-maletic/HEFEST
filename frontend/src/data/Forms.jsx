export const projectSchema = {
    submitLabel: "Kreiraj projekat",
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
            optionValue: "prezime",         // polje iz DTO
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
            apiEndpoint: "http://localhost:8080/api/tehnicari",
            optionLabel: "ime",
            optionValue: "prezime",
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