import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from "react-leaflet";

import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useURLPosition } from "../hooks/useURLPosition";
// import { useSearchParams } from "react-router-dom";

export default function Map() {

  const [mapPosition, setMapPosition] = useState([18.5766,73.6845]);
  const {cities} = useCities();
  const {isLoading: isLoadingPosition, position: geoLocationPosition, getPosition  } = useGeolocation()
  
  const [mapLat, mapLng] = useURLPosition();

  useEffect(() => {
    if(mapLat && mapLng)
    setMapPosition([mapLat, mapLng])
  },[mapLat,mapLng])


  useEffect(() => {
    if(geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng])
    }
  },[geoLocationPosition])

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (<Button type="position" onClick={getPosition}>
        {isLoadingPosition ? 'Loading...' : "Use your position"}
      </Button>)}
      <MapContainer 
      center={mapPosition} 
      zoom={13} 
      scrollWheelZoom={true} 
      className={styles.map} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
        return <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
          <Popup>
            <span>{city.emoji}</span><span>{city.cityName}</span>
          </Popup>
        </Marker>
        })}
        <ChangeCenter position={mapPosition}/>
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter(prop) {
  const {position} = prop;
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  });
}