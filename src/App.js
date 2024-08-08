import React, { useState, useRef, useEffect } from 'react'
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles'
import './App.css';

function App() {
  const mapContainer = useRef();
  const map = useRef();
  const [lng] = useState(-95);
  const [lat] = useState(35);
  const [zoom] = useState(2);

  // https://maplibre.org/maplibre-style-spec/layers/
  useEffect(() => {
    if (map.current) return;
    
    const style = {
      version: 8,
      name: "asdf",
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {
        maplibre: {
          type: "vector",
          url: "https://demotiles.maplibre.org/tiles/tiles.json"
        },
        zcta: {
          type: "vector",
          url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-bugs.pmtiles",
        },
      },
      layers: [
        {
          "id": "background",
          "type": "background",
          "paint": {
            "background-color": "#041d29"
          },
          "filter": [
            "all"
          ],
          "layout": {
            "visibility": "visible"
          },
          "maxzoom": 24
        },
        {
          "id": "coastline",
          "type": "line",
          "paint": {
            "line-blur": 2,
            "line-color": "#198EC8",
            "line-width": {
              "stops": [
                [
                  0,
                  2
                ],
                [
                  6,
                  6
                ],
                [
                  14,
                  9
                ],
                [
                  22,
                  18
                ]
              ]
            }
          },
          "filter": [
            "all"
          ],
          "layout": {
            "line-cap": "round",
            "line-join": "round",
            "visibility": "visible"
          },
          "source": "maplibre",
          "maxzoom": 24,
          "minzoom": 0,
          "source-layer": "countries"
        },
        {
          "id": "countries-fill",
          "type": "fill",
          "layout": {
            "visibility": "visible"
          },
          "source": "maplibre",
          "maxzoom": 24,
          "source-layer": "countries"
        },
        {
          "id": "geolines-label",
          "type": "symbol",
          "paint": {
            "text-color": "#1077B0",
            "text-halo-blur": 2,
            "text-halo-color": "rgba(255, 255, 255, 1)",
            "text-halo-width": 1
          },
          "filter": [
            "all",
            [
              "!=",
              "name",
              "International Date Line"
            ]
          ],
          "layout": {
            "text-font": [
              "Open Sans Semibold"
            ],
            "text-size": {
              "stops": [
                [
                  2,
                  12
                ],
                [
                  6,
                  16
                ]
              ]
            },
            "text-field": "{name}",
            "visibility": "visible",
            "symbol-placement": "line"
          },
          "source": "maplibre",
          "maxzoom": 24,
          "minzoom": 1,
          "source-layer": "geolines"
        },
        {
          "id": "countries-label",
          "type": "symbol",
          "paint": {
            "text-color": "rgba(8, 37, 77, 1)",
            "text-halo-blur": {
              "stops": [
                [
                  2,
                  0.2
                ],
                [
                  6,
                  0
                ]
              ]
            },
            "text-halo-color": "rgba(255, 255, 255, 1)",
            "text-halo-width": {
              "stops": [
                [
                  2,
                  1
                ],
                [
                  6,
                  1.6
                ]
              ]
            }
          },
          "filter": [
            "all"
          ],
          "layout": {
            "text-font": [
              "Open Sans Semibold"
            ],
            "text-size": {
              "stops": [
                [
                  2,
                  10
                ],
                [
                  4,
                  12
                ],
                [
                  6,
                  16
                ]
              ]
            },
            "text-field": {
              "stops": [
                [
                  2,
                  "{ABBREV}"
                ],
                [
                  4,
                  "{NAME}"
                ]
              ]
            },
            "visibility": "visible",
            "text-max-width": 10,
            "text-transform": {
              "stops": [
                [
                  0,
                  "uppercase"
                ],
                [
                  2,
                  "none"
                ]
              ]
            }
          },
          "source": "maplibre",
          "maxzoom": 24,
          "minzoom": 2,
          "source-layer": "centroids"
        },
        {
          "id": "zcta",
          "type": "line",
          "source": "zcta",
          "paint": {
            "line-blur": 1,
            "line-color": "rgba(255, 105, 180, 0.75)",
          },
          "source-layer": "zcta"
        },
      ],
    }

    const protocol = new pmtiles.Protocol()
    maplibregl.addProtocol('pmtiles', protocol.tile)

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: style,
      center: [lng, lat],
      zoom: zoom,
    });

  }, [lat, lng, map, mapContainer, zoom]);

  return (
    <div className="App">
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    </div>
  );
}

export default App;
