import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import greenPinIcon from "../../assets/green-pin.svg";
import { Input, Button, Space, message } from 'antd';

const pickerIcon = new L.Icon({
    iconUrl: greenPinIcon,
    iconSize: [35, 50],
    iconAnchor: [17, 50],
});

function MapRefresher({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 16);
        }
    }, [center, map]);
    return null;
}

function ClickHandler({ setPosition, onLocationSelected }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onLocationSelected(`${lat}, ${lng}`);
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
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        if (initialValue && typeof initialValue === 'string' && initialValue.includes(',')) {
            const coords = initialValue.split(",").map(num => parseFloat(num.trim()));
            if (!isNaN(coords[0]) && !isNaN(coords[1])) {
                setPosition(coords);
            }
        }
    }, [initialValue]);

    const handleSearch = async () => {
        if (!searchQuery) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&accept-language=sr-Latn`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                const newPos = [lat, lon];

                setPosition(newPos);
                onLocationSelected(`${lat}, ${lon}`);
                setSearchQuery(data[0].display_name);
            } else {
                message.warning("Lokacija nije pronađena. Pokušajte sa preciznijim unosom.");
            }
        } catch (error) {
            console.error("Greška pri pretrazi:", error);
            message.error("Greška prilikom povezivanja sa servisom za mape.");
        }
    };

    return (
        <div style={{ marginBottom: "15px" }}>
            <Space.Compact style={{ width: '100%', marginBottom: '10px' }}>
                <Input
                    placeholder="Unesite adresu (npr. Vojvode Stepe 5) ili koordinate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onPressEnter={handleSearch}
                />
                <Button type="primary" onClick={handleSearch}>Pronađi</Button>
            </Space.Compact>

            <div style={{ height: "300px", width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid #d9d9d9" }}>
                <MapContainer center={position || defaultCenter} zoom={13} style={{ height: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <ClickHandler setPosition={setPosition} onLocationSelected={onLocationSelected} />
                    <MapRefresher center={position} />

                    {position && <Marker position={position} icon={pickerIcon} />}
                </MapContainer>
            </div>

            <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                {position
                    ? `Odabrana lokacija: ${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
                    : "Kliknite na mapu ili unesite adresu iznad."}
            </p>
        </div>
    );
}