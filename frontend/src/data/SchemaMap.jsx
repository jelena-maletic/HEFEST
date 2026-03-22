import {
    projectSchema,
    vehicleSchema,
    equipmentSchema,
    materialSchema,
    assignmentSchema,
    dailyTaskSchema
} from "./Forms.jsx";

export const schemaMap = {
    "projekti": projectSchema,
    "vozila": vehicleSchema,
    "radna-oprema": equipmentSchema,
    "materijal": materialSchema,
    "zaduzenja": assignmentSchema,
    "dnevni_zadaci": dailyTaskSchema,
};