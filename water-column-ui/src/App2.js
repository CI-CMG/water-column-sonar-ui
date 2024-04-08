import React, { useState, useEffect } from 'react'
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles'


function App2() {
  const [pmTilesReady, setPmTilesReady] = useState(false)

  useEffect(() => {
    const protocol = new pmtiles.Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)
    setPmTilesReady(true)
  }, []);

  // docs.protomaps.com/pmtiles/maplibre
  const mapStyle = {
    version: 8,
    glyphs:'https://cdn.protomaps.com/fonts/pbf/{fontstack}/{range}.pbf',
    sources: {
        protomaps: {
            type: "vector",
            // url: "https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-bugs.pmtiles",
            url: "pmtiles://https://example.com/example.pmtiles",
            attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
        }
    },
    // layers: layers("protomaps", "light")
    layers: layers("protomaps", "light")
  }

  return (
    <div className="App2">  
      <Mapgl
        initialViewState={{
          latitude: 51.509865,
          longitude: -0.118092,
          zoom: 14
        }}
        mapLib={maplibregl}
        style={{width: '100vw', height: '100vh'}}
        mapStyle={pmTilesReady ? mapStyle: undefined}
      >
      </Mapgl>
    </div>
  );
}

export default App2;