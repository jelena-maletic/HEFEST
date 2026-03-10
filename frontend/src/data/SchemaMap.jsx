import {
    projectSchema,
    vehicleSchema,
    equipmentSchema,
    /*materialSchema,
    toolSchema,
    assignmentSchema,
    passwordSchema,
    dailyReportSchema,
    summaryReportSchema,
    resourceRequestSchema,
    taskSchema*/
} from "./Forms.jsx";

export const schemaMap = {
    "projekti": projectSchema,
    "vozila": vehicleSchema,
    "radna-oprema": equipmentSchema,
    /*materijal: materialSchema,
    alat: toolSchema,
    zaduzenje: assignmentSchema,
    lozinka: passwordSchema,
    dnevniIzvjestaj: dailyReportSchema,
    zbirniIzvjestaj: summaryReportSchema,
    zahtjevResursa: resourceRequestSchema,
    zadatak: taskSchema*/
};