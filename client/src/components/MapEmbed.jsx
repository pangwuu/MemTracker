import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, useMap , Marker, Popup, useMapEvents} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';


export default function MapEmbed({position}) {
    return <MapContainer
    center={position} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "50vh", width: "100%" }}
            >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
        <Popup>Memory location!</Popup>
    </Marker>
  </MapContainer>
}