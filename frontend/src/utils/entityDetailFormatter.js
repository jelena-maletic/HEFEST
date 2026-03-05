import { mappers } from '../data/mapper.jsx';

export const formatEntityDetails = (entityData, entityType, userRole) => {
    const mapperConfig = mappers[entityType];

    if (!mapperConfig || !entityData) {
        const title = entityType ? mappers[entityType]?.title || 'Detalji Entiteta' : 'Nema podataka';
        return { title: title, items: [], isProject: false, rawData: null };
    }

    const { title, mapper } = mapperConfig;

    const allItems = mapper(entityData, userRole);

    return {
        title: title,
        items: allItems,
        isProject: entityType === 'PROJECT',
        rawData: entityData
    };
};