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


const map_key = import.meta.env.VITE_MAPTILER_API;

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
    annotations: {
      url: "pmtiles://https://noaa-wcsd-pds-index.s3.amazonaws.com/water-column-sonar-annotations.pmtiles",
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
          "rgba(155, 32, 238, 0.25)",
        ],
        "line-width": 2,
      },
      "source-layer": "cruises",
    },
    {
      id: "AH_School",
      type: "circle",
      source: "annotations",
      paint: {
        "circle-blur": 0,
        "circle-color": "grey",
        "circle-opacity": 0.75,
        "circle-radius": 4,
        "circle-stroke-color": "grey",
        "circle-stroke-opacity": 0.9,
        // "circle-stroke-width": 2,
      },
      "source-layer": "AH_School",
    },
    {
      id: "Atlantic_Herring",
      type: "circle",
      source: "annotations",
      paint: {
        "circle-blur": 0,
        "circle-color": "grey",
        "circle-opacity": 0.75,
        "circle-radius": 4,
        "circle-stroke-color": "grey",
        "circle-stroke-opacity": 0.9,
        // "circle-stroke-width": 2,
      },
      "source-layer": "Atlantic_Herring",
    },
    {
      id: "Fish_School",
      type: "circle",
      source: "annotations",
      paint: {
        "circle-blur": 0,
        "circle-color": "orange",
        "circle-opacity": 0.4,
        "circle-radius": 4,
        "circle-stroke-color": "orange",
        "circle-stroke-opacity": 0.9,
        // "circle-stroke-width": 2,
      },
      "source-layer": "Fish_School",
    },
    {
      id: "Krill_Schools",
      type: "circle",
      source: "annotations",
      paint: {
        "circle-blur": 1,
        "circle-color": "black",
        "circle-opacity": 0.5,
        "circle-radius": 3,
        "circle-stroke-color": "black",
        "circle-stroke-opacity": 0.5,
        // "circle-stroke-width": 2,
      },
      "source-layer": "Krill_Schools",
    },
    {
      id: "Possible_Herring",
      type: "circle",
      source: "annotations",
      paint: {
        "circle-blur": 0,
        "circle-color": "cyan",
        "circle-opacity": 0.4,
        "circle-radius": 4,
        "circle-stroke-color": "cyan",
        "circle-stroke-opacity": 0.9,
        // "circle-stroke-width": 2,
      },
      "source-layer": "Possible_Herring",
    },
    {
      id: "Unclassified_regions",
      type: "circle",
      source: "annotations",
      paint: {
        "circle-blur": 0,
        "circle-color": "red",
        "circle-opacity": 0.4,
        "circle-radius": 2,
        "circle-stroke-color": "red",
        "circle-stroke-opacity": 0.9,
        // "circle-stroke-width": 2,
      },
      "source-layer": "Unclassified_regions",
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
