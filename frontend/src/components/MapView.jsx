import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapView.css"
import greenPinIcon from "../assets/zeleni-pin.svg";
import grayPinIcon from "../assets/sivi-pin.svg";

/* TODO: MOCKDATA (za svrhe testiranja) */
const projekti = [
    {
        id: 1,
        naziv: "MojMarket",
        lokacija: [44.7722, 17.1910],
        pocetakRada: "2025-09-01",
        krajRada: null,
        rok: "2025-12-31",
    },
    {
        id: 2,
        naziv: "Crvena Jabuka",
        lokacija: [44.7750, 17.2050],
        pocetakRada: "2024-05-15",
        krajRada: "2025-02-01",
        rok: "2025-02-01",
    },
    {
        id: 3,
        naziv: "Poslovni prostor",
        lokacija: [44.7805, 17.1750],
        pocetakRada: "2025-10-10",
        krajRada: null,
        rok: "2026-01-15",
    },
];

export default function MapView() {
    const danas = new Date();

    const napraviIkonu = (aktivno) =>
        new L.Icon({
            iconUrl: aktivno ? greenPinIcon : grayPinIcon,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

    const isAktivan = (p) => {
        const pocetak = new Date(p.pocetakRada);
        const kraj = p.krajRada ? new Date(p.krajRada) : null;
        const rok = new Date(p.rok);

        return (
            danas >= pocetak &&
            danas <= rok &&
            (!kraj || danas <= kraj)
        );
    };


    return (
        <div className="map-screen-container">
            <MapContainer center={[44.7722, 17.191]} zoom={13}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {projekti.map((p) => {
                    const aktivno = isAktivan(p);
                    const ikona = napraviIkonu(aktivno);
                    return (
                        <Marker key={p.id} position={p.lokacija} icon={ikona}>
                            <Popup>
                                <strong>{p.naziv}</strong>
                                <br />
                                Početak: {p.pocetakRada}
                                <br />
                                Rok: {p.rok}
                                <br />
                                Status:{" "}
                                <span style={{ color: aktivno ? "green" : "gray" }}>
                                    {aktivno ? "Aktivno" : "Neaktivno"}
                                </span>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Legenda */}
            <div className="map-legend">
                <div>
                    <img src={greenPinIcon} alt="Aktivno" /> Aktivna radilišta
                </div>
                <div>
                    <img src={grayPinIcon} alt="Neaktivno" /> Neaktivna radilišta
                </div>
            </div>

        </div>
    );
}