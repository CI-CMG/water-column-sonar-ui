import {
  useRef,
  useEffect,
  useState,
} from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
import {
  selectLatitude,
  selectLongitude,
} from "../../reducers/store/storeSlice.ts";
import { useAppSelector } from "../../app/hooks";


const map_key = import.meta.env.VITE_MAPTILER_API;

// TODO: this should be composed from other style of main map viewer
const style = {
  version: 8,
  projection: {
    type: "globe",
  },
  name: "Mini Map Viewer",
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    ocean: {
      url: `https://api.maptiler.com/maps/ocean/tiles.json?key=${map_key}`,
      type: "raster",
    },
    cruises: {
      url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/pmtiles/water-column-sonar-26.2.1.pmtiles",
      type: "vector",
    },
  },
  layers: [
    {
      id: "Ocean",
      type: "raster",
      source: "ocean",
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
          "rgba(155, 32, 238, 0.25)",
        ],
        "line-width": 2,
      },
      "source-layer": "cruises",
    },
  ],
};

export default function MiniMapView() {
  const [loadedMap, setLoadedMap] = useState(false);

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
        center: [0, 0],
        zoom: 1,
        minZoom: 0,
      });

      // move all this somewhere else
      map.current.on('load', () => {
        let geojson = {
          'type': 'FeatureCollection',
          'features': [
              {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'Point',
                      'coordinates': [longitude, latitude]
                  }
              }
          ]
        };
        map.current.addSource('point', {
          'type': 'geojson',
          'data': geojson
        });
        map.current.addLayer({
          'id': 'point',
          'type': 'circle',
          'source': 'point',
          'paint': {
            'circle-radius': 5,
            'circle-color': '#34a2eb'
          }
        });

        setLoadedMap(true);
      });

      map.current.flyTo({
        center: [longitude, latitude],
        essential: true,
        speed: 0.7,
        zoom: 12,
      });
    }
  }, [map, latitude, longitude]);

  useEffect(() => {
    if(loadedMap) {
      let geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [longitude, latitude]
                }
            }
        ]
      };
      map.current.getSource('point').setData(geojson);
      map.current.flyTo({
        center: geojson.features[0].geometry.coordinates, // [longitude, latitude],
        essential: true,
        speed: 0.75,
        zoom: 12,
      });
    }
  },[map, latitude, longitude, loadedMap]);

  return (
    <div className="MiniMapView">
      <div ref={miniMapContainer} className="Map" />
    </div>
  );
}
