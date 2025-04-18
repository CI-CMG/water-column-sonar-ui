import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
import {
  selectLatitude,
  selectLongitude,
} from "../../reducers/cruise/cruiseSlice.ts";
import { useAppSelector } from "../../app/hooks";


const map_key = import.meta.env.DEV
  ? import.meta.env.VITE_SOME_MAPTILER_API_DEV
  : import.meta.env.VITE_SOME_MAPTILER_API_PROD;

const style = {
  version: 8,
  projection: {
    type: "globe", // TODO: just need flat map
  },
  name: "Mini Map Viewer",
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
};

export default function MiniMapView() {
  const latitude = useAppSelector(selectLatitude);
  const longitude = useAppSelector(selectLongitude);

  const miniMapContainer = useRef();
  const map = useRef();

  useEffect(() => {
    if (!map.current) {
      const protocol = new pmtiles.Protocol();

      maplibregl.addProtocol("pmtiles", protocol.tile);

      map.current = new maplibregl.Map({
        container: miniMapContainer.current,
        style: style,
        center: [
          -74.5 + (Math.random() - 0.5) * 10,
          40 + (Math.random() - 0.5) * 10
        ],
        zoom: 10,
        minZoom: 2,
      });

      map.current.flyTo({
        center: [longitude, latitude],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }, [map, latitude, longitude]);

  return (
    <div className="MiniMapView">
      <div ref={miniMapContainer} className="Map" />
    </div>
  );
}
