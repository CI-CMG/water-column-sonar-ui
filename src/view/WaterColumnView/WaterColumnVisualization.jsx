import PropTypes from 'prop-types';
import {
  MapContainer,
  Polygon,
  Popup,
  Tooltip,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import {
  useMapEvents,
} from 'react-leaflet/hooks'
import { CRS } from "leaflet";
import {
  useAppDispatch,
} from "../../app/hooks";
import CustomLayer from "./CustomLayer";
import { useSearchParams } from 'react-router';
import {
  updateDepthIndex,
  updateTimeIndex,
  selectAnnotation,
} from "../../reducers/store/storeSlice";
import { useAppSelector } from "../../app/hooks.ts";
// Using this to figure out most of the solution:
// https://stackblitz.com/edit/react-leaflet-square?file=src%2FApp.js


function LocationMarker() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  useMapEvents({
    click(e) {
      const newTimeIndex = parseInt(e.latlng.lng, 10);
      const newDepthIndex = parseInt(e.latlng.lat * -1.0, 10);
      
      // console.log(`newTimeIndex: ${newTimeIndex}, newDepthIndex: ${newDepthIndex}`);
      
      dispatch(updateTimeIndex(newTimeIndex));
      dispatch(updateDepthIndex(newDepthIndex));

      setSearchParams( // Update time url param
        (prev) => {
          prev.set('time', newTimeIndex);
          return prev;
        },
      );
    },
  });

  return null;
}

const WaterColumnVisualization = ({
  tileSize,
  storeShape,
  initialTimeIndex,
  // initialFrequencyIndex,
}) => {
  const annotation = useAppSelector(selectAnnotation);

  const mapCenterX = initialTimeIndex;
  const mapCenterY = -1 * (window.innerHeight / 2) + 60;
  const mapCenter = [mapCenterY, mapCenterX];
  const margin = 300; // map maxBounds + margin

  const polygon1 = [ // CTD sidescan example polygon for HB1906
    [-274, 434959],
    [-632, 435066],
    [-636, 435081],
    [-262, 435197],
    [-262, 435182],
    [-615, 435078],
    [-615, 435070],
    [-278, 434970],
    [-274, 434959],
  ];
  const positions = [polygon1];

  // Working Example: https://stackblitz.com/edit/react-leaflet-square?file=src%2FApp.js
  return (
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
          [-1 * Math.ceil(storeShape[0]/tileSize) * tileSize - margin, 0 - margin],
          [0 + margin, storeShape[1] + margin],
        ]}
      >
        <CustomLayer  />

        <LocationMarker />

        {
          (annotation)
          ?
            <Polygon color={'white'} positions={positions} title="Annotation">
              {/* <Popup>CTD signal (Conductivity, Temperature, Depth)</Popup> */}
              <Tooltip>
                CTD stands for conductivity, temperature, and depth,<br />and refers to a package of electronic instruments<br />that measure these properties.
              </Tooltip>
            </Polygon>
          :
            <></>          
        }
      </MapContainer>
    </div>
  );
}

export default WaterColumnVisualization;

WaterColumnVisualization.propTypes = {
  tileSize: PropTypes.string.isRequired,
  storeShape: PropTypes.array.isRequired,
  initialTimeIndex: PropTypes.number.isRequired,
  // initialFrequencyIndex: PropTypes.number.isRequired,
};