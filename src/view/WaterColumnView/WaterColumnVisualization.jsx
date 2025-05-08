import PropTypes from 'prop-types';
import {
  MapContainer,
} from "react-leaflet";
import {
  useMapEvents,
} from 'react-leaflet/hooks'
import { CRS } from "leaflet";
import {
  useAppDispatch,
  // useAppSelector,
} from "../../app/hooks";
import CustomLayer from "./CustomLayer";
import {
  updateDepthIndex,
  updateTimeIndex,
} from "../../reducers/store/storeSlice";


// function Square(props) {
//   const context = useLeafletContext()

//   useEffect(() => {
//     const bounds = L.latLng(props.center).toBounds(props.size)
//     const square = new L.Rectangle(bounds)
//     const container = context.layerContainer || context.map
//     container.addLayer(square)

//     return () => {
//       container.removeLayer(square)
//     }
//   })

//   return null
// }

function LocationMarker() {
  const dispatch = useAppDispatch();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const context = useLeafletContext();
  // const container = context.map;

  useMapEvents({
    click(e) {
      const newTimeIndex = parseInt(e.latlng.lng, 10);
      const newDepthIndex = parseInt(e.latlng.lat * -1.0, 10);
      console.log(`newTimeIndex: ${newTimeIndex}, newDepthIndex: ${newDepthIndex}`);
      dispatch(updateTimeIndex(newTimeIndex));
      dispatch(updateDepthIndex(newDepthIndex));

      // setSearchParams( // Update time url param
      //   (prev) => {
      //     prev.set('time', newTimeIndex);
      //     return prev;
      //   },
      // );
    },
  });

  return null;
}

const WaterColumnVisualization = ({
  tileSize,
  storeShape,
  initialTimeIndex,
}) => {
  const mapCenterX = initialTimeIndex;
  const mapCenterY = -1 * (window.innerHeight / 2) + 60;
  const mapCenter = [mapCenterY, mapCenterX];
  const margin = 400; // map maxBounds + margin

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
          [-1 * Math.ceil(storeShape[0]/tileSize)*tileSize - margin, 0 - margin], // bottomLeft?
          [0 + margin, storeShape[1] + margin], // topRight?
        ]}
      >
        <CustomLayer  />

        <LocationMarker />
      </MapContainer>
    </div>
  );
}

export default WaterColumnVisualization;

WaterColumnVisualization.propTypes = {
  tileSize: PropTypes.string.isRequired,
  storeShape: PropTypes.array.isRequired,
  initialTimeIndex: PropTypes.number.isRequired,
};