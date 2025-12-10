import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, useMap , Marker, Popup, useMapEvents} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';


export default function MapEmbed({position}) {
    // ensure position is an array of points

    const [clickedPosition, setClickedPosition] = useState(null)

    // child for the marker
    function OnMapClick({ onLocationSelected, position }) {
        // change the location of the marker to the new long and lat
        const map = useMapEvents({
            click(e) {
                // e.latlng contains { lat: ..., lng: ... }
                onLocationSelected(e.latlng);
                
                // Optional: Fly to the clicked point
                map.flyTo(e.latlng, map.getZoom());
            },
        })

        if (position === null) {
            console.log("No positions logged")
            return <></>
        }
        else {
            return <Marker
            position={position}>
                <Popup>You clicked here!</Popup>
            </Marker>
        }

    }

    return <MapContainer
    center={position} 
            zoom={8} 
            scrollWheelZoom={false} 
            style={{ height: "80vh", width: "100%" }}
            >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <OnMapClick position={clickedPosition}
    onLocationSelected={setClickedPosition}></OnMapClick>
  </MapContainer>
}