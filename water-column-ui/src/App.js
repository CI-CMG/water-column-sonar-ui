import * as React from 'react';
import Map, {NavigationControl} from 'react-map-gl';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

// import React, { useState, useEffect } from 'react'
// import * as React from 'react';
// import { Map as Mapgl } from 'react-map-gl';
// import maplibregl from 'maplibre-gl';
// import layers from 'protomaps-themes-base';
// import Map, {NavigationControl} from 'react-map-gl';
// import * as maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles';
// import { protomaps_themes_base } from './protomaps_themes.js'


function App() {
  const protocol = new pmtiles.Protocol()

  maplibregl.addProtocol('pmtiles', (request) => {
      return new Promise((resolve, reject) => {
          const callback = (err, data) => {
              if (err) {
                  reject(err);
              } else {
                  resolve({data});
              }
          };
          protocol.tile(request, callback);
      });
  });

  const PMTILES_URL = 'https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-bugs.pmtiles';
  const p = new pmtiles.PMTiles(PMTILES_URL);
  protocol.add(p);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          The Marine Biome
        </p>
        <Map mapLib={maplibregl} 
          initialViewState={{
            longitude: -90,
            latitude: 35,
            zoom: 3
          }}
          style={{width: "100%", height: " calc(100vh - 77px)"}}
          // dev
          mapStyle="https://api.maptiler.com/maps/dataviz/style.json?key=uMYLQvAC15QgrNFraxBy"
          // prod
          // mapStyle="https://api.maptiler.com/maps/streets/style.json?key=oQmpkiz9dmHrVnWZvRru"
          renderWorldCopies={true}
          // workerCount={8}
        >
          <NavigationControl position="top-left" />
        </Map>
      </header>
    </div>
  );
}

export default App;

// function App() {

//   const [pmTilesReady, setPmTilesReady] = useState(false)

//   useEffect(() => {
//     const protocol = new pmtiles.Protocol()
//     maplibregl.addProtocol('pmtiles', protocol.tile)
//     setPmTilesReady(true)
//   }, []);

//   const mapStyle = {
//     version:8,
//     glyphs:'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
//     sources: {
//         protomaps: {
//             type: "vector",
//             url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-bugs.pmtiles",
//         }
//     },
//     layers: layers("protomaps", "light")
//   }

//   return (
//     <div className="App">  
//       <Mapgl
//         initialViewState={{
//           longitude: -90,
//           latitude: 35,
//           zoom: 3
//         }}
//         style={{width: "100%", height: " calc(100vh - 77px)"}}
//         renderWorldCopies={true}
//       >
//       </Mapgl>
//     </div>
//   );
// }

// function App() {
//   let protocol = new pmtiles.Protocol();
  
//   // https://protomaps.com
//   maplibregl.addProtocol("pmtiles", protocol.tile);
//   const mapStyle = {
//     version: 8,
//     sources: {
//       example_source: {
//           type: "vector",
//           url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-bugs.pmtiles",
//       }
//     }
//   };

//   // const start = [-74.5, 40];
//   // const end = [74.5, 40];

//   return (
//     <div className="App">
//       <p>
//         The Marine Biome
//       </p>
//       <Map mapLib={maplibregl} 
//         initialViewState={{
//           longitude: -90,
//           latitude: 35,
//           zoom: 3
//         }}
//         style={{width: "100%", height: " calc(100vh - 77px)"}}
//         // dev
//         // mapStyle="https://api.maptiler.com/maps/streets/style.json?key=uMYLQvAC15QgrNFraxBy"
//         // mapStyle="https://api.maptiler.com/maps/dataviz/style.json?key=uMYLQvAC15QgrNFraxBy"
//         mapStyle={mapStyle},
//         // mapStyle="https://api.maptiler.com/maps/ocean/style.json?key=uMYLQvAC15QgrNFraxBy"
//         renderWorldCopies={true}
//         // prod
//         // mapStyle="https://api.maptiler.com/maps/streets/style.json?key=oQmpkiz9dmHrVnWZvRru"
//       >
//         <NavigationControl position="top-left" />
//       </Map>
//     </div>
//   );
// }

// export default App;
