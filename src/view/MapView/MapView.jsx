import {
  // useState,
  useRef,
  useEffect,
} from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
// import { round } from "@turf/helpers";
// import Toast from "react-bootstrap/Toast";
// import ToastContainer from "react-bootstrap/ToastContainer";
// import Spinner from 'react-bootstrap/Spinner';
// import GetZarrGeospatialIndex from "./GetZarrGeospatialIndex";
import {
  // selectTimeIndex,
  // updateTimeIndex,
  //
  geospatialIndexAsync,
  //
  updateShip,
  updateCruise,
  updateSensor,
  //
  updateShipHovered,
  updateCruiseHovered,
  updateSensorHovered,
  // selectShowInfoPanel,
  updateShowInfoPanel,
} from ".././../reducers/store/storeSlice.ts";
import {
  useAppDispatch,
  // useAppSelector,
} from "../../app/hooks";
import MapInformationPanel from "./MapInformationPanel.jsx";

const map_key = import.meta.env.VITE_MAPTILER_API;
const style = {
  "version": 8,
  // "projection": {
  //   type: "globe",
  // },
  "projection": {
    "type": [
        "interpolate",
        ["linear"],
        ["zoom"],
        10,
        "vertical-perspective",
        12,
        "mercator"
    ]
  },
  "name": "Water Column Project",
  "glyphs": "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  "sources": {
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
      url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/pmtiles/water-column-sonar-26.2.1.pmtiles",
      type: "vector",
    },
    // annotations: {
    //   url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-annotations.pmtiles",
    //   type: "vector",
    // },
  },
  "layers": [
    {
      id: "Ocean",
      type: "raster",
      source: "ocean",
      // minZoom: 5,
      // maxZoom: 15,
      "color": "rgba(255, 15, 63, 0.25)",
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
        // options here: https://maplibre.org/maplibre-style-spec/layers/#line
        // "line-cap": "round",
        // "line-join": "bevel",
        // "fill-sort-key": 2,
        // "visibility": true,
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          // "rgba(255, 255, 255, 0.95)", // white
          "#ffffff",
          "rgba(155, 32, 238, 0.15)",
        ],
        // "fill-color": "rgba(32, 238, 121, 0.25)",
        // "line-width": 1.25,
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          3,
          1,
        ],
        // "line-gap-width": 1,
        "line-blur": 0,
      },
      "source-layer": "cruises",
      // "minzoom": 5,
    },
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
  ],
  "sky": {
    "sky-color": "#199EF3",
    "sky-horizon-blend": 0.75,
    "horizon-color": "#ffffff",
    "horizon-fog-blend": 0.75,
    "fog-color": "#0000ff",
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
        0
    ]
  },
  "light": {
    anchor: "viewport", // or 'map'
    color: "purple",
    intensity: 0.45,
    // 'position': [2.5, 90, 80],
  },
  "state": {
    "chargerType": {"default": ["CCS", "CHAdeMO", "Type2"]},
    "minPreferredChargingSpeed": {"default": 50}
  },
  "terrain": { "source": "raster-dem-source", "exaggeration": 0.5 },
  "transition": { "duration": 200, "delay": 0 },
};


export default function MapView() {
  const dispatch = useAppDispatch();
  // const showInfoPanel = useAppSelector(selectShowInfoPanel);
  const handleShow = () => dispatch(updateShowInfoPanel(true));

  const mapContainerRef = useRef();
  const map = useRef();

  // const [mouseCoordinates, setMouseCoordinates] = useState(null);
  // const [selectedShip, setSelectedShip] = useState(null);
  // const [selectedCruise, setSelectedCruise] = useState(null);
  // const [selectedSensor, setSelectedSensor] = useState(null);
  // const [hoveredStateId, setHoveredStateId] = useState(null);

  // const timeIndex = useAppSelector(selectTimeIndex);

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
        speed: 0.7, // 0.2
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

        map.current.on("mousemove", (e) => {
          // setMouseCoordinates(JSON.stringify(e.lngLat.wrap()));
          // setMouseCoordinates(e.lngLat);
          const features = map.current.queryRenderedFeatures(e.point);
          const displayProperties = ["type", "properties"];

          features.map((feat) => {
            const displayFeat = {};
            displayProperties.forEach((prop) => {
              // TODO: explore this further
              displayFeat[prop] = feat[prop];
            });

            if ("ship" in displayFeat.properties) {
              dispatch(updateShipHovered(displayFeat.properties["ship"]));
              dispatch(updateCruiseHovered(displayFeat.properties["cruise"]));
              dispatch(updateSensorHovered(displayFeat.properties["sensor"]));
            }
          });
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
          handleShow();
          const id = e.features[0]["id"];
          const properties = e.features[0]["properties"];
          // properties: {id: 25, ship: 'Henry_B._Bigelow', cruise: 'HB1806', sensor: 'EK60'}
          
          dispatch(updateShip(properties["ship"]));
          dispatch(updateCruise(properties["cruise"]));
          dispatch(updateSensor(properties["sensor"]));
          
          dispatch(geospatialIndexAsync({
            ship: properties["ship"],
            cruise: properties["cruise"],
            sensor: properties["sensor"],
            longitude: e["lngLat"]["lng"],
            latitude: e["lngLat"]["lat"],
          }));
          console.log('right after dispatch');

          // dispatch(updateTimeIndex(1024)); // TODO: on load for wcv get from store

          popup
            .setLngLat(e.lngLat)
            .setHTML(
              `
              Ship: ${e.features[0].properties.ship}<br />
              Cruise: ${e.features[0].properties.cruise}<br />
              Sensor: ${e.features[0].properties.sensor}
            `)
            .addTo(map.current);

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
          // ship={selectedShip}
          // cruise={selectedCruise}
          // sensor={selectedSensor}
        />
      </div>
    </>
  );
}
