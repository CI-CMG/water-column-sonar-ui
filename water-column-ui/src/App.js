import * as React from 'react';
import Map, {NavigationControl} from 'react-map-gl';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

function App() {
  const start = [-74.5, 40];
  const end = [74.5, 40];

  return (
    <div className="App">
      <p>
        Flora & Fauna — The Marine Biome
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
        // mapStyle="https://api.maptiler.com/maps/ocean/style.json?key=uMYLQvAC15QgrNFraxBy"
        renderWorldCopies={true}
        // prod
        // mapStyle="https://api.maptiler.com/maps/streets/style.json?key=oQmpkiz9dmHrVnWZvRru"
      >
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
}

export default App;
