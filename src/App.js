import React, { useState, useEffect } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";
const socket = io.connect("http://192.168.0.104:3001");

function App() {
  const [listOfMarkers, setListOfMarkers] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const [currentPosition, setCurrentPosition] = useState();
  const [isOnline, setNetwork] = useState(window.navigator.onLine);
  const [connectionLost, setConnectionLost] = useState(false)

  useEffect(() => {
    socket.on("allMarkers", (data) => {
      setListOfMarkers(data);
    });
  }, [socket]);

  const markerIcon = new L.Icon({
    iconUrl: require("./assets/placeholder.png"),
    iconSize: [35, 35],
    iconAnchor: [17, 46],
    popupAnchor: [3, -46],
  });

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setCurrentPosition(e.latlng);
      },
    });
  }

  // function IsOnline() {
  //   return window.navigator.onLine;
  // }

  
  useEffect(() => {
    window.addEventListener("offline", setNetwork(window.navigator.onLine));
    window.addEventListener("online", setNetwork(window.navigator.onLine));
    return () => {
      window.removeEventListener("offline", setNetwork(window.navigator.onLine));
      window.removeEventListener("online", setNetwork(window.navigator.onLine));
    };
  });
  
  const sendLocalStorageData = async () => {
    console.log('Sincronizando......')
    const storageMarkers = localStorage.getItem("storageMarkers");

    if(storageMarkers) {
      const storageMarkersJson = JSON.parse(storageMarkers);

      storageMarkersJson.map(marker => socket.emit('saveMarker', marker))
      localStorage.removeItem('storageMarkers')
    }
  }

  const saveMarker = async () => {
    const { lat, lng } = currentPosition;
    const newMarker = { mensagem: messageValue, lat, lng };
    if (isOnline) {
      await socket.emit("saveMarker", newMarker);
      setCurrentPosition();
    } else {
      setConnectionLost(true)
      const markers = [];
      const storageMarkers = localStorage.getItem("storageMarkers");

      if (storageMarkers) {
        const storageMarkersJson = JSON.parse(storageMarkers);
        storageMarkersJson.map((marker) => markers.push(marker));
      }

      markers.push(newMarker);
      localStorage.setItem("storageMarkers", JSON.stringify(markers));
      setListOfMarkers([...listOfMarkers, newMarker]);
    }
  };

  useEffect(()=>{
    if(connectionLost && isOnline) {
      setConnectionLost(false)
      sendLocalStorageData()
    }
  },[isOnline, connectionLost])

  return (
    <div className="App">
      <MapContainer
        center={{ lat: -25.553399029829066, lng: -54.56973552703858 }}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentPosition ? (
          <Marker position={currentPosition} icon={markerIcon}>
            <Popup>
              <input
                type="text"
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
              />
              <button onClick={() => saveMarker()}>Salvar</button>
            </Popup>
          </Marker>
        ) : null}
        {listOfMarkers?.map((marker) => (
          <Marker position={[marker.lat, marker.lng]} icon={markerIcon}>
            <Popup>{marker.mensagem}</Popup>
          </Marker>
        ))}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

export default App;
