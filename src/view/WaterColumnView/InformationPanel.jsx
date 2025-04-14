import {
  // React,
  useState,
  // useEffect,
} from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import MiniMapView from "./MiniMapView";
// import { get } from "@zarrita/ndarray";
// import { get, slice } from "zarrita";

// color palette selected for the water column visualization
const colorPalettes = [
  { key: "EK80", value: "EK80" },
  { key: "EK500", value: "EK500" },
  { key: "Viridis", value: "Viridis" },
  { key: "Red-Blue Diverging", value: "Red-Blue Diverging" },
  { key: "Cyan-Magenta", value: "Cyan-Magenta" },
];
const frequencies = [
  { key: "18 kHz", value: "18 kHz" },
  { key: "38 kHz", value: "38 kHz" },
  { key: "70 kHz", value: "70 kHz" },
  { key: "120 kHz", value: "120 kHz" }
]


const InformationPanel = ({
  queryParameters,
  calibrationStatus,
  processingSoftwareName,
  processingSoftwareTime,
  processingSoftwareVersion,

  // frequencyArray,
  // depthIndices,
  // timeIndices,
  // frequencyIndices,
}) => {
  const [show, setShow] = useState(false);
  // const [data, setData] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedColorPalette, setSelectedColorPalette] = useState({});
  const handleSelectColorPalette = (key, event) => {
    setSelectedColorPalette({ key, value: event.target.value });
  };

  const [selectedFrequency, setSelectedFrequency] = useState({});
  const handleSelectFrequency = (key, event) => {
    setSelectedFrequency({ key, value: event.target.value });
  };

  // useEffect(() => {
  //   const loadFrequencyData = function() {
  //     get(frequencyArray, [null]).then((d) => {
  //       setData(d.data);
  //     });
  //   }

  //   if (frequencyArray) {
  //     loadFrequencyData();
  //   }
  // }, [data, frequencyArray]);

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
            <b>Ship:</b> {queryParameters.ship}
          </p>
          <p>
            <b>Cruise:</b> {queryParameters.cruise}
          </p>
          <p>
            <b>Sensor:</b> {queryParameters.sensor}
          </p>
          <p>
            <b>Time:</b>{" "}
            <span className="font-monospace">2025-03-06T16:13:30Z</span>
            {/* <span className="font-monospace">{get(timeArray, 1)}</span> */}
          </p>
          <p>
            <b>Lon/Lat:</b>{" "}
            <span className="font-monospace">-117.3714° E, 32.7648° N</span>
          </p>
          <p>
            <b>Depth:</b> 123 meters
          </p>
          <p>
            <b>Selected Sv:</b>{" "}
            <span className="font-monospace">-70.11 dB</span>
          </p>
          <p>
            <b>Calibration Status:</b>{" "}
            {calibrationStatus ? "Calibrated" : "Not Calibrated"}
          </p>

          <hr />

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
            <b>Frequency:</b> {selectedFrequency?.key || frequencies[0].key}
          </p>

          <hr />

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
            <b>Color Map:</b> {selectedColorPalette?.key || colorPalettes[0].key}
          </p>

          <hr />

          <p>
            <b>Min dB:</b> -80 dB | <b>Max dB:</b> -30 dB
          </p>
          <Form.Label>Range</Form.Label>
          <Form.Range min="-100" max="0" step="1" />

          <br />
          <p>
            <b>Raw Data Downloads:</b>
          </p>
          <p>
            <a href="https://noaa-wcsd-pds.s3.amazonaws.com/index.html#data/raw/Henry_B._Bigelow/HB0707/EK60/">
              Level 0 — Raw Files
            </a>
            <br />
            <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/Henry_B._Bigelow/HB0707/EK60/">
              Level 1 — File-level Zarr stores
            </a>
            <br />
            <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/Henry_B._Bigelow/HB0707/EK60/HB0707.zarr/">
              Level 2 — Cruise-level Zarr store
            </a>
          </p>

          <hr />

          <p>
            <b>Processing Software</b>: {processingSoftwareName}
          </p>
          <p>
            <b>Date</b>: {processingSoftwareTime}
          </p>
          <p>
            <b>Version</b>: {processingSoftwareVersion}
          </p>
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

  frequencyArray: PropTypes.instanceOf(Object),
  // depthIndices: PropTypes.instanceOf(String),
  // timeIndices: PropTypes.instanceOf(String),
  // frequencyIndices: PropTypes.instanceOf(String),
};
