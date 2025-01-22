import { useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles';
import { round } from '@turf/helpers';
import GetZarrGeospatialIndex from './GetZarrGeospatialIndex';


// https://maplibre.org/maplibre-style-spec/layers/
// const foo = () => console.log('asdf');

export default function MapView() {
  const mapContainer = useRef();
  const map = useRef();
  // TODO: show this on the map viewer in bottom right corner
  const [mouseCoordinates, setMouseCoordinates] = useState(null);
  // Starting point for centering the map?
  // const [info, setInfo] = useState('');
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedCruise, setSelectedCruise] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredStateId, setHoveredStateId] = useState(null);

  useEffect(() => {
    document.title = `Map`;
    console.log(`👆 App Name: ${import.meta.env.VITE_REACT_APP_NAME}, App Version: ${import.meta.env.VITE_REACT_APP_VERSION}`)
  }, []);

  useEffect(() => {
    // if (map.current) return;
    const style = {
      version: 8,
      projection: {
          type: 'globe'
      },
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
            "line-width": 2,
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
      center: [-95, 35],
      zoom: 2,
      minZoom: 2,
      // on: {type: 'click', layer: 'cruises', listener: foo},
    });
  
    // styling for the mouse cursor
    map.current.on("mouseenter", "cruises", () => {
      map.current.getCanvas().style.cursor = "crosshair";
    });
    // styling for the mouse cursor
    map.current.on("mouseleave", "cruises", () => {
      map.current.getCanvas().style.cursor = "default";
    });
    
    // hovered cruise info
    map.current.on('mousemove', (e) => {
      // setMouseCoordinates(JSON.stringify(e.lngLat.wrap()));
      setMouseCoordinates(e.lngLat);

      const features = map.current.queryRenderedFeatures(e.point);
      const displayProperties = [
          'type',
          'properties',
      ];

      features.map((feat) => {
        const displayFeat = {};
        displayProperties.forEach((prop) => { // TODO: explore this further
          displayFeat[prop] = feat[prop];
        });
        if('ship' in displayFeat.properties){
          // setInfo(`ship: ${displayFeat.properties['ship']}, cruise: ${displayFeat.properties['cruise']}, sensor: ${displayFeat.properties['sensor']}`);
          setSelectedShip(displayFeat.properties['ship'])
          setSelectedCruise(displayFeat.properties['cruise'])
          setSelectedSensor(displayFeat.properties['sensor'])
        }
      });  
    });
  }, []);

  useEffect(() => {
    // display cruise card info on click
    map.current.on('click', 'cruises', (e) => {
      GetZarrGeospatialIndex(e.features[0].properties.cruise, e.lngLat['lng'], e.lngLat['lat'])
        .then((clickedIndex) => {
          console.log(clickedIndex);
          setSelectedIndex(clickedIndex);
        })

      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`Cruise name: ${e.features[0].properties.cruise}`)
        .addTo(map.current);
    });

  }, [])

  useEffect(() => {
    // selected cruise info
    map.current.on('click', 'cruises', (e) => {
      // TODO: after first click the mouse interaction slows down a lot!
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
      // TODO: do click handler here for selected feature, jump to new page

    });
    map.current.on('mouseleave', 'cruises', () => {
      setHoveredStateId(null);
      map.current.setFeatureState(
          {source: 'cruises', sourceLayer: 'cruises', id: hoveredStateId},
          {hover: false}
      );
    });
  }, [hoveredStateId])

  return (
    <div className="MapView">
      <h1>Map</h1>

      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>

      <div>
        { selectedCruise &&
          <div id="cruiseDisplay">
            Ship: {selectedShip}, 
            Cruise: {selectedCruise}, 
            Sensor: {selectedSensor}
          </div>
        }
        { mouseCoordinates && 
          <div id="coordinateDisplay">
            {round(mouseCoordinates.lat, 5)}° N, {round(mouseCoordinates.lng, 5)}° E
          </div>
        }

        { selectedIndex && 
          <div id="indexDisplay">
            {selectedIndex}
          </div>
        }
      </div>
    </div>
  );
}
