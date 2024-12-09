import { useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles';
// import * as turf from '@turf/turf';
import { slice, openArray } from "zarr";



// function zarrOpenLatitudeArray() {
//   return openArray({ store: this.zarr_store_url, path: "latitude", mode: "r" });
// }
// zarrOpenLatitudeArray = { openArray({ store: zarr_store_url, path: "latitude", mode: "r" }) }


export default function MapView() {
  const mapContainer = useRef();
  const map = useRef();
  const [lng] = useState(-95);
  const [lat] = useState(35);
  const [zoom] = useState(2);
  const [foo, setFoo] = useState('');
  const [hoveredStateId, setHoveredStateId] = useState(null);
  // for getting clicked location
  const [latitudeArray, setLatitudeArray] = useState(null);
  const [latitudeArrayData, setLatitudeArrayData] = useState(null);
  const [longitudeArray, setLongitudeArray] = useState(null);
  const [longitudeArrayData, setLongitudeArrayData] = useState(null);
  const [timeArray, setTimeArray] = useState(null);
  const [timeArrayData, setTimeArrayData] = useState(null);
  const [zarrStoreURL, setZarrStoreURL] = useState(null);
  
  // const [cursor, setCursor] = useState('auto');
  // const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  // const onMouseLeave = useCallback(() => setCursor('auto'), []);
  const zarrOpenLatitudeArray = () => {
     return openArray({ store: zarrStoreURL, path: "latitude", mode: "r" });
  }
  function zarrOpenLongitudeArray() {
    return openArray({ store: zarrStoreURL, path: "longitude", mode: "r" });
  }
  function zarrOpenTimeArray() {
    return openArray({ store: zarrStoreURL, path: "time", mode: "r" });
  }
  function zarrOpenArrayData(z) {
    return z.get([slice(null)]);
  }
  // function clickedMarkerPolyline(latlng) {
  //   // console.log(latlng)
  //   console.log("clicked polyline at: lat: " + latlng.lat + ", lng: " + latlng.lng)
  
  //   let pt = turf.point([latlng.lng, latlng.lat])
  //   let snapped = turf.nearestPointOnLine(
  //       this.turf_linestring, // longitude, latitude
  //       pt,
  //       { units: 'miles' }
  //   )
  //   console.log('closest polyline index: ' + snapped.properties.index)
  
  //   /////// now do it with the full linestring  /////
  //   let aa = Array.from(latitudeArrayData);
  //   let bb = Array.from(longitudeArrayData);
  //   let cc = aa.map(function(e, i) {
  //     return [bb[i], e];
  //   });
  //   let turf_linestring = turf.lineString(cc)
  //   // why do i do this twice
  //   let snapped2 = turf.nearestPointOnLine(
  //       turf_linestring, // longitude, latitude
  //       pt,
  //       { units: 'miles' }
  //   )
  //   const clicked_index = snapped2.properties.index
  //   console.log(clicked_index)
  //   // const clicked_time = Array.from(timeArrayData)[snapped2.properties.index]
  //   // const clicked_latitude = Array.from(latitudeArrayData)[snapped2.properties.index]
  //   // const clicked_longitude = Array.from(longitudeArrayData)[snapped2.properties.index]
  //   // const tz = find(clicked_latitude, clicked_longitude)
  //   // const local_time = this.getDateTime(clicked_time, tz)
  //   // this.click_time = local_time._i + ' ' + local_time._z.name.toUpperCase()
  //   // console.log('closest polyline index full res: ' + snapped2.properties.index)
  // }


  useEffect(() => {
    document.title = `Map`;

    zarrOpenLatitudeArray().then((z) => {
      setLatitudeArray(z);
      zarrOpenArrayData(z).then((d) => {
        setLatitudeArrayData(d.data);
      })
    })
    zarrOpenLongitudeArray().then((z) => {
      setLongitudeArray(z);
      zarrOpenArrayData(z).then((d) => {
        setLongitudeArrayData(d.data);
      })
    })
    zarrOpenTimeArray().then((z) => {
      setTimeArray(z);
      zarrOpenArrayData(z).then((d) => {
        setTimeArrayData(d.data);
      })
    })
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
            // 'The official "Brat" color code is #8ACE00'
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
            "line-blur": 1,
            // "line-color": "rgba(255, 105, 180, 0.75)",
            "line-color": [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              // "rgba(138, 206, 0, 1.0)", // brat green
              //"rgba(0, 0, 255, 0.99)", // blue
              // "rgba(255, 105, 180, 0.90)", // pink
              "rgba(255, 255, 255, 0.90)", // white
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
          setFoo(`ship: ${displayFeat.properties['ship']}, cruise: ${displayFeat.properties['cruise']}, sensor: ${displayFeat.properties['sensor']}`);
        }
      });  
    });

  }, [lat, lng, map, mapContainer, zoom, foo]);

  useEffect(() => {
    // needs: https://maplibre.org/maplibre-gl-js/docs/examples/hover-styles/
    // https://maplibre.org/maplibre-gl-js/docs/API/classes/MapMouseEvent/
    // "click" | "contextmenu" | "dblclick" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup"
    // map.current.on('mousemove', 'cruises', (e) => {
    map.current.on('click', 'cruises', (e) => {
      //// eslint-disable-next-line no-debugger
      // debugger;
      const features = e.features
      // clickedMarkerPolyline(e.latlng) // {lng: -70.90144341724965, lat: 40.13360070192209}
      // const ship = features[0]['properties']['ship']
      // const cruise = features[0]['properties']['cruise']
      // const sensor = features[0]['properties']['sensor']
      //zarr_store_url: "https://rudy-testing-level-2-data.s3.us-west-2.amazonaws.com/level_2/Henry_B._Bigelow/HB0707/EK60/HB0707.zarr",
      setZarrStoreURL(`https://noaa-wcsd-zarr-pds.s3.us-east-1.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr`)
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
      <p>feature: <b>{foo}</b>, hover: {hoveredStateId}</p>
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    </div>
  );
}
