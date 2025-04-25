import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
import { circle } from "@turf/circle";
import {
  selectLatitude,
  selectLongitude,
} from "../../reducers/store/storeSlice.ts";
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
        center: [ // just picking random places for now
          -74.5 + (Math.random() - 0.5) * 10,
          40 + (Math.random() - 0.5) * 10
        ],
        zoom: 10,
        minZoom: 2,
      });

      map.current.on('load', () => {
        // Generate a polygon using turf.circle
        // See https://turfjs.org/docs/#circle
        const radius = 1; // kilometer
        const options = {
            steps: 10,
            units: 'kilometers'
        };
        const radiusCenter = [longitude, latitude];
        const shape = circle(radiusCenter, radius, options);

        // Add the circle as a GeoJSON source
        map.current.addSource('location-radius', {
            type: 'geojson',
            data: shape
        });

        // Add a fill layer with some transparency
        map.current.addLayer({
            id: 'location-radius',
            type: 'fill',
            source: 'location-radius',
            paint: {
                'fill-color': '#8CCFFF',
                'fill-opacity': 0.1
            }
        });

        // Add a line layer to draw the circle outline
        map.current.addLayer({
            id: 'location-radius-outline',
            type: 'line',
            source: 'location-radius',
            paint: {
                'line-color': '#0094ff',
                'line-width': 3
            }
        });
      });

      map.current.flyTo({
        center: [longitude, latitude],
        essential: true,
        speed: 0.4,
      });
    }
  }, [map, latitude, longitude]);

  return (
    <div className="MiniMapView">
      <div ref={miniMapContainer} className="Map" />
    </div>
  );
}
