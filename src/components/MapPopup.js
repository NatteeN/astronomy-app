import { click } from "@testing-library/user-event/dist/click";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const MapPopup = ({ setCoordinates }) => {
    const [position, setPosition] = useState(null);

    const MapClick = () => {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                setCoordinates(e.latlng);
            },
        });
        return position === null ? null : (
            <Marker position={position}></Marker>
        );
    };

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
        </MapContainer>
    );
};

export default MapPopup;