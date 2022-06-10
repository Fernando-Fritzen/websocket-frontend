import React, { useRef, useState } from 'react'
import './App.css';
import { MapContainer, TileLayer } from 'react-leaflet'
import osm from './osm-providers'

function App() {

  const [center, setCenter] = useState({ lat: 13.084, lng: 80.2449 })
  const ZOOM_LEVEL = 9;
  const mapRef = useRef();

  return (
    <div className="App">
      <h1>ola</h1>
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
      >
        <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution} />
      </MapContainer>
    </div>
  );
}

export default App;
