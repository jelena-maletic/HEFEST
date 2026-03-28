import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import greenPinIcon from "../../assets/green-pin.svg";


const pickerIcon = new L.Icon({
    iconUrl: greenPinIcon,
    iconSize: [35, 50],
    iconAnchor: [17, 50],
});

function ClickHandler({ setPosition, onLocationSelected }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            const locationString = `${lat}, ${lng}`;
            setPosition([lat, lng]); // Postavlja marker na mapi
            onLocationSelected(locationString); // Šalje string "lat, lng" formi
        },
    });
    return null;
}

export default function LocationPicker({ onLocationSelected, initialValue }) {
    const defaultCenter = [44.7722, 17.191];
    const initialPos = initialValue
        ? initialValue.split(",").map(num => parseFloat(num.trim()))
        : null;

    const [position, setPosition] = useState(initialPos);

    return (
        <div style={{ height: "300px", width: "100%", marginBottom: "15px", borderRadius: "8px", overflow: "hidden" }}>
            <MapContainer center={initialPos || defaultCenter} zoom={13} style={{ height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <ClickHandler setPosition={setPosition} onLocationSelected={onLocationSelected} />

                {position && <Marker position={position} icon={pickerIcon} />}
            </MapContainer>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                {position ? `Odabrana lokacija: ${position[0].toFixed(4)}, ${position[1].toFixed(4)}` : "Kliknite na mapu da odaberete lokaciju radilišta"}
            </p>
        </div>
    );
}