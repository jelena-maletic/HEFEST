import dayjs from 'dayjs';

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
            return 'success';
        case 'aktivan':
            return 'processing';
        case 'neaktivan':
            return 'default';
        case 'u pripremi':
            return 'blue';
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