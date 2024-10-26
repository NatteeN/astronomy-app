import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import './Modal.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// const Modal = ({ isOpen, onClose, setCoordinates }) => {
//     const handleMapClick = (event) => {
//         setCoordinates(event.latlng);
//         onClose();
//     };

const Modal = ({ isOpen, onClose, setCoordinates }) => {
    const [markerPosition, setMarkerPosition] = useState([13.5, 100.5]);
    const [mapCenter, setMapCenter] = useState([13.5, 100.5]);
    const mapRef = useRef();

    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;
        setMarkerPosition([lat, lng ]);
        setMapCenter([lat, lng]);
        console.log({ lat, lng });
        setCoordinates({ lat, lng });
    };

    useEffect(() => {
        if (isOpen && mapRef.current) {
          mapRef.current.leafletElement.invalidateSize();
        }
      }, [isOpen]);

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    {/* <button className="close-button" onClick={onClose}>ปิด</button> */}
                    <button className="close-button" onClick={onClose}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width="24"
                            height="24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                                />
                            </svg>              
                    </button>
                    <MapContainer
                        ref={mapRef}
                        center={mapCenter}
                        zoom={10}
                        className="map-container"
                        onClick={handleMapClick}
                    >
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                          />
                          <Marker key={markerPosition.toString()} position={markerPosition} />
                        <MapClickHandler onMapClick={handleMapClick}/>
                    </MapContainer>
                </div>
            </div>
        )
    );
};

const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
      click: onMapClick,
    });
    return null;
  };

export default Modal;