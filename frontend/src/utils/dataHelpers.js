import dayjs from 'dayjs';
import {getJmb, getRole} from "../auth/auth.js";
import axios from "axios";
import {api} from "../services/apiHelpers.js";

export const loadAssets = () => {
    const imagesLong = import.meta.glob('../assets/*.svg', { eager: true });

    return Object.entries(imagesLong).reduce((acc, [path, module]) => {
        let name = path.split('/').pop().replace(/\.svg/, '');
        acc[name] = module.default;
        return acc;
    }, {});
}

export const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    return dayjs(isoDate).format('DD.MM.YYYY.');
};



export const getStatusTagColor = (status) => {
    const lowerStatus = status ? status.toLowerCase() : '';
    switch (lowerStatus) {
        case 'završen':
        case 'neodobren':
            return 'red';
        case 'aktivan':
            return 'green';
        case 'neaktivan':
            return 'default';
        case 'dogovoren':
            return 'blue';
        case 'odobren':
            return 'green';
        default:
            return 'default';
    }
};


export const getPriorityTagColor = (priority) => {
    const lowerPriority = priority ? priority.toLowerCase() : '';
    switch (lowerPriority) {
        case 'visok':
            return 'red';
        case 'srednji':
            return 'gold';
        case 'nizak':
            return 'green';
        default:
            return 'default';
    }
};


export const calculateAgeFromJMBG = (jmbg) => {
    if (!jmbg || jmbg.length < 13) return "N/A";

    const day = jmbg.substring(0, 2);
    const month = jmbg.substring(2, 4);
    const ggg = jmbg.substring(4, 7);

    let year;

    const gggNum = parseInt(ggg, 10);


    if (gggNum >= 0 && gggNum <= 99) {
        year = 2000 + gggNum;
    } else {
        year = 1000 + gggNum;

    }

    const birthDate = dayjs(`${year}-${month}-${day}`);

    if (!birthDate.isValid()) return "N/A";

    return dayjs().diff(birthDate, "year");
};

export const adjustFilterTag = (initialTag, activeTag) => {
    if(activeTag === "projekti" && getRole() === "poslovodja") {
        return ("dodijeljeni-" + activeTag);
    }
    if(activeTag === "sumarni_izvjestaji" || activeTag === "dnevni_izvjestaji" && getRole() === "poslovodja") {
        return (activeTag + "_poslovodja");
    }
    if(activeTag === "dnevni_izvjestaji" && getRole() === "tehnicar") {
        return (activeTag + "_tehnicar");
    }
    return initialTag;
}

export const getOptionFilterContext = async (activeTag, property) => {
    if (property === "jmbTehnicar" && getRole() === "poslovodja") {
        try {
            const response = await api.service(false).get(`/tehnicari/za-poslovodju/${getJmb()}`);
            const data = Array.isArray(response.data) ? response.data : [response.data];
            return { tehnicarJmbSet: new Set(data.map((t) => t.jmb)) };
        } catch (e) {
            console.error("Failed to fetch tehnicari for filter context:", e);
            return { tehnicarJmbSet: new Set() };
        }
    }
    return {};
};

export const optionFilter = (item, activeTag, property, context = {}) => {
    if (property === "klijent" && getRole() === "poslovodja") {
        return item.manager === getJmb();
    }
    if (property === "idProjekta" && getRole() === "poslovodja") {
        return item.manager === getJmb();
    }
    if (property === "idProjekta" && getRole() === "tehnicar") {
        const team = Array.isArray(item.projectTeam) ? item.projectTeam : [item.projectTeam];
        return team.includes(getJmb());
    }
    if (property === "jmbTehnicar" && getRole() === "poslovodja") {
        return context.tehnicarJmbSet?.has(item.jmb) ?? false;
    }
    return true;
};