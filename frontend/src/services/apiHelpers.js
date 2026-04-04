//import api from "../auth/axiosInstance.js";
import axiosInstance from "../auth/axiosInstance.js";
import axios from "axios";
import {getJmb} from "../auth/auth.js";
import {getStatusTagColor} from "../utils/dataHelpers.js";

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
    let payload = {...data};

    // Posebna transformacija za zahtjeve da odgovara backend DTO-u
    if (tag === "zahtjevi") {
        payload = {
            opis: data.opis,
            poslovodja: {jmb: ulogovaniJmb},
            magacioner: {jmb: data.magacionerJmb}
        };
    } else {
        payload.ulogovaniJmb = ulogovaniJmb;
    }

    try {
        // Koristimo api.service(false) da bi se automatski dodao Bearer token
        const response = await api.service(false).post(`/${tag}`, payload);
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
    const apiRoute = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;
    let finalData = {...data};

    // Transformacija za zahtjeve da odgovara DTO-u na backendu
    if (tag === "zahtjevi") {
        finalData = {
            opis: data.opis,
            magacioner: data.magacionerJmb ? { jmb: data.magacionerJmb } : null,
            // poslovodja se obično ne mijenja pri ažuriranju zahtjeva,
            // ali možeš dodati ako zatreba
        };
    }

    if (tag === "moji_dnevni_zadaci") {
        const ulogovaniJmb = getJmb();
        finalData.tehnicarJmb = ulogovaniJmb;
        finalData.ulogovaniJmb = ulogovaniJmb;
    }

    try {
        const response = await api.service(false).put(`/${apiRoute}/${id}`, finalData);
        return response.status;
    } catch (error) {
        console.error(`Greška pri ažuriranju taga ${tag}:`, error);
        throw error;
    }
};

export const getKorisnikPodaci = async (jmb) => {
    if (!jmb) return null;
    try {

        const response = await api.service(false).get(`/korisnici/${jmb}`);
        return response.data;
    } catch (error) {
        console.error("Greška pri dohvatanju podataka korisnika za JMB: " + jmb, error);
        throw error;
    }
};

const formatDateOnly = (dateString) => {
    if (!dateString) return "Nije definisano";
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS');
};

export const fetchData = async (tag, filterPoslovodja = false, filterTehnicar = false, filterByMagacioner = false) => {
    const ulogovaniJmb = getJmb();
    let response;
    const apiTag = tag === "moji_dnevni_zadaci" ? "dnevni_zadaci" : tag;
    try {

        if (tag === "tehnicari/only" && filterPoslovodja) {

            response = await api.service(false).get(`/tehnicari/za-poslovodju/${ulogovaniJmb}`);
        } else {

            response = await api.service(false).get(`/${apiTag}`);
        }} catch (error) {
        console.error("Greška pri dohvatanju podataka: " + error);
        return [];
    }

    if (!response.data || !Array.isArray(response.data)) {
        console.error("Server nije vratio niz!");
        return [];
    }

    let dataArray = Array.isArray(response.data) ? response.data : [response.data];



    if (tag === "zahtjevi" && filterPoslovodja) {
        dataArray = dataArray.filter(t => t.poslovodja?.jmb === ulogovaniJmb);
    }

    if (tag === "zahtjevi" && filterByMagacioner) {

        dataArray = dataArray.filter(t => t.magacioner?.jmb === ulogovaniJmb);
    }

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
    if (tag === "dnevni_izvjestaji" && filterPoslovodja) {
        const ulogovaniJmb = getJmb();

        dataArray = dataArray.filter(t =>
            (t.poslovodja.jmb === ulogovaniJmb)
        );
    }

    if (tag === "dnevni_izvjestaji" && filterTehnicar) {
        const ulogovaniJmb = getJmb();
        dataArray = dataArray.filter(t =>
            t.tehnicar.jmb === ulogovaniJmb
        );
    }

    if (tag === "sumarni_izvjestaji" && filterPoslovodja) {
        const ulogovaniJmb = getJmb();
        dataArray = dataArray.filter(t =>
            t.jmbPoslovodja === ulogovaniJmb
        );
    }


    switch (tag) {
        case "radna-oprema": {
            return dataArray.flatMap((t) => {
                const oprema = [];

                const lowStock = t.stanjeMagacina <= t.minimalnaKolicina * 1.2;
                let temp = {
                    isLowStock: lowStock,
                    title: t.naziv,

                    detail: lowStock
                        ? "Stanje magacina: " + t.stanjeMagacina + " (min: " + t.minimalnaKolicina + ")"
                        : "Stanje magacina: " + t.stanjeMagacina,

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

                const lowStock = t.stanjeMagacina <= t.minimalnaKolicina * 1.2;
                let temp = {
                    isLowStock: lowStock,
                    title: t.naziv,

                    detail: lowStock
                        ? "Stanje magacina: " + t.stanjeMagacina + " (min: " + t.minimalnaKolicina + ")"
                        : "Stanje magacina: " + t.stanjeMagacina,

                    subline: "Kategorija: " + t.kategorija
                };

                Object.assign(temp, t);

                materijal.push(temp);

                return materijal;
            });
        }

        case "knjigovodje":
        case "poslovodje":
        case "tehnicari/only":
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

        case "magacioneri": {
            return dataArray.map((m) => {
                const punoIme = `${m.ime || ""} ${m.prezime || ""}`.trim() || "Nepoznat magacioner";
                return {
                    ...m,
                    title: punoIme,      // Za stare komponente
                    label: punoIme,      // Za Ant Design Select (prikaz)
                    value: m.jmb,        // Za Ant Design Select (vrijednost)
                    detail: m.brojTelefona || "Nema kontakta",
                    subline: m.email || "Nema emaila"
                };
            });
        }

        case "moji_dnevni_zadaci":
        case "dnevni_zadaci": {
            return dataArray.flatMap((t) => {
                let temp = {
                    id: t.idDnevnogZadatka,

                    tehnicarJmb: t.tehnicar?.jmb || null,

                    tehnicarPunoIme: t.tehnicar ? `${t.tehnicar.ime} ${t.tehnicar.prezime}` : "Nije dodijeljen",

                    title: t.opis,
                    detail: "Datum: " + formatDateOnly(t.datum),
                    subline: "Tehničar: " + (t.tehnicar ? `${t.tehnicar.ime} ${t.tehnicar.prezime}` : "Nije dodijeljen"),
                    status: t.zavrsen ? "Završen" : "U toku",
                    statusColor: t.zavrsen ? "green" : "orange"
                };

                return [{...t, ...temp}];
            });
        }

        case "dnevni_izvjestaji": {
            return dataArray.flatMap((t) => {
                const dnevni = [];

                let temp = {
                    title: t.projekat.naziv,
                    detail: formatDateOnly(t.datum),
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
                    detail: "Od " + formatDateOnly(t.pocetniDatum) + " do " + formatDateOnly(t.krajnjiDatum),
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

            const ulogovaniJmb = getJmb();

            return dataArray.map((t) => {

                let dynamicTitle = "Nepoznat učesnik";

                if (t.magacioner?.jmb === ulogovaniJmb) {
                    dynamicTitle = t.poslovodja
                        ? `Od: ${t.poslovodja.ime} ${t.poslovodja.prezime}`
                        : "Nepoznat poslovođa";
                } else {
                    dynamicTitle = t.magacioner
                        ? `Za: ${t.magacioner.ime} ${t.magacioner.prezime}`
                        : "Za: Magacin (na čekanju)";
                }

                return {
                    ...t,
                    id: t.id,
                    title: dynamicTitle,
                    detail: t.opis,
                    subline: "Stanje: " + (t.stanjeZahtjeva?.toLowerCase() === "neobradjen" ? "neobrađen" : t.stanjeZahtjeva),
                    statusColor: getStatusTagColor(t.stanjeZahtjeva)
                };
            });
        }

        case "zaduzenja": {
            return dataArray.flatMap((t) => {
                const formatirajDatum = (isoString) => {
                    if (!isoString) return "Nije zaduženo";
                    const date = new Date(isoString);
                    return date.toLocaleDateString('sr-RS', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                };
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
                    detail: "Datum zaduženja: " + formatirajDatum(t.datumZaduzenja),
                    subline: "Zadužio: " + (t.poslovodjaImePrezime || t.manager)
                };

                return [{...t, ...formValues}];
            });
        }
        case "projekti": {
            return dataArray.flatMap((t) => {
                return [{
                    ...t,
                    title: formatValue(t.naziv),
                    detail: t.poslovodjaImePrezime || (t.manager ? `JMB: ${t.manager}` : "Projekat nije dodijeljen nijednom poslovođi"),
                    subline: `Početak: ${formatDateOnly(t.pocetakRada)}  •  Rok: ${formatDateOnly(t.rok)}`
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
            params: {zavrsen: isZavrsen}
        });
        return response.status;
    } catch (error) {
        console.error("Greška pri ažuriranju statusa zadatka:", error);
        throw error;
    }

};

export const updateZahtjevStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_BASE}/zahtjevi/${id}/stanjeZahtjeva`, {}, {
            params: {stanjeZahtjeva: status}
        });
        return response.status;
    } catch (error) {
        console.error("Greska pri azuriranju stanja zahtjeva", error);
        throw error;
    }
};

export const getTehnicarData = async (jmb) => {
    const response = await axios.get(`${API_BASE}/tehnicari/${jmb}`, {
        headers: {Authorization: `Bearer ${sessionStorage.getItem("token")}`}
    });
    return response.data; // Vraća cijeli objekat tehničara iz baze
};

export const updateTehnicarAktivnost = async (jmb, noviStatus) => {
    const response = await axios.patch(`${API_BASE}/tehnicari/${jmb}/aktivnost`, null, {
        params: {aktivan: noviStatus},
        headers: {Authorization: `Bearer ${sessionStorage.getItem("token")}`}
    });
    return response.status;
};

export const api = axiosInstance;