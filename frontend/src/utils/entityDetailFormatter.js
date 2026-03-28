import { mappers } from '../data/mapper.jsx';
import { getNazivPoJmb } from '../services/apiHelpers'; // Obavezno uvezi funkciju
import {reverseGeocode} from './reverseGeocode.js';

export const formatEntityDetails = async (entityData, entityType, userRole) => {
    const mapperConfig = mappers[entityType];

    if (!mapperConfig || !entityData) {
        const title = entityType ? mappers[entityType]?.title || 'Detalji Entiteta' : 'Nema podataka';
        return { title: title, items: [], isProject: false, rawData: null };
    }

    const { title, mapper } = mapperConfig;

    if (entityType === 'PROJECT') {
        if (entityData.lokacija) {
            entityData.lokacijaNaziv = await reverseGeocode(entityData.lokacija);
        }


        if (entityData.manager) {
            entityData.managerIme = await getNazivPoJmb(entityData.manager);
        }


        if (entityData.projectTeam && Array.isArray(entityData.projectTeam)) {

            entityData.projectTeamImena = await Promise.all(
                entityData.projectTeam.map(jmb => getNazivPoJmb(jmb))
            );
        }
    }

    const allItems = mapper(entityData, userRole);

    return {
        title: title,
        items: allItems,
        isProject: entityType === 'PROJECT',
        rawData: entityData
    };
};