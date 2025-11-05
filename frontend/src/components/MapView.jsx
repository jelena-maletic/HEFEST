import {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapView.css"
import greenPinIcon from "../assets/zeleni-pin.svg";
import grayPinIcon from "../assets/sivi-pin.svg";


export default function MapView() {
    const [projekti, setProjekti] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/projekti")
            .then((response) => response.json())
            .then((data) => setProjekti(data))
            .catch((error) => console.log("Greška pri dohvatanju projekata:", error));
    }, []);

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