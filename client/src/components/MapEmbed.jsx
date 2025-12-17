import {useEffect} from 'react';
import { MapContainer, useMap , Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import * as geolib from 'geolib';
import markerIconPng from "../map-pin-icon.png"
import MapTileLayer from './MapTileLayer';
import {Icon} from 'leaflet'

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
    map.fitBounds([corner1, corner2], { padding: [40, 40], maxZoom: 15, animate: true });

  }, [positions, map])

}

export default function MapEmbed({positions, mode}) {

  // calculate central position
  
  // if (positions.length >= 1) {
    const center = geolib.getCenterOfBounds(positions)
    const initialCenter = [center.latitude, center.longitude];
    
    return <MapContainer
    center={initialCenter} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "50vh", width: "100%" }}
            >
    <MapTileLayer mode={mode}/>
    {positions.map((position, index) => 
    <Marker position={[position.lat, position.lon]} key={index} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 0]})}>
        <Popup >Memory location!</Popup>
    </Marker>)}

    <MapControllerChild positions={positions}></MapControllerChild>

  </MapContainer>
}