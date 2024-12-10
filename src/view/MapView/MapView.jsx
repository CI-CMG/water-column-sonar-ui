import { useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles';


export default function MapView() {
  const mapContainer = useRef();
  const map = useRef();
  // TODO: show this on the map viewer in bottom right corner
  const [mouseCoordinates, setMouseCoordinates] = useState(null);
  // Starting point for centering the map?
  const [lng] = useState(-95);
  const [lat] = useState(35);
  const [zoom] = useState(2);
  const [info, setInfo] = useState('');
  const [hoveredStateId, setHoveredStateId] = useState(null);

  useEffect(() => {
    document.title = `Map`;
  }, []);

  // https://maplibre.org/maplibre-style-spec/layers/
  useEffect(() => {
    if (map.current) return;
    
    console.log('initializeing map viewer')

    const style = {
      version: 8,
      name: "Water Column Project",
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      // consider switching to: https://protomaps.com/
      sources: {
        maplibre: {
          type: "vector",
          url: "https://demotiles.maplibre.org/tiles/tiles.json"
        },
        cruises: {
          type: "vector",
          // url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar.pmtiles",
          url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-id.pmtiles"
        },
      },
      layers: [
        {
          "id": "background",
          "type": "background",
          "paint": {
            "background-color": "#041d29"
            // "background-color": "#8ACE00"
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
            "text-halo-blur": 0.5,
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
                  0.5,
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
          "maxzoom": 22,
          "minzoom": 2,
          "source-layer": "centroids"
        },
        {
          "id": "cruises",
          "type": "line",
          "source": "cruises",
          "paint": {
            // "line-blur": 0.1,
            // "line-color": "rgba(255, 105, 180, 0.75)",
            "line-color": [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              // "rgba(138, 206, 0, 1.0)", // brat green
              //"rgba(0, 0, 255, 0.99)", // blue
              // "rgba(255, 105, 180, 0.90)", // pink
              "rgba(255, 255, 255, 0.95)", // white
              "rgba(255, 105, 180, 0.25)", // pink
              
            ],
            "line-width": 3,
            // "line-width": [
            //   'case',
            //   ['boolean', ['feature-state', 'hover'], false],
            //   2,
            //   1
            // ],
          },
          "source-layer": "cruises"
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

    map.current.on('mousemove', (e) => {
      setMouseCoordinates(JSON.stringify(e.lngLat.wrap()))

      const features = map.current.queryRenderedFeatures(e.point);

      const displayProperties = [
          'type',
          'properties',
      ];

      features.map((feat) => {
        const displayFeat = {};
        displayProperties.forEach((prop) => {
          displayFeat[prop] = feat[prop];
        });
        if('ship' in displayFeat.properties){
          setInfo(`ship: ${displayFeat.properties['ship']}, cruise: ${displayFeat.properties['cruise']}, sensor: ${displayFeat.properties['sensor']}`);
        }
      });  
    });

  }, [lat, lng, map, mapContainer, zoom, info]);

  useEffect(() => {
    // needs: https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/
    // https://maplibre.org/maplibre-gl-js/docs/API/classes/MapMouseEvent/
    // "click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup"
    map.current.on('click', 'cruises', (e) => {
      setHoveredStateId(null);
      map.current.setFeatureState(
          {source: 'cruises', sourceLayer: 'cruises', id: hoveredStateId},
          {hover: false}
      );
      const features = e.features
      const idd = features[0]['id']
      setHoveredStateId(idd)
      map.current.setFeatureState(
          {source: 'cruises', sourceLayer: 'cruises', id: idd},
          {hover: true}
      );
    });

    map.current.on('mouseleave', 'cruises', () => {
      setHoveredStateId(null);
      map.current.setFeatureState(
          {source: 'cruises', sourceLayer: 'cruises', id: hoveredStateId},
          {hover: false}
      );
    });

    map.current.on("mouseenter", "cruises", () => {
      map.current.getCanvas().style.cursor = "crosshair";
    });

    map.current.on("mouseleave", "cruises", () => {
      map.current.getCanvas().style.cursor = "default";
    });
  }, [hoveredStateId])

  return (
    <div className="MapView">
      <h1>Map</h1>
      <p>feature: <b>{info}</b>, hover: {hoveredStateId}, mouse: {mouseCoordinates}</p>
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    </div>
  );
}
