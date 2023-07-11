import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import "leaflet/dist/leaflet.css"
import { Marker, Popup } from 'react-leaflet'
import L from "leaflet";
import markerIconUrl from "../assets/mapMarker/marker.png";


const markerIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [35, 35],
  popupAnchor: [-6, -20]
})





const Map = ({ service }) => {

  const position = [service?.ubicaciones[0].coordenadas.x, service?.ubicaciones[0].coordenadas.y];
  console.log(position)


  return (
    <div className='mapContainer'>

      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
        position={position}
        icon={markerIcon}
        >
          <Popup>
            Ubicados en {service.ubicaciones[0].ciudad}
          </Popup>
        </Marker>
      </MapContainer>
    </div>

  )
}

export default Map
