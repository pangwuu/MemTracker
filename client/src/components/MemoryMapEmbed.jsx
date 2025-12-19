/**
 * very similar to MapEmbed with the difference that pins can nav you to the memory selected. Used on the mapview of all memories 
 * */ 

import {useEffect} from 'react';
import { MapContainer, useMap , Marker} from 'react-leaflet'
import {Icon} from 'leaflet'
import 'leaflet/dist/leaflet.css';
import * as geolib from 'geolib';
import MapTileLayer from './MapTileLayer';
import MapPopUp from './MapPopup';
import markerIconPng from "../map-pin-icon.png"

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

export default function MemoryMapEmbed({memories, mode}) {

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
    <MapTileLayer mode={mode}/>
    {memories.map((memory, index) =>
    <Marker position={[memory.location_lat, memory.location_long]} key={index} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 0]})}>
        {MapPopUp(memory)}
    </Marker>)}

    <MapControllerChild positions={validPoints}></MapControllerChild>

  </MapContainer>
}

