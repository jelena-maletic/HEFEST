import { useState } from 'react';

export const useVisibilityManager = (initialTypes, defaultVisibility = true) => {

    const [visibility, setVisibility] = useState(
        initialTypes.reduce((acc, type) => ({ ...acc, [type]: defaultVisibility }), {})
    );

    const hide = (idToHide) => {
        setVisibility(prev => ({
            ...prev,
            [idToHide]: false,
        }));
    };

    const show = (idToShow) => {
        setVisibility(prev => ({
            ...prev,
            [idToShow]: true,
        }));
    };

    return {
        visibility,
        hide,
        show,
    };
};