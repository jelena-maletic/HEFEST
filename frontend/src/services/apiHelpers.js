import api from "../auth/axiosInstance.js";
import { getJmb } from "../auth/auth.js";

const formatValue = (value, unit = "") => (value !== null && value !== undefined && value !== "")
    ? `${value}${unit}`
    : "Nije dostupno";

export const fetchProjects = async () => {
    try {
        const response = await api.service(false).get("/projekti");
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvatanju projekta: " + error);
        return [];
    }
}

export const createElement = async (tag, data) => {
    const ulogovaniJmb = getJmb();

    // Mapiranje za kreiranje projekta (Frontend -> Backend DTO)
    let payload = {
        ...data,
        ulogovaniJmb: ulogovaniJmb
    };

    if (tag === "projekti") {
        payload.projectTeam = data.timTehnicara || [];
        payload.manager = data.poslovodja;
        delete payload.timTehnicara;
        delete payload.poslovodja;
    }

    try {
        // BITNO: Koristi api.service da prođe token
        const response = await api.service(false).post(`/${tag}`, payload);
        return response.status;
    } catch (error) {
        console.error(`Greška pri kreiranju elementa na tagu ${tag}:`, error);
        throw error;
    }
};

export const deleteElement = async (tag, id) => {
    const apiTag = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;
    try {
        const response = await api.service(false).delete(`/${apiTag}/${id}`);
        return response.status;
    } catch (error) {
        console.error("Greška pri brisanju:", error);
        throw error;
    }
};

export const updateElement = async (tag, id, data) => {
    const apiRoute = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;

    let finalData = { ...data };

    // MAPIRANJE: Frontend polja -> Backend DTO polja (@JsonProperty)
    if (tag === "projekti") {
        finalData.projectTeam = data.timTehnicara || [];
        finalData.manager = data.poslovodja;
        finalData.ulogovaniJmb = getJmb(); // Dodajemo JMB direktora radi sigurnosti

        delete finalData.timTehnicara;
        delete finalData.poslovodja;

        console.log("Šaljem podatke za update projekta:", finalData);
    }

    if (tag === "moji_dnevni_zadaci") {
        const ulogovaniJmb = getJmb();
        finalData.tehnicarJmb = ulogovaniJmb;
        finalData.ulogovaniJmb = ulogovaniJmb;
    }

    try {
        // BITNO: Koristi api.service(false) da bi se dodao Authorization header!
        const response = await api.service(false).put(`/${apiRoute}/${id}`, finalData);
        return response.status;
    } catch (error) {
        console.error(`Greška pri ažuriranju taga ${tag}:`, error);
        throw error;
    }
};

export const fetchData = async (tag, filterPoslovodja = null, filterTehnicar = null) => {
    const apiTag = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;
    try {
        const response = await api.service(false).get(`/${apiTag}`);

        if (!response.data || !Array.isArray(response.data)) {
            let singleData = response.data ? [response.data] : [];
            return processData(tag, singleData, filterPoslovodja, filterTehnicar);
        }

        return processData(tag, response.data, filterPoslovodja, filterTehnicar);
    } catch (error) {
        console.error("Greška pri dohvatanju podataka: " + error);
        return [];
    }
};

// Pomoćna funkcija za obradu podataka radi preglednosti
const processData = (tag, dataArray, filterPoslovodja, filterTehnicar) => {
    let result = [...dataArray];
    const ulogovaniJmb = getJmb();

    // Logika filtriranja
    if ((tag === "dnevni_zadaci" || tag === "moji_dnevni_zadaci") && filterPoslovodja) {
        result = result.filter(t => t.poslovodja?.jmb === ulogovaniJmb);
    }
    // ... ostatak tvojih filtera ostaje isti ...

    switch (tag) {
        case "projekti":
            return result.map((t) => ({
                ...t,
                // MAPIRANJE: Backend DTO polja -> Frontend polja (za DynamicForm)
                timTehnicara: t.projectTeam || [],
                poslovodja: t.manager || null,
                title: formatValue(t.naziv),
                detail: formatValue(t.opis),
                subline: `Početak rada: ${formatValue(t.pocetakRada)}`
            }));

        // Ostali case-ovi (radna-oprema, vozila, itd.) ostaju isti kao u tvom originalu
        default:
            return result;
    }
};

export const getNazivPoJmb = async (jmb) => {
    if (!jmb) return "Nije dodijeljen";
    try {
        const response = await api.service(false).get(`/korisnici/${jmb}`);
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvatanju imena za JMB: " + jmb, error);
        return jmb;
    }
};

export const updateZadatakStatus = async (id, isZavrsen) => {
    try {
        const response = await api.service(false).patch(`/dnevni_zadaci/${id}/status`, null, {
            params: { zavrsen: isZavrsen }
        });
        return response.status;
    } catch (error) {
        console.error("Greška pri ažuriranju statusa zadatka:", error);
        throw error;
    }
};