import {
    projectSchema,
    vehicleSchema,
    equipmentSchema,
    materialSchema,
    assignmentSchema
} from "./Forms.jsx";

export const schemaMap = {
    "projekti": projectSchema,
    "vozila": vehicleSchema,
    "radna-oprema": equipmentSchema,
    "materijal": materialSchema,
    "zaduzenja": assignmentSchema,
};