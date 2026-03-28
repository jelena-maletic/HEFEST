import api from "../auth/axiosInstance.js";
import axios from "axios";
import { getJmb } from "../auth/auth.js";
const API_BASE = "http://localhost:8080/api";

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

    const payload = {
        ...data,
        ulogovaniJmb: ulogovaniJmb
    };

    try {
        const response = await axios.post(`${API_BASE}/${tag}`, payload);
        return response.status;
    } catch (error) {
        console.error(`Greška pri kreiranju elementa na tagu ${tag}:`, error);
        throw error;
    }
};

    export const deleteElement = async (tag, id) => {
        const apiTag = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;
        const response = await axios.delete(`${API_BASE}/${apiTag}/${id}`);
        return response.status;
    };

export const updateElement = async (tag, id, data) => {
    // 1. Mapiranje rute (oba idu na isti endpoint na backendu)
    const apiRoute = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;

    let finalData = { ...data };

    // 2. Logika za JMB: Samo ako je ORIGINALNI tag "moji_dnevni_zadaci"
    if (tag === "moji_dnevni_zadaci") {
        const ulogovaniJmb = getJmb();
        finalData.tehnicarJmb = ulogovaniJmb;
        finalData.ulogovaniJmb = ulogovaniJmb;
        console.log("Dodijeljen sopstveni JMB za update:", finalData.tehnicarJmb);
    }

    try {
        // 3. KORISTI api.service(false) umjesto običnog axios-a
        // false vjerovatno znači da ne koristiš "multipart/form-data" već običan JSON
        const response = await api.service(false).put(`/${apiRoute}/${id}`, finalData);

        return response.status;
    } catch (error) {
        console.error(`Greška pri ažuriranju taga ${tag}:`, error);
        throw error;
    }
};



    export const fetchData = async (tag, filterPoslovodja = null, filterTehnicar=null) => {
        let response;
        const apiTag = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;
        try {
            response = await api.service(false).get(`/${apiTag}`);
        } catch (error) {
            console.error("Greška pri dohvatanju podataka: " + error);
            return [];
        }

        if (!response.data || !Array.isArray(response.data)) {
            console.error("Server nije vratio niz!");
            return;
        }

        let dataArray = Array.isArray(response.data) ? response.data : [response.data]

        const isZadatakTag = (tag === "dnevni_zadaci" || tag === "moji_dnevni_zadaci");

        if (isZadatakTag && filterPoslovodja) {
            const ulogovaniJmb = getJmb();
            dataArray = dataArray.filter(t => t.poslovodja?.jmb === ulogovaniJmb);
        }

        if (isZadatakTag && filterTehnicar) {
            const ulogovaniJmb = getJmb();
            dataArray = dataArray.filter(t => t.tehnicar?.jmb === ulogovaniJmb);
        }

        if (tag === "projekti" && filterPoslovodja) {
            const ulogovaniJmb = getJmb();
            console.log(ulogovaniJmb);
            dataArray = dataArray.filter(t =>
                t.manager === ulogovaniJmb
            );
        }

        if (tag === "dnevni_zadaci" && filterPoslovodja) {
            const ulogovaniJmb = getJmb();
            dataArray = dataArray.filter(t =>
                    t.poslovodja.jmb === ulogovaniJmb
            );
        }

        if (tag === "dnevni_zadaci" && filterTehnicar) {
            const ulogovaniJmb = getJmb();
            dataArray = dataArray.filter(t =>
                     t.tehnicar.jmb === ulogovaniJmb

            );
        }

        if (tag === "zaduzenja" && filterPoslovodja) {
            const ulogovaniJmb = getJmb();
            dataArray = dataArray.filter(t =>
                t.manager === ulogovaniJmb
            );
        }


        switch (tag) {
            case "radna-oprema": {
                return dataArray.flatMap((t) => {
                    const oprema = [];

                    let temp = {
                        title: t.naziv,
                        detail: "Stanje magacina: " + t.stanjeMagacina,
                        subline: "Kategorija: " + t.kategorija
                    };
                    Object.assign(temp, t);

                    oprema.push(temp);

                    return oprema;
                });
            }

            case "vozila": {
                return dataArray.flatMap((t) => {
                    const naziv = formatValue(t.naziv);
                    const reg = formatValue(t.registarskiBroj);
                    return [{
                        ...t,
                        title: `${naziv} - ${reg}`,
                        detail: formatValue(t.tipVozila),
                        subline: `Registracija: ${formatValue(t.datumRegistracije)} do ${formatValue(t.datumIstekaRegistracije)}`
                    }];
                });
            }
            case "materijal": {
                return dataArray.flatMap((t) => {
                    const materijal = [];

                    let temp = {
                        title: t.naziv,
                        detail: "Stanje magacina: " + t.stanjeMagacina + " " + t.jedinicaMjere,
                        subline: "Kategorija: " + t.kategorija
                    };

                    Object.assign(temp, t);

                    materijal.push(temp);

                    return materijal;
                });
            }

            case "knjigovodje":
            case "poslovodje":
            case "magacioneri":
            case "tehnicari":
            case "zaposleni": {
                return dataArray.flatMap((t) => {
                    const ime = t.ime || "Nema imena";
                    const prezime = t.prezime || "";
                    return [{
                        ...t,
                        title: `${ime} ${prezime}`.trim() || "Nepoznat radnik",
                        detail: formatValue(t.brojTelefona),
                        subline: formatValue(t.email)
                    }];
                });
            }

            case "moji_dnevni_zadaci":
            case "dnevni_zadaci":
            {
                return dataArray.flatMap((t) => {
                    let temp = {
                        id: t.idDnevnogZadatka,

                        tehnicarJmb: t.tehnicar ? String(t.tehnicar.ime + " " + t.tehnicar.prezime) : null,

                        title: t.opis,
                        detail: "Datum: " + t.datum,
                        subline: "Tehničar: " + (t.tehnicar?.ime + " " + t.tehnicar?.prezime),
                        status: t.zavrsen ? "Završen" : "U toku",
                        statusColor: t.zavrsen ? "green" : "orange"
                    };

                    return [{ ...t, ...temp }];
                });
            }

            case "dnevni_izvjestaji": {
                return dataArray.flatMap((t) => {
                    const dnevni = [];

                    let temp = {
                        title: t.projekat.naziv,
                        detail: t.datum,
                        subline: t.poslovodja.ime + " " + t.poslovodja.prezime
                    }
                    Object.assign(temp, t);

                    dnevni.push(temp);
                    return dnevni;
                })
            }

            case "sumarni_izvjestaji": {
                return dataArray.flatMap((t) => {
                    const sumarni = [];

                    let temp = {
                        title: t.projekat.naziv,
                        detail: "Od " + t.pocetniDatum + " do " + t.krajnjiDatum,
                        subline: t.poslovodja.ime + " " + t.poslovodja.prezime
                    }
                    Object.assign(temp, t);

                    sumarni.push(temp);
                    return sumarni;
                })
            }

            case "tehnicari/only": {
                return dataArray.flatMap((t) => {
                    const tehnicari = [];
                    let temp = {
                        title: t.ime + " " + t.prezime,
                        detail: t.brojTelefona,
                        subline: t.email
                    };
                    Object.assign(temp, t);

                    tehnicari.push(temp)
                    return tehnicari;
                });
            }

            case "zahtjevi": {
                return dataArray.flatMap((t) => {
                    const zahtjevi = [];
                    let temp = {
                        title: t.opis,
                        detail: "Datum slanja: " + t.datumSlanja,
                        subline: "Stanje zahtjeva: " + t.stanjeZahtjeva
                    };
                    Object.assign(temp, t);

                    zahtjevi.push(temp)
                    return zahtjevi;
                });
            }
            case "zaduzenja": {
                return dataArray.flatMap((t) => {
                    let formValues = {
                        id: `${t.manager}/${t.resursId}`,

                        manager: t.manager,
                        resourceType: t.resourceType,

                        resursId: t.resursId ? String(t.resursId) : null,

                        zaduzenaKolicina: t.zaduzenaKolicina,
                        razduzenaKolicina: t.razduzenaKolicina,
                        datumZaduzenja: t.datumZaduzenja,
                        datumRazduzenja: t.datumRazduzenja,

                        title: t.zaduzenaKolicina + "x " + (t.resursNaziv || "Nepoznat resurs"),
                        detail: "Datum zaduženja: " + t.datumZaduzenja,
                        subline: "Zadužio: " + (t.poslovodjaImePrezime || t.manager)
                    };

                    return [{ ...t, ...formValues }];
                });
            }
            case "projekti": {
                return dataArray.flatMap((t) => {
                    return [{
                        ...t,
                        title: formatValue(t.naziv),
                        detail: formatValue(t.opis),
                        subline: `Početak rada: ${formatValue(t.pocetakRada)}`
                    }];
                });
            }
        }
    }

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
        const response = await axios.patch(`${API_BASE}/dnevni_zadaci/${id}/status`, null, {
            params: { zavrsen: isZavrsen }
        });
        return response.status;
    } catch (error) {
        console.error("Greška pri ažuriranju statusa zadatka:", error);
        throw error;
    }
};