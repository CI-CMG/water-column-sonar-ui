import { useState, useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
// import { round } from "@turf/helpers";
// import Toast from "react-bootstrap/Toast";
// import ToastContainer from "react-bootstrap/ToastContainer";
// import Spinner from 'react-bootstrap/Spinner';
import GetZarrGeospatialIndex from "./GetZarrGeospatialIndex";
import {
  selectTimeIndex,
  updateTimeIndex,
} from ".././../reducers/store/storeSlice.ts";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import MapInformationPanel from "./MapInformationPanel.jsx";

const map_key = import.meta.env.VITE_MAPTILER_API;
const style = {
  version: 8,
  projection: {
    type: "globe",
  },
  name: "Water Column Project",
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    // satellite: {
    //   url: `https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=${map_key}`,
    //   type: "raster",
    //   maxZoom: 7,
    // },
    ocean: {
      url: `https://api.maptiler.com/maps/ocean/tiles.json?key=${map_key}`,
      type: "raster",
    },
    cruises: {
      url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-id.pmtiles",
      type: "vector",
    },
    // annotations: {
    //   url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-annotations.pmtiles",
    //   type: "vector",
    // },
  },
  layers: [
    {
      id: "Ocean",
      type: "raster",
      source: "ocean",
      // minZoom: 5,
      // maxZoom: 15,
    },
    // {
    //   id: "Satellite",
    //   type: "raster",
    //   source: "satellite",
    //   minZoom: 0,
    //   maxZoom: 5,
    // },
    {
      id: "cruises",
      type: "line",
      source: "cruises",
      paint: {
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "rgba(255, 255, 255, 0.95)", // white
          "rgba(155, 32, 238, 0.25)",
        ],
        "line-width": 2,
      },
      "source-layer": "cruises",
      // "minzoom": 5,
    },
    // {
    //   id: "AH_School",
    //   type: "circle",
    //   source: "annotations",
    //   paint: {
    //     "circle-blur": 0,
    //     "circle-color": "grey",
    //     // "circle-opacity": 0.4,
    //     "circle-radius": 4,
    //     "circle-stroke-color": "grey",
    //     // "circle-stroke-opacity": 0.9,
    //     // "circle-stroke-width": 2,
    //   },
    //   "source-layer": "AH_School",
    // },
    // {
    //   id: "Atlantic_Herring",
    //   type: "circle",
    //   source: "annotations",
    //   paint: {
    //     "circle-blur": 0,
    //     "circle-color": "white",
    //     "circle-opacity": 0.4,
    //     "circle-radius": 4,
    //     "circle-stroke-color": "white",
    //     "circle-stroke-opacity": 0.9,
    //     // "circle-stroke-width": 2,
    //   },
    //   "source-layer": "Atlantic_Herring",
    // },
    // {
    //   id: "Fish_School",
    //   type: "circle",
    //   source: "annotations",
    //   paint: {
    //     "circle-blur": 0,
    //     "circle-color": "yellow",
    //     "circle-opacity": 0.4,
    //     "circle-radius": 4,
    //     "circle-stroke-color": "yellow",
    //     "circle-stroke-opacity": 0.9,
    //     // "circle-stroke-width": 2,
    //   },
    //   "source-layer": "Fish_School",
    // },
    // // {
    // //   id: "Krill_Schools",
    // //   type: "circle",
    // //   source: "annotations",
    // //   paint: {
    // //     "circle-blur": 0,
    // //     "circle-color": "pink",
    // //     "circle-opacity": 0.4,
    // //     "circle-radius": 2,
    // //     "circle-stroke-color": "pink",
    // //     "circle-stroke-opacity": 0.9,
    // //     // "circle-stroke-width": 2,
    // //   },
    // //   "source-layer": "Krill_Schools",
    // // },
    // {
    //   id: "Possible_Herring",
    //   type: "circle",
    //   source: "annotations",
    //   paint: {
    //     "circle-blur": 0,
    //     "circle-color": "cyan",
    //     "circle-opacity": 0.4,
    //     "circle-radius": 4,
    //     "circle-stroke-color": "cyan",
    //     "circle-stroke-opacity": 0.9,
    //     // "circle-stroke-width": 2,
    //   },
    //   "source-layer": "Possible_Herring",
    // },
    // {
    //   id: "Unclassified_regions",
    //   type: "circle",
    //   source: "annotations",
    //   paint: {
    //     "circle-blur": 0,
    //     "circle-color": "red",
    //     "circle-opacity": 0.4,
    //     "circle-radius": 2,
    //     "circle-stroke-color": "red",
    //     "circle-stroke-opacity": 0.9,
    //     // "circle-stroke-width": 2,
    //   },
    //   "source-layer": "Unclassified_regions",
    // },
  ],
  sky: {
    "sky-color": "#5a19f3",
    "sky-horizon-blend": 0.75,
    "horizon-color": "purple",
    "horizon-fog-blend": 0.75,
    "fog-color": "#ff0000",
    "fog-ground-blend": 0.75,
    "atmosphere-blend": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      1,
      10,
      1,
      12,
      0,
    ],
  },
  light: {
    anchor: "viewport", // or 'map'
    color: "purple",
    intensity: 0.2,
    // 'position': [2.5, 90, 80],
  },
};


export default function MapView() {
  const dispatch = useAppDispatch();

  const mapContainerRef = useRef();
  const map = useRef();

  // const [mouseCoordinates, setMouseCoordinates] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedCruise, setSelectedCruise] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  // const [hoveredStateId, setHoveredStateId] = useState(null);

  const timeIndex = useAppSelector(selectTimeIndex);

  useEffect(() => {
    document.title = `echofish`;
  }, []);

  useEffect(() => {
    if (!map.current) {
      const protocol = new pmtiles.Protocol();

      maplibregl.addProtocol("pmtiles", protocol.tile);

      map.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: style,
        center: [20, -20],
        zoom: 3,
        minZoom: 2,
      });

      map.current.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true,
          visualizeRoll: true,
          showZoom: true,
          showCompass: true,
        }),
        "bottom-left"
      );

      map.current.flyTo({
        center: [-75, 35],
        essential: true,
        speed: 0.2,
        zoom: 3,
      });

      map.current.on("load", () => {
        // styling for the mouse cursor
        map.current.on("mouseenter", "cruises", () => {
          map.current.getCanvas().style.cursor = "crosshair";
        });
        map.current.on("mouseleave", "cruises", () => {
          map.current.getCanvas().style.cursor = "";
        });

        map.current.on("click", "cruises", (e) => {
          let popup = new maplibregl.Popup();

          const allFeatureIds = map.current
            .queryRenderedFeatures()
            .map((x) => x.id);
          allFeatureIds.forEach((id) => {
            // reset styling for all
            map.current.setFeatureState(
              { source: "cruises", sourceLayer: "cruises", id: id },
              { hover: false }
            );
          });
          popup.remove();

          const id = e.features[0]["id"];

          console.log(e.features[0]);
          const properties = e.features[0]["properties"];
          // properties: {id: 25, ship: 'Henry_B._Bigelow', cruise: 'HB1806', sensor: 'EK60'}
          GetZarrGeospatialIndex(
            properties["cruise"],
            e["lngLat"]["lng"],
            e["lngLat"]["lat"]
          );
          dispatch(updateTimeIndex(1024)); // TODO:

          // var message = document.createElement('h1');
          // message.innerHTML="Hello, World";
          const placeholder = document.createElement('div');
          placeholder.innerHTML = `Hello, World: ${timeIndex}`;

          popup
            .setLngLat(e.lngLat)
            // https://stackoverflow.com/questions/42101898/mapbox-gl-popup-setdomcontent-example
            .setDOMContent(placeholder)
            // .setHTML(
            //   `
            //   Ship: ${e.features[0].properties.ship}<br />
            //   Cruise: ${e.features[0].properties.cruise}<br />
            //   Sensor: ${e.features[0].properties.sensor}<br />
            //   → <a href="/water-column?ship=${e.features[0].properties.ship}&cruise=${e.features[0].properties.cruise}&sensor=${e.features[0].properties.sensor}&frequency=0&color=2&time=1024">view echogram</a>
            // `)
            .addTo(map.current);

          // setHoveredStateId(id); // TODO:

          map.current.setFeatureState(
            { source: "cruises", sourceLayer: "cruises", id: id },
            { hover: true }
          );
        });
      });
    }
  }, []);

  return (
    <>
      <div className="MapView">
        <div ref={mapContainerRef} className="Map" />

        <MapInformationPanel
          ship={selectedShip}
          cruise={selectedCruise}
          sensor={selectedSensor}
        />
      </div>
    </>
  );
}
