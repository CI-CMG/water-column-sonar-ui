import {
  useState,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
} from "react-leaflet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useMapEvents, useMap } from "react-leaflet/hooks";
import { CRS } from "leaflet";
import { useAppDispatch } from "../../app/hooks";
import CustomLayer from "./CustomLayer";
import { useSearchParams } from "react-router";
import {
  selectShip,
  selectCruise,
  selectSensor,
  //
  updateDepthIndex,
  updateTimeIndex,
  selectAnnotationColor,
  //
  updateDepthMinIndex,
  updateDepthMaxIndex,
  updateTimeMinIndex,
  updateTimeMaxIndex,
  //
  selectTimeMinIndex,
  selectTimeMaxIndex,
  //
  depthArrayAsync,
  timeArrayAsync,
} from "../../reducers/store/storeSlice";
import { useAppSelector } from "../../app/hooks.ts";
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

      setSearchParams(
        // Update time url param
        (prev) => {
          prev.set("time", newTimeIndex);
          return prev;
        }
      );
    },
  });

  return null;
}

const WaterColumnVisualization = ({
  tileSize,
  storeShape,
  initialTimeIndex,
}) => {
  const dispatch = useAppDispatch();
  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);

  const timeMinIndex = useAppSelector(selectTimeMinIndex);
  const timeMaxIndex = useAppSelector(selectTimeMaxIndex);

  function GetMapBounds() {
    // Get the leaflet map bounds on each click for updating axes
    const map = useMap();

    useMapEvents({
      moveend: () => {
        const bounds = map.getBounds();

        dispatch(
          updateDepthMinIndex(Math.round(bounds.getNorthEast().lat * -1))
        );
        dispatch(
          updateDepthMaxIndex(Math.round(bounds.getSouthWest().lat * -1))
        );
        dispatch(
          updateTimeMinIndex(Math.round(bounds.getSouthWest().lng))
        );
        dispatch(
          updateTimeMaxIndex(Math.round(bounds.getNorthEast().lng))
        );
        dispatch(timeArrayAsync({
          ship,
          cruise,
          sensor,
          indexStart: Math.round(bounds.getSouthWest().lng),
          indexEnd: Math.round(bounds.getNorthEast().lng),
        }));
      },
    });

    return null;
  }

  const [map, setMap] = useState(null);

  const annotationColor = useAppSelector(selectAnnotationColor);

  const mapCenterX = initialTimeIndex;
  // TODO: this will create a problem when page is resized
  const mapCenterY = -1 * (window.innerHeight / 2) + 100;
  const mapCenter = [mapCenterY, mapCenterX];
  const marginX = 500; // map maxBounds + margin
  const marginY = 100;

  useEffect(() => {
    if (map) {
      map.eachLayer((x) => {
        if (x.options.className === "Annotation") {
          x.setStyle({
            color: annotationColor,
          });
        }
      });
    }
  }, [annotationColor, map]);

  useEffect(() => {
    if (map) {
      const bounds = map.getBounds();
      
      dispatch(updateDepthMinIndex(Math.round(bounds._northEast.lat * -1)));
      dispatch(updateDepthMaxIndex(Math.round(bounds._southWest.lat * -1)));

      dispatch(updateTimeMinIndex(Math.round(bounds._southWest.lng)));
      dispatch(updateTimeMaxIndex(Math.round(bounds._northEast.lng)));
    }
  }, [cruise, dispatch, map, sensor, ship, timeMaxIndex, timeMinIndex]);

  return (
    <div className="WaterColumnVisualization">
      <Container fluid className="h-100 d-flex flex-column">
        <Row className="h-100">
          <Col className="topLeft p-0 m-0" style={{ backgroundColor: "#ddd" }}>
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
                [
                  -1 * Math.ceil(storeShape[0] / tileSize) * tileSize - marginX,
                  0 - marginX,
                ],
                [0 + marginY, storeShape[1] + marginY],
              ]}
              whenReady={(e) => {
                const windowWidth = e.target._size.x;
                const windowTopLeft = e.target._pixelOrigin.x
                dispatch(depthArrayAsync({ ship, cruise, sensor }));
                dispatch(timeArrayAsync({ ship, cruise, sensor, indexStart: windowTopLeft, indexEnd: (windowTopLeft+windowWidth) }));
              }}
            >
              <CustomLayer />

              <LocationMarker />

              <GetMapBounds />
            </MapContainer>
          </Col>
          <Col
            className="topRight depthAxis"
            style={{ backgroundColor: "#dddddd" }}
          >
            <DepthAxis />
          </Col>
        </Row>
        <Row>
          <Col
            className="bottomLeft timeAxis"
            style={{ backgroundColor: "#dddddd" }}
          >
            <TimeAxis />
          </Col>
          <Col
            className="bottomRight"
            style={{ backgroundColor: "#dddddd" }}
          ></Col>
        </Row>
      </Container>
    </div>
  );
};

export default WaterColumnVisualization;

WaterColumnVisualization.propTypes = {
  tileSize: PropTypes.string.isRequired,
  storeShape: PropTypes.array.isRequired,
  initialTimeIndex: PropTypes.number.isRequired,
};
