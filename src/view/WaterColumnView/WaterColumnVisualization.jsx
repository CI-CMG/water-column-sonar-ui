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

// const rectangles = [
//   [
//     [-564, 2187169],
//     [-591, 2187178],
//   ],
//   [
//     [-574, 2187877],
//     [-602, 2187893],
//   ],
//   [
//     [-574, 2188016],
//     [-600, 2188026],
//   ],
//   [
//     [-557, 2188080],
//     [-583, 2188086],
//   ],
//   [
//     [-571, 2188143],
//     [-607, 2188153],
//   ],
//   [
//     [-586, 2188157],
//     [-609, 2188164],
//   ],
//   [
//     [-583, 2188504],
//     [-616, 2188511],
//   ],
//   [
//     [-567, 2189729],
//     [-603, 2189746],
//   ],
//   [
//     [-662, 2191532],
//     [-694, 2191543],
//   ],
//   [
//     [-721, 2191781],
//     [-744, 2191789]
//   ],
// ]
const rectangles = [
 [[-564, 2187169], [-591, 2187178]],
 [[-574, 2187877], [-602, 2187893]],
 [[-574, 2188016], [-600, 2188026]],
 [[-557, 2188080], [-583, 2188086]],
 [[-571, 2188143], [-607, 2188153]],
 [[-586, 2188157], [-609, 2188164]],
 [[-583, 2188504], [-616, 2188511]],
 [[-567, 2189729], [-603, 2189746]],
 [[-662, 2191532], [-694, 2191543]],
 [[-721, 2191781], [-744, 2191789]],
 [[-713, 2191834], [-748, 2191848]],
 [[-704, 2191854], [-731, 2191866]],
 [[-694, 2191869], [-733, 2191878]],
 [[-673, 2191899], [-741, 2191927]],
 [[-714, 2192021], [-739, 2192031]],
 [[-696, 2192127], [-717, 2192136]],
 [[-684, 2192148], [-724, 2192156]],
 [[-688, 2192168], [-732, 2192185]],
 [[-661, 2192195], [-694, 2192206]],
 [[-682, 2192219], [-718, 2192229]],
 [[-699, 2192233], [-722, 2192240]],
 [[-672, 2192247], [-718, 2192261]],
 [[-694, 2192271], [-726, 2192280]],
 [[-660, 2192324], [-698, 2192404]],
 [[-810, 2192521], [-836, 2192532]],
 [[-816, 2192593], [-838, 2192610]],
 [[-815, 2192694], [-837, 2192708]],
 [[-819, 2192744], [-842, 2192762]],
 [[-801, 2192784], [-845, 2192841]],
 [[-807, 2192856], [-834, 2192866]],
 [[-803, 2192943], [-833, 2192958]],
 [[-678, 2193283], [-717, 2193308]],
 [[-703, 2193341], [-726, 2193356]],
 [[-757, 2193406], [-781, 2193437]],
 [[-717, 2193601], [-761, 2193620]],
 [[-894, 2195485], [-981, 2195545]],
 [[-907, 2195547], [-928, 2195563]],
 [[-354, 2197469], [-375, 2197492]],
 [[-684, 2197497], [-709, 2197506]],
 [[-293, 2197499], [-314, 2197502]],
 [[-297, 2197543], [-320, 2197548]],
 [[-760, 2197545], [-804, 2197553]],
 [[-726, 2197560], [-753, 2197572]],
 [[-294, 2197564], [-324, 2197590]],
 [[-737, 2197585], [-779, 2197593]],
 [[-296, 2197597], [-317, 2197602]],
 [[-695, 2197620], [-746, 2197630]],
 [[-294, 2197631], [-337, 2197661]],
 [[-651, 2197980], [-679, 2197987]],
 [[-660, 2198053], [-711, 2198060]],
 [[-657, 2198116], [-695, 2198122]],
 [[-661, 2198131], [-686, 2198137]],
 [[-690, 2198156], [-710, 2198162]],
 [[-653, 2198171], [-683, 2198190]],
 [[-856, 2198252], [-879, 2198274]],
 [[-649, 2198260], [-686, 2198271]],
 [[-632, 2198275], [-693, 2198292]],
 [[-855, 2198281], [-877, 2198288]],
 [[-648, 2198298], [-669, 2198304]],
 [[-865, 2198325], [-899, 2198342]],
 [[-664, 2198326], [-699, 2198347]],
 [[-875, 2198384], [-904, 2198432]],
 [[-720, 2198410], [-745, 2198420]],
 [[-862, 2198438], [-903, 2198479]],
 [[-877, 2198492], [-905, 2198502]],
 [[-892, 2198536], [-912, 2198555]],
 [[-887, 2198569], [-916, 2198578]],
 [[-889, 2198578], [-916, 2198600]],
 [[-715, 2198581], [-737, 2198597]],
 [[-885, 2198608], [-922, 2198652]],
 [[-886, 2198653], [-913, 2198683]],
 [[-900, 2198691], [-935, 2198705]],
 [[-744, 2198713], [-770, 2198726]],
 [[-723, 2198753], [-755, 2198763]],
 [[-603, 2198788], [-628, 2198816]],
 [[-566, 2198834], [-607, 2198874]],
 [[-774, 2198858], [-836, 2198866]],
 [[-544, 2198882], [-585, 2198898]],
 [[-749, 2198888], [-769, 2198894]],
 [[-584, 2198899], [-610, 2198917]],
 [[-631, 2198905], [-652, 2198925]],
 [[-544, 2198913], [-569, 2198924]],
 [[-904, 2198941], [-931, 2198971]],
 [[-924, 2198993], [-948, 2199009]],
 [[-627, 2199036], [-649, 2199050]],
 [[-905, 2199054], [-951, 2199095]],
 [[-626, 2199056], [-648, 2199079]],
 [[-906, 2199092], [-944, 2199143]],
 [[-899, 2199147], [-946, 2199170]],
 [[-888, 2199197], [-948, 2199261]],
 [[-511, 2199231], [-533, 2199246]],
 [[-904, 2199406], [-933, 2199426]],
 [[-229, 2199473], [-250, 2199480]],
 [[-400, 2199526], [-424, 2199532]],
 [[-413, 2199537], [-449, 2199561]],
 [[-548, 2199577], [-569, 2199586]],
 [[-217, 2199641], [-238, 2199647]],
 [[-333, 2199642], [-359, 2199648]],
 [[-214, 2199722], [-238, 2199731]],
 [[-919, 2199765], [-940, 2199780]],
 [[-930, 2199960], [-964, 2199978]],
 [[-923, 2200076], [-950, 2200096]],
 [[-200, 2200224], [-222, 2200233]],
 [[-211, 2200261], [-233, 2200274]],
 [[-208, 2200283], [-232, 2200316]],
 [[-928, 2200388], [-951, 2200410]],
 [[-214, 2200446], [-236, 2200461]],
 [[-199, 2200533], [-250, 2200603]],
 [[-282, 2200533], [-317, 2200548]],
 [[-298, 2200557], [-326, 2200568]],
 [[-344, 2200585], [-367, 2200595]],
 [[-245, 2200605], [-287, 2200615]],
 [[-206, 2200634], [-274, 2200722]],
 [[-360, 2200650], [-380, 2200658]],
 [[-376, 2200683], [-420, 2200721]],
 [[-354, 2200711], [-377, 2200718]],
 [[-207, 2200734], [-234, 2200739]],
 [[-221, 2200746], [-246, 2200763]],
 [[-190, 2200807], [-211, 2200813]],
 [[-928, 2200943], [-957, 2200969]],
 [[-932, 2200998], [-956, 2201015]],
 [[-935, 2201424], [-964, 2201439]],
 [[-384, 2201534], [-413, 2201555]],
 [[-383, 2201564], [-414, 2201588]],
 [[-269, 2201969], [-309, 2201979]],
 [[-958, 2202212], [-981, 2202227]],
 [[-283, 2202250], [-311, 2202257]],
 [[-446, 2202267], [-469, 2202275]],
 [[-302, 2202292], [-350, 2202300]],
 [[-959, 2202301], [-989, 2202314]],
 [[-318, 2202302], [-407, 2202355]],
 [[-968, 2202337], [-996, 2202356]],
 [[-246, 2202359], [-267, 2202365]],
 [[-297, 2202359], [-344, 2202385]],
 [[-949, 2202379], [-996, 2202418]],
 [[-271, 2202389], [-292, 2202396]],
 [[-351, 2202411], [-375, 2202417]],
 [[-313, 2202429], [-343, 2202439]],
 [[-299, 2202442], [-338, 2202452]],
 [[-242, 2202451], [-284, 2202455]],
 [[-303, 2202462], [-331, 2202471]],
 [[-177, 2202714], [-209, 2202720]],
 [[-193, 2202813], [-220, 2202824]],
 [[-196, 2202863], [-246, 2202900]],
 [[-382, 2202890], [-420, 2202903]],
 [[-206, 2202935], [-226, 2202958]],
 [[-192, 2202974], [-230, 2202988]],
 [[-197, 2203005], [-229, 2203024]],
 [[-966, 2203011], [-996, 2203026]],
 [[-993, 2203027], [-1014, 2203043]],
 [[-965, 2203043], [-1004, 2203070]],
 [[-182, 2203082], [-207, 2203097]],
 [[-1016, 2203399], [-1055, 2203425]],
 [[-1039, 2204003], [-1071, 2204042]],
 [[-973, 2204126], [-1000, 2204165]],
 [[-972, 2204195], [-1004, 2204213]],
 [[-983, 2204216], [-1071, 2204297]],
 [[-977, 2204258], [-1008, 2204272]],
 [[-986, 2204310], [-1013, 2204338]],
 [[-984, 2204342], [-1027, 2204396]],
 [[-973, 2204573], [-999, 2204595]],
 [[-987, 2204613], [-1033, 2204649]],
 [[-988, 2204652], [-1024, 2204684]],
 [[-970, 2204695], [-1022, 2204738]],
 [[-961, 2204736], [-1018, 2204759]],
 [[-953, 2204801], [-991, 2204830]],
 [[-948, 2204936], [-971, 2204948]],
 [[-956, 2204951], [-977, 2204958]],
 [[-950, 2204982], [-979, 2205021]],
 [[-855, 2205641], [-877, 2205666]],
 [[-849, 2205765], [-883, 2205787]],
 [[-854, 2205819], [-876, 2205836]],
 [[-841, 2205971], [-891, 2206020]],
 [[-825, 2206015], [-869, 2206092]],
 [[-832, 2206134], [-872, 2206171]],
 [[-848, 2206178], [-869, 2206190]]
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
    <Tooltip>AH_School {i}<br />d20191016_t121103-t233917_Zsc-DWBA-Schools_All-RegionDefs.evr</Tooltip>
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
