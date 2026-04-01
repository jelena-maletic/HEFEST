import {
    projectSchema,
    vehicleSchema,
    equipmentSchema,
    materialSchema,
    assignmentSchema,
    dailyTaskSchema, myDailyTaskSchema,
    requestSchema, utroseniMaterijalSchema, dnevniIzvjestajSchema, sumarniIzvjestajSchema
} from "./Forms.jsx";

export const schemaMap = {
    "projekti": projectSchema,
    "vozila": vehicleSchema,
    "radna-oprema": equipmentSchema,
    "materijal": materialSchema,
    "zaduzenja": assignmentSchema,
    "dnevni_zadaci": dailyTaskSchema,
    "moji_dnevni_zadaci":myDailyTaskSchema,
    "zahtjevi":requestSchema,
    "utroseni_materijal" : utroseniMaterijalSchema,
    "dnevni_izvjestaj": dnevniIzvjestajSchema,
"sumarni_izvjestaj" : sumarniIzvjestajSchema
};