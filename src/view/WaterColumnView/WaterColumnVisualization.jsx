import {
  useState,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import {
  MapContainer,
  // Polygon,
  Rectangle,
  Tooltip,
} from "react-leaflet";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useMapEvents, useMap } from "react-leaflet/hooks";
import { CRS } from "leaflet";
import { useAppDispatch } from "../../app/hooks";
import CustomLayer from "./CustomLayer";
import CustomAILayer from "./CustomAILayer";
import { useSearchParams } from "react-router";
import {
  selectShip,
  selectCruise,
  selectSensor,
  //
  updateDepthIndex,
  updateTimeIndex,
  selectAnnotation,
  selectAnnotationColor,
  selectAnnotationAI,
  //
  updateDepthMinIndex,
  updateDepthMaxIndex,
  updateTimeMinIndex,
  updateTimeMaxIndex,
  //
  // selectDepthMinIndex,
  // selectDepthMaxIndex,
  //
  selectTimeMinIndex,
  selectTimeMaxIndex,
  //
  depthArrayAsync,
  timeArrayAsync,
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

const rectangles = [
  [
    [-564, 2187169],
    [-591, 2187178],
  ],
  [
    [-574, 2187877],
    [-602, 2187893],
  ],
  [
    [-574, 2188016],
    [-600, 2188026],
  ],
  [
    [-557, 2188080],
    [-583, 2188086],
  ],
  [
    [-571, 2188143],
    [-607, 2188153],
  ],
  [
    [-586, 2188157],
    [-609, 2188164],
  ],
  [
    [-583, 2188504],
    [-616, 2188511],
  ],
  [
    [-567, 2189729],
    [-603, 2189746],
  ],
  [
    [-662, 2191532],
    [-694, 2191543],
  ],
  [
    [-721, 2191781],
    [-744, 2191789]
  ],
]

const rectangleItems = rectangles.map((rectangle, i) =>
  <Rectangle
    bounds={rectangle}
    key={rectangle}
    opacity={0.75}
    fillColor="white"
    fillOpacity={0.10}
    weight={2}
    title="Annotation"
    className="Annotation"
    pathOptions={{ color: '#FF69B4' }}
  >
    <Tooltip>Atlantic Herring School {i}</Tooltip>
  </Rectangle>
)

const WaterColumnVisualization = ({
  tileSize,
  storeShape,
  initialTimeIndex,
  // initialFrequencyIndex,
}) => {
  const dispatch = useAppDispatch();
  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);
  // TODO: need to parse depth same way as time, currently too much data!
  // const depthMinIndex = useAppSelector(selectDepthMinIndex);
  // const depthMaxIndex = useAppSelector(selectDepthMaxIndex);
  const timeMinIndex = useAppSelector(selectTimeMinIndex);
  const timeMaxIndex = useAppSelector(selectTimeMaxIndex);

  // const domain = useMemo(() => {
  //     return [depthMinIndex, depthMaxIndex];
  // }, [depthMinIndex, depthMaxIndex]);

  function GetMapBounds() {
    // Get the leaflet map bounds on each click for updating axes
    const map = useMap();

    useMapEvents({
      // move: () => {
      //   console.log('move use map events.');
      // },
      // load: () => {
      //   console.log("this doesnt run?");
      // },
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
        // dispatch(depthArrayAsync({ ship, cruise, sensor })); // TODO: indexStart: depthMinIndex, indexEnd: depthMaxIndex
        // console.log('moveend timeArray')
        // dispatch(timeArrayAsync({ ship, cruise, sensor, indexStart: timeMinIndex, indexEnd: timeMaxIndex }));
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

  const annotation = useAppSelector(selectAnnotation);
  const annotationAI = useAppSelector(selectAnnotationAI);
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
      // not sure if I need to just limit this to first load of map?
      const bounds = map.getBounds();
      
      dispatch(updateDepthMinIndex(Math.round(bounds._northEast.lat * -1)));
      dispatch(updateDepthMaxIndex(Math.round(bounds._southWest.lat * -1)));

      dispatch(updateTimeMinIndex(Math.round(bounds._southWest.lng)));
      dispatch(updateTimeMaxIndex(Math.round(bounds._northEast.lng)));
      
      // dispatch(depthArrayAsync({ ship, cruise, sensor })); // , indexStart: depthMinIndex, indexEnd: depthMaxIndex }));
      // dispatch(timeArrayAsync({ ship, cruise, sensor, indexStart: timeMinIndex, indexEnd: timeMaxIndex }));
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
                // console.log("The map is created");
                dispatch(depthArrayAsync({ ship, cruise, sensor })); // TODO: indexStart: depthMinIndex, indexEnd: depthMaxIndex
                // TODO: this isn't getting the right timeArray on initialize!
                // console.log(e);
                // debugger;
                // dispatch(timeArrayAsync({ ship, cruise, sensor, indexStart: 0, indexEnd: 1024 })); // TODO: hack right now
                dispatch(timeArrayAsync({ ship, cruise, sensor, indexStart: windowTopLeft, indexEnd: (windowTopLeft+windowWidth) })); // TODO: hack right now
                // NOTE: loading all the depth data is fine:
                // dispatch(depthArrayAsync({ ship, cruise, sensor }));
                // NOTE: loading all the time data is a problem:
                // dispatch(timeArrayAsync({ ship, cruise, sensor, indexStart: timeMinIndex, indexEnd: timeMaxIndex }));
              }}
            >
              {/* Water Column Data */}
              <CustomLayer />

              {/* Alex's AI Visualization Results */}
              {/* TODO: use checkbox to enable/disable */}
              {annotationAI && <CustomAILayer />}

              <LocationMarker />

              {annotation ? (
                <>{rectangleItems}</>
              ) : (
                <></>
              )}
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
  // initialFrequencyIndex: PropTypes.number.isRequired,
};
