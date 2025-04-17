import { useState, useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";

import { round } from "@turf/helpers";
import GetZarrGeospatialIndex from "./GetZarrGeospatialIndex";

const map_key = import.meta.env.DEV
  ? import.meta.env.VITE_SOME_MAPTILER_API_DEV
  : import.meta.env.VITE_SOME_MAPTILER_API_PROD;

const style = {
  version: 8,
  projection: {
    type: "globe",
  },
  name: "Water Column Project",
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    satellite: {
      url: `https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=${map_key}`,
      type: "raster",
    },
    cruises: {
      url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-id.pmtiles",
      type: "vector",
    },
  },
  layers: [
    {
      id: "Satellite",
      type: "raster",
      source: "satellite",
    },
    {
      id: "cruises",
      type: "line",
      source: "cruises",
      paint: {
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "rgba(255, 255, 255, 0.95)", // white
          "rgba(255, 105, 180, 0.25)", // pink
        ],
        "line-width": 2,
      },
      "source-layer": "cruises",
    },
  ],
  // TODO: add atmosphere
};

// function createPopupContent() {
//   // const asdf = "asdf123"
//   return <Link to="/about">About</Link>;
// }

export default function MapView() {
  const mapContainer = useRef();
  const map = useRef();
  const [mouseCoordinates, setMouseCoordinates] = useState(null);
  const [selectedShip, setSelectedShip] = useState(null);
  const [selectedCruise, setSelectedCruise] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [hoveredStateId, setHoveredStateId] = useState(null);

  useEffect(() => {
    document.title = `Map`;
    console.log(
      `★ ${import.meta.env.VITE_REACT_APP_NAME} — v${
        import.meta.env.VITE_REACT_APP_VERSION
      } — ${import.meta.env.DEV} ★`
    );
  }, []);

  useEffect(() => {
    if (!map.current) {
      const protocol = new pmtiles.Protocol();

      maplibregl.addProtocol("pmtiles", protocol.tile);

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: style,
        center: [-95, 35],
        zoom: 1,
        minZoom: 2,
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
      map.current.on("mousemove", (e) => {
        // setMouseCoordinates(JSON.stringify(e.lngLat.wrap()));
        setMouseCoordinates(e.lngLat);

        const features = map.current.queryRenderedFeatures(e.point);
        const displayProperties = ["type", "properties"];

        features.map((feat) => {
          const displayFeat = {};
          displayProperties.forEach((prop) => {
            // TODO: explore this further
            displayFeat[prop] = feat[prop];
          });
          if ("ship" in displayFeat.properties) {
            // setInfo(`ship: ${displayFeat.properties['ship']}, cruise: ${displayFeat.properties['cruise']}, sensor: ${displayFeat.properties['sensor']}`);
            setSelectedShip(displayFeat.properties["ship"]);
            setSelectedCruise(displayFeat.properties["cruise"]);
            setSelectedSensor(displayFeat.properties["sensor"]);
          }
        });
      });
    }
  }, [map]);

  useEffect(() => {
    // display cruise card info on click
    map.current.on("click", "cruises", (e) => {
      GetZarrGeospatialIndex(
        e.features[0].properties.cruise,
        e.lngLat["lng"],
        e.lngLat["lat"]
      ).then((clickedIndex) => {
        console.log(clickedIndex);
        // setSelectedIndex(clickedIndex);
      });

      // const placeholder = createPopupContent();
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `
          Ship: ${e.features[0].properties.ship}<br />
          Cruise: ${e.features[0].properties.cruise}<br />
          Sensor: ${e.features[0].properties.sensor}<br />
          → <a href="/water-column?ship=${e.features[0].properties.ship}&cruise=${e.features[0].properties.cruise}&sensor=${e.features[0].properties.sensor}&frequency=0&color=0">view echogram</a>
          `
        )
        // .setDOMContent(placeholder)
        // .setHTML(placeholder)
        .addTo(map.current);

      // const placeholder = <Link to="/about">About</Link>;
      // const placeholder = <Link to="/about">About</Link>;
      // const domNode = document.getElementById('PopupContent');
      // const root = createRoot(domNode);
      // root.render(placeholder);
    });
  }, []);

  useEffect(() => {
    // selected cruise info
    map.current.on("click", "cruises", (e) => {
      // TODO: after first click the mouse interaction slows down a lot!

      setHoveredStateId(null);
      map.current.setFeatureState(
        { source: "cruises", sourceLayer: "cruises", id: hoveredStateId },
        { hover: false }
      );

      const features = e.features;
      const idd = features[0]["id"];

      setHoveredStateId(idd);
      map.current.setFeatureState(
        { source: "cruises", sourceLayer: "cruises", id: idd },
        { hover: true }
      );
      // TODO: do click handler here for selected feature, jump to new page
    });

    map.current.on("mouseleave", "cruises", () => {
      setHoveredStateId(null);
      map.current.setFeatureState(
        { source: "cruises", sourceLayer: "cruises", id: hoveredStateId },
        { hover: false }
      );
    });
  }, [hoveredStateId]);

  return (
    <div className="MapView">
      <div ref={mapContainer} className="Map" />

      <div>
        {selectedCruise && (
          <div className="bottom-left">
            <p className="cruise-display">
              Ship: {selectedShip} | Cruise: {selectedCruise} | Sensor:{" "}
              {selectedSensor}
            </p>
          </div>
        )}

        {mouseCoordinates && (
          <div className="bottom-right">
            <p className="coordinate-display">
              {round(mouseCoordinates.lat, 5)}° N,{" "}
              {round(mouseCoordinates.lng, 5)}° E
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
