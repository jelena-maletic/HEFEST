import api from "../auth/axiosInstance.js";
import axios from "axios";
import { getJmb } from "../auth/auth.js";
const API_BASE = "http://localhost:8080/api";


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
        // Šaljemo na URL npr. "api/projekti" ili "api/zaposleni"
        const response = await axios.post(`${API_BASE}/${tag}`, payload);
        return response.status;
    } catch (error) {
        console.error(`Greška pri kreiranju elementa na tagu ${tag}:`, error);
        throw error;
    }
};

    export const deleteElement = async (tag, id) => {
        const response = await axios.delete(`${API_BASE}/${tag}/${id}`);
        return response.status;
    };

    export const updateElement = async (tag, id, data) => {
        const response = await axios.put(`${API_BASE}/${tag}/${id}`, data);
        return response.status;
    };

    export const fetchData = async (tag, filterPoslovodja = null) => {
        let response;
        try {
            response = await api.service(false).get(`/${tag}`);
        } catch (error) {
            console.error("Greška pri dohvatanju podataka: " + error);
            return [];
        }

        if (!response.data || !Array.isArray(response.data)) {
            console.error("Server nije vratio niz!");
            return;
        }

        let dataArray = Array.isArray(response.data) ? response.data : [response.data]

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
                filterPoslovodja === "user"
                    ? t.tehnicar?.jmb === ulogovaniJmb
                    : t.poslovodja?.jmb === ulogovaniJmb
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
                    const vozila = [];

                    let temp = {
                        title: t.naziv + " - " + t.registarskiBroj,
                        detail: t.tipVozila,
                        subline: "Registracija važi od " + t.datumRegistracije + " do " + t.datumIstekaRegistracije
                    }
                    Object.assign(temp, t);

                    vozila.push(temp);

                    return vozila;
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
                    const zaposleni = [];

                    let temp = {
                        title: t.ime + " " + t.prezime,
                        detail: t.brojTelefona,
                        subline: t.email
                    }
                    Object.assign(temp, t);

                    zaposleni.push(temp);
                    return zaposleni;
                })
            }

            case "dnevni_zadaci":
             {
                return dataArray.flatMap((t) => {
                    const zadaci = [];

                    let temp = {
                        title: t.opis,
                        detail: "Datum: " + t.datum,

                        subline: tag === "dnevni_zadaci"
                            ? "Tehničar: " + (t.tehnicar?.ime + " " + t.tehnicar?.prezime)
                            : "Poslovodja: " + (t.poslovodja?.ime + " " + t.poslovodja?.prezime),

                        status: t.zavrsen ? "Završen" : "U toku",
                        statusColor: t.zavrsen ? "green" : "orange"
                    };

                    Object.assign(temp, t);

                    zadaci.push(temp);
                    return zadaci;
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
                        detail: t.idProjekta,
                        subline: t.detalji
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
                    let temp = {
                        id: `${t.manager}/${t.resursId}`,
                        title: t.zaduzenaKolicina + "x " + t.resursNaziv,
                        detail: "Datum zaduženja: " + t.datumZaduzenja,
                        subline: "Zadužio: " + t.poslovodjaImePrezime,

                        resourceType: t.resourceType // Podatak koji smo dodali u DTO na backendu
                    };
                    Object.assign(temp, t);
                    return [temp];
                });
            }
            case "projekti": {
                return dataArray.flatMap((t) => {
                    const projects = [];
                    let temp = {
                        title: t.naziv,
                        detail: t.opis,
                        subline: "Datum početka rada: " + t.pocetakRada
                    };
                    Object.assign(temp, t);

                    projects.push(temp)
                    return projects;
                });
            }
        }
    }

export const getNazivPoJmb = async (jmb) => {
    if (!jmb) return "Nije dodijeljen";
    try {
        // Pozivamo tvoj novi endpoint u KorisnikController-u
        const response = await api.service(false).get(`/korisnici/${jmb}`);
        return response.data; // Vraća string "Ime Prezime"
    } catch (error) {
        console.error("Greška pri dohvatanju imena za JMB: " + jmb, error);
        return jmb; // Ako pukne, bar prikaži JMB
    }
};