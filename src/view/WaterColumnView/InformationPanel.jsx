import {
  // React,
  useState,
  useEffect,
} from "react";
import {
  useSearchParams
} from 'react-router';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Row from 'react-bootstrap/Row';
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import MiniMapView from "./MiniMapView";
// import { get } from "@zarrita/ndarray";
import { slice } from "zarrita";
import { get } from "@zarrita/ndarray"; // https://www.npmjs.com/package/zarrita

// color palette selected for the water column visualization
const colorPalettes = [
  { key: "EK80", value: "EK80" },
  { key: "EK500", value: "EK500" },
  { key: "Viridis", value: "Viridis" },
  { key: "Red-Blue Diverging", value: "Red-Blue Diverging" },
  { key: "Cyan-Magenta", value: "Cyan-Magenta" },
];

const InformationPanel = ({
  queryParameters,
  calibrationStatus,
  processingSoftwareName,
  processingSoftwareTime,
  processingSoftwareVersion,

  timeArray,
  latitudeArray,
  longitudeArray,
  frequencyArray,

  // depthIndices,
  // timeIndices,
  // frequencyIndices,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  // TODO: should be just numbers, then format when printed
  // const [frequencies, setFrequencies] = useState(["18 kHz", "38 kHz", "70 kHz", "120 kHz"]); // TODO: block this until loaded
  const [frequencies, setFrequencies] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedColorPalette, setSelectedColorPalette] = useState({});
  const handleSelectColorPalette = (key, event) => {
    setSelectedColorPalette({ key, value: event.target.value });
  };
  const [selectedFrequency, setSelectedFrequency] = useState({});
  const handleSelectFrequency = (key) => {
    setSelectedFrequency({ key, value: key });
    setSearchParams(
      (prev) => {
        prev.set('frequency', key);
        return prev;
      },
      { preventScrollReset: true }
    );
  };


  useEffect(() => {
    if(timeArray !== null){
      (async () => {
        await get(timeArray, [0])
          .then((d1) => {
            console.log(d1);
          });
      })();
    }
    if(frequencyArray !== null){
      (async () => {
        await get(frequencyArray, [slice(null)])
          .then((f1) => {
            let allFrequencies = []
            f1.data.forEach(function (i) { // convert BigUInts to Numbers
              var h = Number(i);
              allFrequencies.push({
                key: h,
                value: h,
              });
            });
            setFrequencies(allFrequencies);
            setSelectedFrequency(allFrequencies[0]);
            setLoading(false);
            // history.push('?color=blue');
          });
      })();
    }
    if(latitudeArray !== null){
      (async () => {
        await get(latitudeArray, [0])
          .then((la) => {
            console.log(la.data);
          });
      })();
    }
    if(longitudeArray !== null){
      (async () => {
        await get(longitudeArray, [0])
          .then((lo) => {
            console.log(lo.data);
          });
      })();
    }
  }, [timeArray, frequencyArray, latitudeArray, longitudeArray])

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
            {queryParameters.ship} <font color="#00CC33">/</font>{" "}
            {queryParameters.cruise} <font color="#00CC33">/</font>{" "}
            {queryParameters.sensor}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <MiniMapView />

          <br />
          <p>
            <b>Ship:</b>
            <span className="font-monospace float-end">{queryParameters.ship}</span>
          </p>
          <p>
            <b>Cruise:</b>
            <span className="font-monospace float-end">{queryParameters.cruise}</span>
          </p>
          <p>
            <b>Sensor:</b>
            <span className="font-monospace float-end">{queryParameters.sensor}</span>
          </p>
          <p>
            <b>Time:</b>{" "}
            <span className="font-monospace float-end"><font color="#6699CC">2025-03-06</font>T<font color="#6699CC">16:13:30</font>Z</span>
            {/* <span className="font-monospace">{get(timeArray, 1)}</span> */}
          </p>
          <p>
            <b>Lon/Lat:</b>{" "}
            <span className="font-monospace float-end">-117.3714° E, 32.7648° N</span>
          </p>
          <p>
            <b>Depth:</b>
            <span className="font-monospace float-end"><font color="#6699CC">123 meters</font></span>
          </p>
          <p>
            <b>Selected Sv:</b>{" "}
            <span className="font-monospace float-end">-70.11 dB</span>
          </p>
          <p>
            <b>Calibration Status:</b>
            <span className="font-monospace float-end"><i>{calibrationStatus ? "Calibrated" : "Not Calibrated"}</i></span>
          </p>

          <br />

          <Dropdown onSelect={handleSelectFrequency}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="btn-sm float-end">
              Frequency
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {frequencies.map((item, index) => {
                return (
                  <Dropdown.Item key={index} eventKey={item.key}>
                    {item.value}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <p>
            <b>Frequency:</b>{" "}
            <span className="font-monospace">{selectedFrequency?.key / 1000} kHz</span>
          </p>

          <br />

          <Dropdown onSelect={handleSelectColorPalette}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" className="btn-sm float-end">
              Color Map
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {colorPalettes.map((item, index) => {
                return (
                  <Dropdown.Item key={index} eventKey={item.key}>
                    {item.value}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <p>
            <b>Color Map:</b>{" "}
            <span className="font-monospace">{selectedColorPalette?.key || colorPalettes[0].key}</span>
          </p>

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
                placeholder="-100"
                name="minDB"
              />
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="maxDB"
            >
              <Form.Label>Maximum (dB)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                name="maxDB"
              />
            </Form.Group>
          </Row>
          <br />

          <hr />
          <p><b>Data Access:</b></p>
          <p>
            <b>Level 0:</b>
            <span className="font-monospace float-end">
              <a href="https://noaa-wcsd-pds.s3.amazonaws.com/index.html#data/raw/Henry_B._Bigelow/HB0707/EK60/" target="_blank" rel="noopener noreferrer">
                Raw Files
              </a>
            </span>
          </p>
          <p>
            <b>Level 1:</b>
            <span className="font-monospace float-end">
              <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/Henry_B._Bigelow/HB0707/EK60/" target="_blank" rel="noopener noreferrer">
                File-level Zarr stores
              </a>
            </span>
          </p>
          <p>
            <b>Level 2:</b>
            <span className="font-monospace float-end">
              <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/Henry_B._Bigelow/HB0707/EK60/" target="_blank" rel="noopener noreferrer">
                Cruise-level Zarr store
              </a>
            </span>
          </p>
          
          <br />
          <hr />
          
          <p><b>Processing Software:</b></p>
          <p>
            <b>name:</b>
            <span className="float-end softwareName">{processingSoftwareName}</span>
          </p>
          <p>
            <b>Date:</b>
            <span className="font-monospace float-end">{processingSoftwareTime}</span>
          </p>
          <p>
            <b>Version:</b>
            <span className="font-monospace float-end">v{processingSoftwareVersion}</span>
          </p>
          <br />
          <hr />
          <p className="text-center">~</p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default InformationPanel;

InformationPanel.propTypes = {
  queryParameters: PropTypes.instanceOf(Object),
  calibrationStatus: PropTypes.instanceOf(String),
  processingSoftwareName: PropTypes.instanceOf(String),
  processingSoftwareTime: PropTypes.instanceOf(String),
  processingSoftwareVersion: PropTypes.instanceOf(String),

  timeArray: PropTypes.instanceOf(Object),
  latitudeArray: PropTypes.instanceOf(Object),
  longitudeArray: PropTypes.instanceOf(Object),
  frequencyArray: PropTypes.instanceOf(Object), // Number?
  // depthIndices: PropTypes.instanceOf(String),
  // timeIndices: PropTypes.instanceOf(String),
  // frequencyIndices: PropTypes.instanceOf(String),
};
