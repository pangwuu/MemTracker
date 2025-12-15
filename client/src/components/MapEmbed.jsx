import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, useMap , Marker, Popup, useMapEvents} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import * as geolib from 'geolib';


export default function MapEmbed({positions}) {
  //   expected input [
  //     { latitude: 51.51, longitude: 7.46 },
  //     { latitude: 51.52, longitude: 7.47 },
  //     { latitude: 51.53, longitude: 7.48 }
  // ]

  // calculate central position
  const center = geolib.getCenterOfBounds(positions)
  console.log(center)
  

  // calculate ideal zoom to show all markers - excluding outliers


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