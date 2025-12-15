import { entityMappers } from '../data/entityMappers.jsx';

export const formatEntityDetails = (entityData, entityType, userRole) => {
    const mapperConfig = entityMappers[entityType];

    if (!mapperConfig || !entityData) {
        const title = entityType ? entityMappers[entityType]?.title || 'Detalji Entiteta' : 'Nema podataka';
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