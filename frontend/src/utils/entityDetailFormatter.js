import { mappers } from '../data/mapper.jsx';
import { getNazivPoJmb } from '../services/apiHelpers'; // Obavezno uvezi funkciju

export const formatEntityDetails = async (entityData, entityType, userRole) => {
    const mapperConfig = mappers[entityType];

    if (!mapperConfig || !entityData) {
        const title = entityType ? mappers[entityType]?.title || 'Detalji Entiteta' : 'Nema podataka';
        return { title: title, items: [], isProject: false, rawData: null };
    }

    const { title, mapper } = mapperConfig;

    // --- LOGIKA ZA OBOGAĆIVANJE PODATAKA ---
    // Ako je entitet projekat, pretvaramo JMB-ove u Imena i Prezimena
    if (entityType === 'PROJECT') {
        // 1. Dohvatanje imena poslovođe (manager)
        if (entityData.manager) {
            entityData.managerIme = await getNazivPoJmb(entityData.manager);
        }

        // 2. Dohvatanje imena tima tehničara (projectTeam)
        if (entityData.projectTeam && Array.isArray(entityData.projectTeam)) {
            // Promise.all omogućava da se svi mrežni zahtjevi pokrenu istovremeno
            entityData.projectTeamImena = await Promise.all(
                entityData.projectTeam.map(jmb => getNazivPoJmb(jmb))
            );
        }
    }

    // Pozivamo maper koji sada u 'entityData' ima i nove atribute: managerIme i projectTeamImena
    const allItems = mapper(entityData, userRole);

    return {
        title: title,
        items: allItems,
        isProject: entityType === 'PROJECT',
        rawData: entityData
    };
};