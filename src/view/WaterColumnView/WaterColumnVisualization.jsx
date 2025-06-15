import {
  useState,
  useEffect,
  // useMemo,
  // useRef,
} from "react";
import PropTypes from 'prop-types';
import {
  MapContainer,
  Polygon,
  // Popup,
  Tooltip,
  // TileLayer,
} from "react-leaflet";
// import L from "leaflet";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  useMapEvents,
  useMap,
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
  selectAnnotationColor,
  //
  updateDepthMinIndex,
  updateDepthMaxIndex,
  updateTimeMinIndex,
  updateTimeMaxIndex,
} from "../../reducers/store/storeSlice";
import { useAppSelector } from "../../app/hooks.ts";
// Using this to figure out most of the solution:
// https://stackblitz.com/edit/react-leaflet-square?file=src%2FApp.js
import TimeAxis from "../WaterColumnView/Axes/TimeAxis.jsx";
import DepthAxis from "../WaterColumnView/Axes/DepthAxis.jsx";


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
  const dispatch = useAppDispatch();

  function GetMapBounds() {
    // Get the leaflet map bounds on each click for updating axes
    const map = useMap();

    useMapEvents({
      moveend() {
        // console.log(`moveend`);
        const bounds = map.getBounds();
        // TODO: set upper and lower limits to these values
        dispatch(updateDepthMinIndex(Math.round(bounds.getNorthEast().lat * -1)));
        dispatch(updateDepthMaxIndex(Math.round(bounds.getSouthWest().lat * -1)));
        dispatch(updateTimeMinIndex(Math.round(bounds.getSouthWest().lng)));
        dispatch(updateTimeMaxIndex(Math.round(bounds.getNorthEast().lng)));
      }
    });
    
    return null
  }

  const [map, setMap] = useState(null);

  const annotation = useAppSelector(selectAnnotation);
  const annotationColor = useAppSelector(selectAnnotationColor);

  const mapCenterX = initialTimeIndex;
  // TODO: this will create a problem when page is resized
  const mapCenterY = -1 * (window.innerHeight / 2) + 100; // where does 60 come from?
  const mapCenter = [mapCenterY, mapCenterX];
  const marginX = 100; // map maxBounds + margin
  const marginY = 100;

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

  useEffect(() => {
    if (map) {
      map.eachLayer(x => {
        if (x.options.className === 'Annotation'){
          x.setStyle({
            color: annotationColor
          });
        }
      })
    }
  }, [annotationColor, map]);

  useEffect(() => {
      if(map) { // not sure if I need to just limit this to first load of map?
        const bounds = map.getBounds();
        dispatch(updateDepthMinIndex(Math.round(bounds._northEast.lat * -1)));
        dispatch(updateDepthMaxIndex(Math.round(bounds._southWest.lat * -1)));
        dispatch(updateTimeMinIndex(Math.round(bounds._southWest.lng)));
        dispatch(updateTimeMaxIndex(Math.round(bounds._northEast.lng)));
      }
  }, [dispatch, map]);

  return (
    <div className="WaterColumnVisualization">
      <Container fluid className="h-100 d-flex flex-column">
        <Row className="h-100">
          <Col className="topLeft p-0 m-0" style={{ backgroundColor: "#ddd"}}>
            <MapContainer
              crs={CRS.Simple}
              zoom={0}
              center={mapCenter}
              minZoom={0}
              maxZoom={0}
              zoomControl={false}
              tileSize={tileSize}
              className="Map"
              ref={setMap}
              maxBounds={[
                [-1 * Math.ceil(storeShape[0]/tileSize) * tileSize - marginX, 0 - marginX],
                [0 + marginY, storeShape[1] + marginY],
              ]}
            >
              <CustomLayer  />

              <LocationMarker />

              {
                (annotation)
                ?
                  <Polygon color={annotationColor} positions={positions} title="Annotation" className="Annotation">
                    <Tooltip>
                      CTD stands for conductivity, temperature, and depth,<br />and refers to a package of electronic instruments<br />that measure these properties.
                    </Tooltip>
                  </Polygon>
                :
                  <></>          
              }

              <GetMapBounds />
            </MapContainer>
          </Col>
          <Col className="topRight depthAxis" style={{ backgroundColor: "#dddddd"}}>
            <DepthAxis />
          </Col>
        </Row>
        <Row>
          <Col className="bottomLeft timeAxis" style={{ backgroundColor: "#dddddd"}}>
            <TimeAxis />
          </Col>
          <Col className="bottomRight" style={{ backgroundColor: "#dddddd"}}></Col>
        </Row>
      </Container>
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