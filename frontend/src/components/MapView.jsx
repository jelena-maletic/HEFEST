import {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapView.css"
import greenPinIcon from "../assets/green-pin.svg";
import grayPinIcon from "../assets/gray-pin.svg";

import {fetchProjects} from "../services/apiHelpers.js";

export default function MapView() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const getProjects = async () => {
            const data = await fetchProjects();
            setProjects(data);
        };

        getProjects();
    }, []);

    const today = new Date();

    const makeMarker = (active) =>
        new L.Icon({
            iconUrl: active ? greenPinIcon : grayPinIcon,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

    const isActive = (p) => {
        const beginning = new Date(p.pocetakRada);
        const end = p.krajRada ? new Date(p.krajRada) : null;
        const deadline = new Date(p.rok);

        return (
            today >= beginning &&
            today <= deadline &&
            (!end || today <= end)
        );
    };

    return (
        <div className="map-screen-container">
            <MapContainer center={[44.7722, 17.191]} zoom={13}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {projects.map((p, index) => {
                    const active = isActive(p);
                    const marker = makeMarker(active);

                    if(!p.lokacija) return null;

                    const [x, y] = p.lokacija.split(",").map((str) => parseFloat(str.trim()));

                    if(isNaN(x) || isNaN(y)) return null;

                    return (
                        <Marker key={`marker-${index}-${p.naziv}`} position={[x, y]} icon={marker}>
                            <Popup>
                                <strong>{p.naziv}</strong>
                                <br />
                                Početak: {new Date(p.pocetakRada).toLocaleDateString()}
                                <br />
                                Rok: {new Date(p.rok).toLocaleDateString()}
                                <br />
                                Status:{" "}
                                <span style={{ color: active ? "green" : "gray", fontWeight: "bold" }}>
                                    {active ? "Aktivno" : "Neaktivno"}
                                </span>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            <div className="map-legend">
                <div className="legend-item">
                    <img src={greenPinIcon} alt="Aktivno" />
                    <span>Aktivna radilišta</span>
                </div>
                <div className="legend-item">
                    <img src={grayPinIcon} alt="Neaktivno" />
                    <span>Neaktivna radilišta</span>
                </div>
            </div>
        </div>
    );
}