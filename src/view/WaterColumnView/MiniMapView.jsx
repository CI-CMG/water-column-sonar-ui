import {
  useRef,
  useEffect,
  useState,
} from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as pmtiles from "pmtiles";
// import { circle } from "@turf/circle";
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
    // satellite: {
    //   url: `https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=${map_key}`,
    //   type: "raster",
    // },
    ocean: {
      url: `https://api.maptiler.com/maps/ocean/tiles.json?key=${map_key}`,
      type: "raster",
    },
    cruises: {
      url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-id.pmtiles",
      type: "vector",
    },
  },
  layers: [
    // {
    //   id: "Satellite",
    //   type: "raster",
    //   source: "satellite",
    // },
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
          "rgba(255, 105, 180, 0.25)", // pink
        ],
        "line-width": 2,
      },
      "source-layer": "cruises",
    },
  ],
};

export default function MiniMapView() {
  // const zoomFeature = 10;
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
