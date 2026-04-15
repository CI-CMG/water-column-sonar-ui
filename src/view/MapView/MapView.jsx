import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
import {
  geospatialIndexAsync,
  selectGeospatialIndexStatus,
  selectGeospatialIndex,
  //
  updateShip,
  updateCruise,
  updateSensor,
  //
  selectShip,
  selectCruise,
  selectSensor,
  //
  selectShipHovered,
  selectCruiseHovered,
  selectSensorHovered,
  //
  updateShipHovered,
  updateCruiseHovered,
  updateSensorHovered,
  // updateShowInfoPanel,
} from ".././../reducers/store/storeSlice.ts";
import { useAppDispatch } from "../../app/hooks";
// import MapInformationPanel from "./MapInformationPanel.jsx";
import { useAppSelector } from "../../app/hooks";
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";


const map_key = import.meta.env.VITE_MAPTILER_API;
// free map sources: https://codepen.io/g2g/pen/rNRJBZg

const style = {
  version: 8,
  projection: {
    type: [
      "interpolate",
      ["linear"],
      ["zoom"],
      10,
      "vertical-perspective",
      12,
      "mercator",
    ],
  },
  name: "Water Column Project",
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    ocean: {
      url: `https://api.maptiler.com/maps/ocean/tiles.json?key=${map_key}`,
      type: "raster",
    },
    // maplibre: {
    //   url: "https://demotiles.maplibre.org/tiles/tiles.json",
    //   type: "vector",
    // },
    // "maplibre-demotiles": {
    //     "type": "vector",
    //     "url": "https://demotiles.maplibre.org/tiles/tiles.json"
    // },
    // maplibre: {
    //   "type": "vector",
    //   "tiles": [
    //       "https://demotiles.maplibre.org/tiles/{z}/{x}/{y}.pbf"
    //   ]
    // },
    cruises: {
      url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/pmtiles/water-column-sonar-26.2.1.pmtiles",
      type: "vector",
    },
  },
  layers: [
    // {
    //     id: "maplibre",
    //     type: "vector",
    //     source: "maplibre",
    //     "source-layer": "cruises",
    // },
    {
      id: "Ocean",
      type: "raster",
      source: "ocean",
      "color": "rgba(255, 15, 63, 0.25)",
    },
    {
      id: "cruises",
      type: "line",
      source: "cruises",
      paint: {
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#ffffff",
          "rgba(155, 32, 238, 0.15)",
        ],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          3,
          2,
        ],
        "line-blur": 0,
      },
      "source-layer": "cruises",
    },
  ],
  sky: {
    "sky-color": "Silver",
    "sky-horizon-blend": 0.15,
    "horizon-color": "#3a2828",
    "horizon-fog-blend": 0.15,
    "fog-color": "SlateBlue",
    "fog-ground-blend": 0.15,
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
    intensity: 0.45,
  },
  state: {
    chargerType: { default: ["CCS", "CHAdeMO", "Type2"] },
    minPreferredChargingSpeed: { default: 50 },
  },
  terrain: { source: "raster-dem-source", exaggeration: 0.5 },
  transition: { duration: 200, delay: 0 },
};

export default function MapView() {
  useEffect(() => {
    document.title = `EchoFish`;
  }, []);

  const [showToast, setShowToast] = useState(false);
  const toggleShowToast = () => setShowToast(!showToast);
  const dispatch = useAppDispatch();

  const geospatialIndex = useAppSelector(selectGeospatialIndex);
  const geospatialIndexStatus = useAppSelector(selectGeospatialIndexStatus);

  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);

  const shipHovered = useAppSelector(selectShipHovered);
  const cruiseHovered = useAppSelector(selectCruiseHovered);
  const sensorHovered = useAppSelector(selectSensorHovered);

  const mapContainerRef = useRef();
  const map = useRef();

  useEffect(() => {
    if (!map.current) {
      const protocol = new pmtiles.Protocol();

      maplibregl.addProtocol("pmtiles", protocol.tile);

      map.current = new maplibregl.Map({
        container: mapContainerRef.current,
        style: style,
        // style: "https://demotiles.maplibre.org/style.json",
        // style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
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
        "bottom-left",
      );

      map.current.flyTo({
        center: [-75, 35],
        essential: true,
        speed: 0.7, // 0.2
        zoom: 3,
      });

      map.current.on("load", () => {
        // map.current.setProjection({ type: 'globe' });
        // const layers = map.current.getStyle().layers;
        // let firstSymbolId;
        // for (let i = 0; i < layers.length; i++) {
        //     if (layers[i].type === 'symbol') {
        //         firstSymbolId = layers[i].id;
        //         break;
        //     }
        // }
        // map.current.addSource('cruises', {
        //     type: "vector",
        //     url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/pmtiles/water-column-sonar-26.2.1.pmtiles",
        // });
        // map.current.addLayer(
        //     {
        //         id: 'cruises',
        //         type: 'line',
        //         source: 'cruises',
        //         "source-layer": "cruises",
        //         paint: {
        //           "line-color": [
        //             "case",
        //             ["boolean", ["feature-state", "hover"], false],
        //             "#ffffff",
        //             "rgba(155, 32, 238, 0.15)",
        //           ],
        //           "line-width": [
        //             "case",
        //             ["boolean", ["feature-state", "hover"], false],
        //             3,
        //             2,
        //           ],
        //           "line-blur": 0,
        //         },
        //     },
        //     firstSymbolId
        // );

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
          // let popup = new maplibregl.Popup();

          const allFeatureIds = map.current
            .queryRenderedFeatures()
            .map((x) => x.id);

          allFeatureIds.forEach((id) => {
            map.current.setFeatureState(
              // reset styling for all
              { source: "cruises", sourceLayer: "cruises", id: id },
              { hover: false },
            );
          });

          // popup.remove();
          // handleShow();
          const id = e.features[0]["id"];
          const properties = e.features[0]["properties"];
          // properties: {id: 25, ship: 'Henry_B._Bigelow', cruise: 'HB1806', sensor: 'EK60'}

          dispatch(updateShip(properties["ship"]));
          dispatch(updateCruise(properties["cruise"]));
          dispatch(updateSensor(properties["sensor"]));

          dispatch(
            geospatialIndexAsync({
              ship: properties["ship"],
              cruise: properties["cruise"],
              sensor: properties["sensor"],
              longitude: e["lngLat"]["lng"],
              latitude: e["lngLat"]["lat"],
            }),
          );

          // dispatch(updateTimeIndex(1024)); // TODO: on load for wcv get from store

          // popup
          //   .setLngLat(e.lngLat)
          //   .setHTML(
          //     `
          //     Ship: ${e.features[0].properties.ship}<br />
          //     Cruise: ${e.features[0].properties.cruise}<br />
          //     Sensor: ${e.features[0].properties.sensor}
          //   `,
          //   )
          //   .addTo(map.current);

          setShowToast(true);

          map.current.setFeatureState(
            { source: "cruises", sourceLayer: "cruises", id: id },
            { hover: true },
          );
        });
      });
    }
  }, []);

  return (
    <>
      <div className="MapView">
        <div
          ref={mapContainerRef}
          className="Map"
          style={{ minHeight: "100%", minWidth: "100%" }}
        />

        {/* The toast shows up in upper left corner when linestring is clicked */}
        <div className="clikedPoint">
          <Toast
            onClose={() => toggleShowToast()}
            show={showToast}
            // delay={120_000}
            // autohide
          >
            <Toast.Header>
              <strong className="me-auto">Clicked Cruise</strong>
            </Toast.Header>
            <Toast.Body>
              Ship: <span className="font-monospace float-end">{ship}</span>
              <br />
              Cruise: <span className="font-monospace float-end">{cruise}</span>
              <br />
              Instrument:{" "}
              <span className="font-monospace float-end">{sensor}</span>
              <br />
              <br />
              {geospatialIndexStatus === "idle" ? (
                <Link
                  to={`/water-column?ship=${ship}&cruise=${cruise}&sensor=${sensor}&frequency=0&color=2&time=${geospatialIndex}`}
                >
                  <Button variant="primary" size="sm">View {cruise} Echogram →</Button>
                </Link>
              ) : (
                <center>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </center>
              )}
            </Toast.Body>
          </Toast>
        </div>

        <div className="coordinateDisplay">
          {cruiseHovered ? (
            <p>
              Ship: {shipHovered} <font color="#00CC33">/</font>{' '}
              Cruise: {cruiseHovered} <font color="#00CC33">/</font>{' '}
              Instrument: {sensorHovered}
            </p>
          ) : (
            <p>Zoom In and Click on a Cruise</p>
          )}
          
        </div>
      </div>
    </>
  );
}
