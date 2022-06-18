import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import osm from "./osm-providers";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from 'socket.io-client'
const endpoint = "http://192.168.0.104:3001"
const socket = io.connect("http://localhost:3001")

function App() {

  
  useEffect(() => {
    socket.on('listaMarca', (data) => {
      // setListOfMarkers(data)
      alert("Recebido")
      console.log('Recebido...')
    })
  }, [socket])

  useEffect(() => {
    // const socket = io(endpoint);

    socket.emit('ffff', {fe: "fefe"})
    console.log("Lista: ",listOfMarkers)
  }, [])

  const [center, setCenter] = useState({ lat: -25.284, lng: 305.2449 });
  const ZOOM_LEVEL = 9;
  const mapRef = useRef();
  const [listOfMarkers, setListOfMarkers] = useState([
    {text: "teste", position: {lat: -25.54755254134766, lng: -54.54746246337891}},
    {text: "teste2", position: {lat: -25.571091631069365, lng: -54.57080841064454}}
  ])
  const [buttonValue, setButtonValue] = useState("")

  const markerIcon = new L.Icon({
    iconUrl: require("./placeholder.png"),
    iconSize: [35, 45],
    iconAnchor: [17, 46],
    popupAnchor: [3, -46],
  });

  const [currentPosition, setCurrentPosition] = useState({lat: -25.535006795752302, lng: -54.60273742675782})
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        socket.emit("ffff", {})
        console.log(typeof(e.latlng.lat))
        setCurrentPosition(e.latlng)
        console.log("Evento: ",e.latlng)
      }
    })
  }

  useEffect(() => {
    
  }, listOfMarkers)

  function saveMarker() {
    const newMarker = {text: buttonValue, position: currentPosition}
    const list = listOfMarkers
    list.push(newMarker)
    setListOfMarkers(list)
    console.log("Lista: ",listOfMarkers)
  }

  return (
    <div className="App">
      {/* <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
      >
        <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution} />
        <Marker position={[-25.284, 305.2449]} icon={markerIcon}>
          <Popup>
            <p>Aqui é Foz do Iguaçú!!!!!</p>
          </Popup>
        </Marker>
      </MapContainer> */}
      <MapContainer center={{lat: -25.553399029829066, lng: -54.56973552703858}} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={currentPosition} icon={markerIcon}>
          <Popup>
            <input type="text" value={buttonValue} onChange={e => setButtonValue(e.target.value)} />
            <button onClick={() => saveMarker()}>Salvar</button>
          </Popup>
        </Marker>
        {listOfMarkers?.map(marker => (
          <Marker position={marker.position} icon={markerIcon}>
            <Popup>
              {marker.text}
            </Popup>
          </Marker>
        ))}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

export default App;
