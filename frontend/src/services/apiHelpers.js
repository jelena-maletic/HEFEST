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
        console.error("Greška pri dohvatanju podataka: " + error);
        return [];
    }

    if (!response.data || !Array.isArray(response.data)) {
        console.error("Server nije vratio niz!");
        return;
    }

    const dataArray = Array.isArray(response.data) ? response.data : [response.data]

    switch (tag) {
        case "radna-oprema": {
            return dataArray.flatMap((t) => {
                const oprema = [];

                let temp = {
                    title: t.naziv,
                    detail: t.stanjeMagacina,
                    subline: t.kategorija
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
                    detail: t.stanjeMagacina,
                    subline: t.datumRegistracije + " do " + t.datumIstekaRegistracije
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
                    detail: t.stanjeMagacina + " " + t.jedinicaMjere,
                    subline: t.kategorija
                };

                Object.assign(temp, t);

                materijal.push(temp);

                return materijal;
            });
        }

        case "zaposleni": {
            return dataArray.flatMap((t) => {
                const zaposleni = [];

                let temp = {
                    title: t.ime + " " + t.prezime,
                    detail: t.brojTelefona
                }
                Object.assign(temp, t);

                zaposleni.push(temp);
                return zaposleni;
            })
        }

        case "dnevni_izvjestaji": {
            return dataArray.flatMap((t) => {
                const dnevni = [];

                let temp = {
                    title: "nemamo naziv kreatora!!!",
                    detail: t.datum,
                    subline: t.opisRadova
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
                    title: "ovjde vjv treba naziv projekta",
                    detail: t.pocetniDatum + " - " + t.krajnjiDatum,
                    subline: t.opis
                }
                Object.assign(temp, t);

                sumarni.push(temp);
                return sumarni;
            })
        }

        case "tehnicari": {
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
                        detail: t.datumSlanja,
                        subline: t.stanjeZahtjeva
                    };
                Object.assign(temp, t);

                zahtjevi.push(temp)
                return zahtjevi;
            });
        }
        case "resursi-u-zahtjevu": {
            return dataArray.flatMap((t) => {
                const resursiUZahtjevu = [];
                let temp = {
                        title: t.resurs,
                        detail: t.kolicina,
                        subline: t.odobrenoZaduzenje
                    };
                Object.assign(temp, t);

                resursiUZahtjevu.push(temp)
                return resursiUZahtjevu;
            });
        }
        case "izvjestaji": {
            return dataArray.flatMap((t) => {
                const izvjestaji = [];
                let temp = {
                        title: t.opis,
                        detail: t.datumKreiranja,
                        subline: t.detalji
                    };
                Object.assign(temp, t);

                izvjestaji.push(temp)
                return izvjestaji;
            });
        }
    }
}