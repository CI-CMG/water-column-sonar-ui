import {
  useState,
  useEffect,
} from "react";
// import { useSearchParams } from 'react-router';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Row from 'react-bootstrap/Row';
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import MiniMapView from "./MiniMapView";
// import { slice } from "zarrita";
// import { get } from "@zarrita/ndarray"; // https://www.npmjs.com/package/zarrita
import ColorMap from "./ColorMap";
import SvPlotView from "./SvPlotView";
import WaterColumnColors from "./WaterColumnColors.jsx";
import {
  // updateSvMin,
  // updateSvMax,
  // 
  selectShip,
  selectCruise,
  selectSensor,
  
  // selectLatitude,
  // selectLongitude,
  // selectTime,
  // selectDepth,

  // selectSv,
  selectSvMin,
  selectSvMax,
  selectFrequency, // currently chosen value
  updateFrequency,
} from ".././../reducers/cruise/cruiseSlice.ts";
import {
  selectFrequencies, // all the values
  selectLatitude, // uses clicked index
  selectLongitude,
  selectTime,
  selectDepth,
  selectSv,
} from ".././../reducers/store/storeSlice.ts";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const InformationPanel = ({
  calibrationStatus,
  processingSoftwareName,
  processingSoftwareTime,
  processingSoftwareVersion,

  // TODO: get dimensionality of Sv data
  // timeArray,
  // latitudeArray,
  // longitudeArray,
}) => {
  const frequencies = useAppSelector(selectFrequencies); // from store
  const frequency = useAppSelector(selectFrequency); // todo: get index

  const dispatch = useAppDispatch()
  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);
  
  const latitude = useAppSelector(selectLatitude); // from store
  const longitude = useAppSelector(selectLongitude);
  const time = useAppSelector(selectTime);
  const depth = useAppSelector(selectDepth);

  // const depth = useAppSelector(selectDepth);
  // const sv = useAppSelector(selectSv); // todo; move these to WaterColumnView in hook
  const svMin = useAppSelector(selectSvMin);
  const svMax = useAppSelector(selectSvMax);

  // const count = useAppSelector(selectCount); // used for counter redux example;
  
  // const [searchParams, setSearchParams] = useSearchParams();
  // dispatch(updateShip(searchParams.get('ship')));
  // dispatch(updateCruise(searchParams.get('cruise')));
  // dispatch(updateSensor(searchParams.get('sensor')));

  const [isLoading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  // const [frequencies, setFrequencies] = useState({}); // used for button
  // const [colorMaps, setColorMaps] = useState(WaterColumnColors); // used for button
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [colorMaps, setColorMap] = useState(Object.keys(WaterColumnColors).map((x, y) => {
    return {'key': y, 'value': x}; 
  }));
  // const [selectedColorMap, setSelectedColorMap] = useState(Object.keys(WaterColumnColors).map((x, y) => {
  //   return {'key': y, 'value': x}; 
  // })[searchParams.get('color')]);
  // const handleSelectColorMap = (key) => {
  //   setSelectedColorMap({ key: Number(key), value: Object.keys(WaterColumnColors)[key] });
  //   setSearchParams(
  //     (prev) => {
  //       prev.set('color', key);
  //       return prev;
  //     },
  //     { preventScrollReset: true }
  //   );
  // };
  // const [selectedFrequency, setSelectedFrequency] = useState({});
  const handleSelectFrequency = (key) => {
    // setSelectFrequency({ key: Number(key), value: frequencies[Number(key)].value });
    dispatch(updateFrequency(Number(key)));
    // setSearchParams(
    //   (prev) => {
    //     prev.set('frequency', key);
    //     return prev;
    //   },
    //   { preventScrollReset: true }
    // );
  };

  useEffect(() => {
    if(frequencies !== null){
      setLoading(false);
    }
  }, [frequencies]);
  // useEffect(() => {
  //   if(timeArray !== null){
  //     (async () => {
  //       await get(timeArray, [0])
  //         .then((d1) => {
  //           console.log(d1);
  //         });
  //     })();
  //   }
  //   // if(frequencyArray !== null){
  //   //   (async () => {
  //   //     await get(frequencyArray, [slice(null)])
  //   //       .then((f1) => {
  //   //         let allFrequencies = []
  //   //         f1.data.forEach(function (element, index) { // convert BigUInts to Numbers
  //   //           var h = Number(element);
  //   //           allFrequencies.push({
  //   //             key: index,
  //   //             value: h,
  //   //           });
  //   //         });
  //   //         setFrequencies(allFrequencies);
  //   //         setSelectedFrequency(allFrequencies[0]);
  //   //         setLoading(false);
  //   //       });
  //   //   })();
  //   // }
  //   if(latitudeArray !== null){
  //     (async () => {
  //       await get(latitudeArray, [0])
  //         .then((la) => {
  //           console.log(la.data);
  //         });
  //     })();
  //   }
  //   if(longitudeArray !== null){
  //     (async () => {
  //       await get(longitudeArray, [0])
  //         .then((lo) => {
  //           console.log(lo.data);
  //         });
  //     })();
  //   }
  // }, [timeArray, latitudeArray, longitudeArray])

  const url_level_0 = `https://noaa-wcsd-pds.s3.amazonaws.com/index.html#data/raw/${ship}/${cruise}/${sensor}/`;
  const url_level_1 = `https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/${ship}/${cruise}/${sensor}/`;
  const url_level_2 = `https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/${ship}/${cruise}/${sensor}/`;

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }
  return (
    <>
      <Button
        variant="dark"
        size="sm"
        onClick={handleShow}
        className="legend"
        style={{ zIndex: 999 }}
      >
        Cruise Information
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        scroll
        backdrop={false}
        offcanvas-width={50}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {ship} <font color="#00CC33">/</font>{" "}
            {cruise} <font color="#00CC33">/</font>{" "}
            {sensor}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* <Counter /> */}

          <MiniMapView />

          <SvPlotView />

          <br />
          {/* <p>
            <b>Counter:</b>{" "}
            <span className="font-monospace float-end">{count}</span>
          </p> */}
          <p>
            <b>Ship:</b>
            <span className="font-monospace float-end">{ ship }</span>
          </p>
          <p>
            <b>Cruise:</b>
            <span className="font-monospace float-end">{ cruise }</span>
          </p>
          <p>
            <b>Sensor:</b>
            <span className="font-monospace float-end">{ sensor }</span>
          </p>
          <p>
            <b>Time:</b>{" "}
            {/* <span className="font-monospace float-end"><font color="green">2025-03-06</font>T<font color="green">16:13:30</font>Z</span> */}
            <span className="font-monospace float-end">{ time }</span>
            {/* <span className="font-monospace">{get(timeArray, 1)}</span> */}
          </p>
          <p>
            <b>Lon/Lat:</b>{" "}
            <span className="font-monospace float-end">{ longitude }° E, { latitude }° N</span>
          </p>
          <p>
            <b>Depth:</b>
            <span className="font-monospace float-end">{ depth } meters</span>
            {/* <span className="font-monospace float-end"><font color="#6699CC">123 meters</font></span> */}
          </p>
          <p>
            <b>Selected Sv:</b>{" "}
            <span className="font-monospace float-end">{ 123.45 } dB</span>
          </p>

          <br />

          <Dropdown onSelect={handleSelectFrequency}>
            <Dropdown.Toggle variant="dark" id="dropdown-basic" className="btn-sm float-end">
              Frequency
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {
                frequencies.map((item, index) => {
                  return (
                    <Dropdown.Item key={index} eventKey={item}>
                      {item}
                    </Dropdown.Item>
                  );
                })
              }
            </Dropdown.Menu>
          </Dropdown>
          <p>
            <b>Frequency:</b>{" "}
            <span className="font-monospace">{frequency?.value / 1000} kHz</span>
          </p>

          <br />

          {/* <Dropdown onSelect={handleSelectColorMap}>
            <Dropdown.Toggle variant="dark" id="dropdown-basic" className="btn-sm float-end">
              Color Map
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {
                colorMaps.map((item, index) => {
                  return (
                    <Dropdown.Item key={index} eventKey={item.key}>
                      {item.value}
                    </Dropdown.Item>
                  );
                })
              }
            </Dropdown.Menu>
          </Dropdown> */}
          {/* <p>
            <b>Color Map:</b>{" "}
            <span className="font-monospace">{selectedColorMap.value}</span>
          </p> */}
          
          <br />
          <p>[ Color Palette ]</p>
          <ColorMap min="-80" max="-30" selectedColorPalette="viridis"/>
          
          <br />
          
          <Form.Label><b>Sv Range</b></Form.Label>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              controlId="minDB"
            >
              <Form.Label>Minimum (dB)</Form.Label>
              <Form.Control
                type="number"
                defaultValue={svMin}
                name="minDB"
                // onChange={(e) => dispatch(updateSvMin(e.target.value))}
                className="w-75"
              />
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="maxDB"
            >
              <Form.Label>Maximum (dB)</Form.Label>
              <Form.Control
                type="number"
                defaultValue={svMax}
                name="maxDB"
                // onChange={(e) => dispatch(updateSvMax(e.target.value))}
                className="w-75"
              />
            </Form.Group>
          </Row>
          <br />

          <hr />
          <p><b>Data Access:</b></p>
          <p>
            <b>Level 0:</b>
            <span className="font-monospace float-end">
              <a href={url_level_0} target="_blank" rel="noopener noreferrer">
                Raw Files
              </a>
            </span>
          </p>
          <p>
            <b>Level 1:</b>
            <span className="font-monospace float-end">
              <a href={url_level_1} target="_blank" rel="noopener noreferrer">
                File-level Zarr stores
              </a>
            </span>
          </p>
          <p>
            <b>Level 2:</b>
            <span className="font-monospace float-end">
              <a href={url_level_2} target="_blank" rel="noopener noreferrer">
                Cruise-level Zarr store
              </a>
            </span>
          </p>
          <p><i>Add total dimensions of L2 data:<br />depth x time x frequency</i></p>
          
          <br />
          <hr />
          
          <p><b>Processing Software:</b></p>
          <p>
            <b>name:</b>
            {/* <span className="float-end softwareName">{processingSoftwareName}</span> */}
            <span className="font-monospace float-end">{processingSoftwareName}</span>
          </p>
          <p>
            <b>Date:</b>
            <span className="font-monospace float-end">{processingSoftwareTime}</span>
          </p>
          <p>
            <b>Version:</b>
            <span className="font-monospace float-end">v{processingSoftwareVersion}</span>
          </p>
          <p>
            <b>Calibration Status:</b>
            <span className="font-monospace float-end"><i>{calibrationStatus ? "calibrated" : "not calibrated"}</i></span>
          </p>
          <br />
          <p className="text-center"><b>~</b></p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default InformationPanel;

InformationPanel.propTypes = {
  // queryParameters: PropTypes.instanceOf(Object),
  calibrationStatus: PropTypes.instanceOf(String), // TODO: use redux to pass values
  processingSoftwareName: PropTypes.instanceOf(String),
  processingSoftwareTime: PropTypes.instanceOf(String),
  processingSoftwareVersion: PropTypes.instanceOf(String),

  // timeArray: PropTypes.instanceOf(Object),
  // latitudeArray: PropTypes.instanceOf(Object),
  // longitudeArray: PropTypes.instanceOf(Object),
  // frequencyArray: PropTypes.instanceOf(Object), // Number?
  // depthIndices: PropTypes.instanceOf(String),
  // timeIndices: PropTypes.instanceOf(String),
  // frequencyIndices: PropTypes.instanceOf(String),
};
