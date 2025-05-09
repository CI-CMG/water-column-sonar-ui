import {
  useState,
} from "react";
import PropTypes from 'prop-types';
import {
  MapContainer,
  Polygon,
  Popup,
  Tooltip,
  TileLayer,
} from "react-leaflet";
import {
  createElementObject,
  createPathComponent,
  extendContext,
} from '@react-leaflet/core';
import L from "leaflet";
import {
  useMapEvents,
} from 'react-leaflet/hooks'
import { CRS } from "leaflet";
import {
  useAppDispatch,
} from "../../app/hooks";
import CustomLayer from "./CustomLayer";
import {
  updateDepthIndex,
  updateTimeIndex,
  selectAnnotation,
} from "../../reducers/store/storeSlice";
import { useAppSelector } from "../../app/hooks.ts";


// function LocationMarker() {
//   const dispatch = useAppDispatch();
//   // const [searchParams, setSearchParams] = useSearchParams();
//   // const context = useLeafletContext();
//   // const container = context.map;

//   useMapEvents({
//     click(e) {
//       const newTimeIndex = parseInt(e.latlng.lng, 10);
//       const newDepthIndex = parseInt(e.latlng.lat * -1.0, 10);
//       console.log(`newTimeIndex: ${newTimeIndex}, newDepthIndex: ${newDepthIndex}`);
//       dispatch(updateTimeIndex(newTimeIndex));
//       dispatch(updateDepthIndex(newDepthIndex));

//       // setSearchParams( // Update time url param
//       //   (prev) => {
//       //     prev.set('time', newTimeIndex);
//       //     return prev;
//       //   },
//       // );
//     },
//   });

//   return null;
// }

const options = {
  preferCanvas: true,
  contextmenu: true,
  doubleClickZoom: false,
  center: [55.754368, 37.616974],
  zoom: 9,
  maxZoom: 18,
  zoomControl: false
};

const INIT_SQUARE = { center: [55.754368, 37.616974], size: 1000 };

function getBounds(props) {
  return L.latLng(props.center).toBounds(props.size);
}

function createSquare(props, context) {
  const instance = new L.Rectangle(getBounds(props));
  return { instance, context: { ...context, overlayContainer: instance } };
}

function updateSquare(instance, props, prevProps) {
  if (props.center !== prevProps.center || props.size !== prevProps.size) {
    instance.setBounds(getBounds(props));
  }
}

const WaterColumnVisualization = ({
  tileSize,
  storeShape,
  initialTimeIndex,
}) => {
  const [squareProps, setSquareProps] = useState(INIT_SQUARE);
  const Square = createPathComponent(createSquare, updateSquare);

  const annotation = useAppSelector(selectAnnotation);
  const mapCenterX = initialTimeIndex;
  const mapCenterY = -1 * (window.innerHeight / 2) + 60;
  const mapCenter = [mapCenterY, mapCenterX];
  const margin = 400; // map maxBounds + margin

  // Working Example: https://stackblitz.com/edit/react-leaflet-square?file=src%2FApp.js
  return (
    <>
      <div className="WaterColumnVisualization">
        <MapContainer
          crs={CRS.Simple}
          zoom={0}
          center={mapCenter}
          minZoom={0}
          maxZoom={0}
          zoomControl={false}
          tileSize={tileSize}
          className="Map"
          maxBounds={[
            [-1 * Math.ceil(storeShape[0]/tileSize)*tileSize - margin, 0 - margin],
            [0 + margin, storeShape[1] + margin],
          ]}
          // whenCreated={map => map.invalidateSize()}
        >
          <CustomLayer  />
        </MapContainer>
      </div>
      <button
        onClick={() => {
          setSquareProps({ center: [55.754368, 37.616974], size: 2000 });
        }}
      >
        select 1
      </button>
      <button
        onClick={() => {
          setSquareProps({ center: [55.754368, 37.616974], size: 100 });
        }}
      >
        select 2
      </button>
      <button
        onClick={() => {
          setSquareProps(INIT_SQUARE);
        }}
      >
        reset
      </button>
    </>
  );
}

export default WaterColumnVisualization;

WaterColumnVisualization.propTypes = {
  tileSize: PropTypes.string.isRequired,
  storeShape: PropTypes.array.isRequired,
  initialTimeIndex: PropTypes.number.isRequired,
};