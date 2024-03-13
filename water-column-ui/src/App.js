import * as React from 'react';
import Map, {NavigationControl} from 'react-map-gl';
// import maplibregl from 'maplibre-gl';
import * as maplibregl from 'maplibre-gl';
// import * as mapboxgl from 'mapbox-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          The Water Column Project
        </p>
        <Map mapLib={maplibregl} 
          initialViewState={{
            longitude: 16.62662018,
            latitude: 49.2125578,
            zoom: 14
          }}
          style={{width: "100%", height: " calc(100vh - 77px)"}}
          mapStyle="https://api.maptiler.com/maps/streets/style.json?key=uMYLQvAC15QgrNFraxBy	"
        >
          <NavigationControl position="top-left" />
        </Map>
      </header>
    </div>
  );
}

export default App;
