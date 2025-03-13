import {
  useState,
} from "react";

import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import MiniMapView from "./MiniMapView";

const InformationPanel = ({
  queryParameters,
  calibrationStatus,
  processingSoftwareName,
  processingSoftwareTime,
  processingSoftwareVersion,
  depthIndices,
  timeIndices,
  frequencyIndices,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            {queryParameters.ship}
            {" "}
            <font color="#00CC33">/</font>
            {" "}
            {queryParameters.cruise}
            {" "}
            <font color="#00CC33">/</font>
            {" "}
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
          <p>
            <b>Frequency:</b> {queryParameters.frequency} Hz
          </p>
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              className="btn-sm"
            >
              Frequency
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">18 kHz</Dropdown.Item>
              <Dropdown.Item className="active" href="#">
                38 kHz
              </Dropdown.Item>
              <Dropdown.Item href="#">70 kHz</Dropdown.Item>
              <Dropdown.Item href="#">120 kHz</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <hr />

          <p>
            <b>Color Map:</b> Viridis
          </p>
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              className="btn-sm"
            >
              Color Map
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">ek80</Dropdown.Item>
              <Dropdown.Item className="active" href="#">
                ek500
              </Dropdown.Item>
              <Dropdown.Item href="#">viridis</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <br />

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

  depthIndices: PropTypes.instanceOf(String),
  timeIndices: PropTypes.instanceOf(String),
  frequencyIndices: PropTypes.instanceOf(String),
};
