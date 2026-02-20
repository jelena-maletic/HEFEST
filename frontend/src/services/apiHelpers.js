import api from "../auth/axiosInstance.js";

export const fetchProjects = async () => {
    try {
        const response = await api.service(false).get("/projekti");
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvatanju projekta: " + error);
        return [];
    }
}

export const fetchData = async (tag) => {
    let response;
    try {
        response = await api.service(false).get(`/${tag}`);
    } catch (error) {
        console.error("Greška pri dohvatanju projekta: " + error);
        return [];
    }

    if (!response.data || !Array.isArray(response.data)) {
        console.error("Server nije vratio niz!");
        return;
    }

    const dataArray = Array.isArray(response.data) ? response.data : [response.data]

    switch (tag){
        case "radna-oprema":{
            return dataArray.flatMap((t) => {
                const oprema = [];
                oprema.push(
                    {
                        title: t.naziv,
                        detail: t.kategorija,
                        subline: t.stanjeMagacina
                    }
                );
                return oprema;
            });
        }
    }
}