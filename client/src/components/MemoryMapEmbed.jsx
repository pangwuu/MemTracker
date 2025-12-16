// very similar to MapEmbed with the difference that pins can nav you to the memory selected.

import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, useMap , Marker, Popup, useMapEvents} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import * as geolib from 'geolib';
import { Typography } from '@mui/material';
import { NavLink } from 'react-router';
import MapTileLayer from './MapTileLayer';

function MapControllerChild({positions}) {
  // calculated ideal zoom and fits the bounds automatically
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length === 0) {
      return
    }
    // recalculate zoom levels if positions change!
    const bounds = geolib.getBounds(positions);
    
    const corner1 = [bounds.minLat, bounds.minLng];
    const corner2 = [bounds.maxLat, bounds.maxLng];

    // "fitBounds" automatically calculates the ideal zoom and center
    map.fitBounds([corner1, corner2], { padding: [10, 10], maxZoom: 15, animate: true });

  }, [positions, map])

}

export default function MemoryMapEmbed({memories}) {

    // be more defensive
    const points = (memories || []).map((memory) => ({
        lat: parseFloat(memory.location_lat), 
        lon: parseFloat(memory.location_long) 
    }));

    // Filter out invalid points (where lat/lon ended up NaN or undefined)
    const validPoints = points.filter(p => !isNaN(p.lat) && !isNaN(p.lon));

    // if (positions.length >= 1) {
    const center = geolib.getCenterOfBounds(validPoints)
    const initialCenter = [center.latitude, center.longitude];
    
    return <MapContainer
    center={initialCenter} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "70dvh", width: "100%" }}
            >
    <MapTileLayer/>
    {memories.map((memory, index) => 
    <Marker position={[memory.location_lat, memory.location_long]} key={index}>
        <Popup>
            <NavLink to={`/memoryDetailed/${memory.mem_id}`} style={{ textDecoration: 'none' }} key={index}>
                <Typography variant='body2'>{memory.title}</Typography>
            </NavLink>
        </Popup>
    </Marker>)}

    <MapControllerChild positions={validPoints}></MapControllerChild>

  </MapContainer>
}