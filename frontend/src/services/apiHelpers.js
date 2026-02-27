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
                        detail: t.stanjeMagacina,
                        subline: t.kategorija
                    }
                );
                return oprema;
            });
        }
        case "vozila":{
            return dataArray.flatMap((t) => {
                const vozilo = [];
                vozilo.push(
                    {
                        title: t.naziv + " - " + t.registarskiBroj,
                        detail: t.stanjeMagacina,
                        subline: t.datumRegistracije + " do " + t.datumIstekaRegistracije
                    }
                );
                return vozilo;
            });
        }
        case "materijal":{
            return dataArray.flatMap((t) => {
                const materijal = [];
                materijal.push(
                    {
                        title: t.naziv,
                        detail: t.stanjeMagacina + " " + t.jedinicaMjere,
                        subline: t.kategorija
                    }
                );
                return materijal;
            });
        }
        case "zaposleni":{
            return dataArray.flatMap((t) => {
                const zaposleni = [];
                zaposleni.push(
                    {
                        title: t.ime + " " + t.prezime,
                        detail: t.brojTelefona,
                        subline: t.jmb //uzeti neke druge podatke preko JMB?
                    }
                );
                return zaposleni;
            });
        }
        case "tehnicari":{
            return dataArray.flatMap((t) => {
                const tehnicari = [];
                tehnicari.push(
                    {
                        title: t.ime + " " + t.prezime,
                        detail: t.idProjekta,
                        subline: t.detalji
                    }
                );
                return tehnicari;
            });
        }
        case "dnevni_izvjestaji":{
            return dataArray.flatMap((t) => {
                const dnevni_izvjestaji = [];
                dnevni_izvjestaji.push(
                    {
                        title: t.opisRadova,
                        detail: t.datum,
                        subline: "ukupno " + t.ukupniSati + " sati"
                    }
                );
                return dnevni_izvjestaji;
            });
        }
        case "sumarni_izvjestaji":{
            return dataArray.flatMap((t) => {
                const sumarni_izvjestaji = [];
                sumarni_izvjestaji.push(
                    {
                        title: t.opis,
                        detail: t.pocetniDatum + " do " + t.krajnjiDatum,
                        subline: "ukupno " + t.ukupniSatiRada + " sati"
                    }
                );
                return sumarni_izvjestaji;
            });
        }
        case "zahtjevi":{
            return dataArray.flatMap((t) => {
                const zahtjevi = [];
                zahtjevi.push(
                    {
                        title: t.opis,
                        detail: t.datumSlanja,
                        subline: t.stanjeZahtjeva
                    }
                );
                return zahtjevi;
            });
        }
        case "resursi-u-zahtjevu":{
            return dataArray.flatMap((t) => {
                const resursiUZahtjevu = [];
                resursiUZahtjevu.push(
                    {
                        title: t.resurs,
                        detail: t.kolicina,
                        subline: t.odobrenoZaduzenje
                    }
                );
                return resursiUZahtjevu;
            });
        }
        case "izvjestaji":{
            return dataArray.flatMap((t) => {
                const tehnicari = [];
                tehnicari.push(
                    {
                        title: t.opis,
                        detail: t.datumKreiranja,
                        subline: t.detalji
                    }
                );
                return tehnicari;
            });
        }
    }
}