import React from "react";
import './Modal.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const Modal = ({ isOpen, onClose, setCoordinates }) => {
    const handleMapClick = (event) => {
        setCoordinates(event.latlng);
        onClose();
    };

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="close-button" onClick={onClose}>ปิด</button>
                    <MapContainer
                        center={[100.5, 13.5]}
                        zoom={8}
                        style={{ height: "400px", width: "100%" }}
                        onClick={handleMapClick}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                          />
                          <Marker position={[100.5, 13.5]}/>
                    </MapContainer>
                </div>
            </div>
        )
    );
};

export default Modal;