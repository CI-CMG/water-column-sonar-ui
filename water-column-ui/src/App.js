import * as React from 'react';
import Map, {NavigationControl} from 'react-map-gl';
import * as maplibregl from 'maplibre-gl';
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
            longitude: -90,
            latitude: 35,
            zoom: 3
          }}
          style={{width: "100%", height: " calc(100vh - 77px)"}}
          // dev
          // mapStyle="https://api.maptiler.com/maps/streets/style.json?key=uMYLQvAC15QgrNFraxBy"
          mapStyle="https://api.maptiler.com/maps/dataviz/style.json?key=uMYLQvAC15QgrNFraxBy"
          // prod
          // mapStyle="https://api.maptiler.com/maps/streets/style.json?key=oQmpkiz9dmHrVnWZvRru"
        >
          <NavigationControl position="top-left" />
        </Map>
      </header>
    </div>
  );
}

export default App;
