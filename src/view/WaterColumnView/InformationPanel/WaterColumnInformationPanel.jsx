import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import MiniMapView from "../MiniMapView.jsx";
import ColorMap from "../ColorMap.jsx";
// import TimeAxis from "./Axes/TimeAxis.jsx";
import SvPlotView from "../SvPlotView.jsx";
// import { HuePicker } from 'react-color';
import AnnotationColors from "./AnnotationColors.jsx"
import {
  selectShip,
  selectCruise,
  selectSensor,
  selectSvMin,
  selectSvMax,
  updateSvMin,
  updateSvMax,
  //
  selectColorMaps,
  selectColorIndex,
  updateColorIndex,
  //
  selectAnnotation,
  updateAnnotation,
  // selectAnnotationColor,
  // updateAnnotationColor,
  //
  // selectDepthIndex,
  // selectTimeIndex,
  // selectFrequencyIndex,
  //
  selectStoreAttributes,
  selectStoreShape,
  selectFrequencies, // all the values
  // selectFrequencyButtonIndex,
  selectFrequencyIndex,
  // updateFrequencyButtonIndex,
  updateFrequencyIndex,
  selectLatitude, // uses clicked index
  selectLatitudeStatus,
  selectLongitude,
  selectLongitudeStatus,
  //
  selectTime,
  selectDepth,
  //
  selectDepthMinIndex,
  selectDepthIndex,
  selectDepthMaxIndex,
  //
  selectTimeMinIndex,
  selectTimeIndex,
  selectTimeMaxIndex,
  //
  selectBottom,
  selectSv,
} from "../../../reducers/store/storeSlice.ts";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
// import { TbLocation } from "react-icons/tb";
// import { TbClockHour9 } from "react-icons/tb";
// import { MdOutlineAnchor } from "react-icons/md";
// import { TbCrosshair } from "react-icons/tb";
// import { TfiRuler } from "react-icons/tfi";
// import { RiCompasses2Line } from "react-icons/ri";
// import { LuAudioWaveform } from "react-icons/lu";
// import { IoIosColorFilter } from "react-icons/io";
// import { PiSailboat } from "react-icons/pi";
// import { TbRoute } from "react-icons/tb";
// import { MdLeakAdd } from "react-icons/md";
import Spinner from 'react-bootstrap/Spinner';


const getDateTime = function (epochSeconds, timezone) {
  // timezone='Etc/UTC'
  const tempDate = new Date(0);
  tempDate.setUTCMilliseconds(epochSeconds * 1000);
  return `${tempDate.toISOString().substring(0, 19)}Z`;
};

const WaterColumnInformationPanel = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();

  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);
  const colorMaps = useAppSelector(selectColorMaps); // from store
  const annotation = useAppSelector(selectAnnotation);
  // const annotationColor = useAppSelector(selectAnnotationColor);
  const colorIndex = useAppSelector(selectColorIndex); //
  const attributes = useAppSelector(selectStoreAttributes);
  const storeShape = useAppSelector(selectStoreShape);
  const frequencies = useAppSelector(selectFrequencies); // from store
  const frequencyIndex = useAppSelector(selectFrequencyIndex); //
  // const frequencyButtonIndex = useAppSelector(selectFrequencyButtonIndex); //
  const latitude = useAppSelector(selectLatitude); // from store
  const latitudeStatus = useAppSelector(selectLatitudeStatus);
  const longitude = useAppSelector(selectLongitude);
  const longitudeStatus = useAppSelector(selectLongitudeStatus);
  //
  const time = useAppSelector(selectTime);
  const depth = useAppSelector(selectDepth);
  //
  const depthMinIndex = useAppSelector(selectDepthMinIndex);
  const depthIndex = useAppSelector(selectDepthIndex);
  const depthMaxIndex = useAppSelector(selectDepthMaxIndex);
  const timeMinIndex = useAppSelector(selectTimeMinIndex);
  const timeIndex = useAppSelector(selectTimeIndex);
  const timeMaxIndex = useAppSelector(selectTimeMaxIndex);
  //
  const bottom = useAppSelector(selectBottom);
  const sv = useAppSelector(selectSv);
  const svMin = useAppSelector(selectSvMin);
  const svMax = useAppSelector(selectSvMax);
  // const depthIndex = useAppSelector(selectDepthIndex);
  // const timeIndex = useAppSelector(selectTimeIndex);

  const [isLoading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelectColorMap = (key) => {
    dispatch(
      updateColorIndex(Object.keys(colorMaps).findIndex((x) => x === key))
    );
    setSearchParams(
      (prev) => {
        prev.set(
          "color",
          Object.keys(colorMaps).findIndex((x) => x === key)
        );
        return prev;
      },
      { preventScrollReset: true }
    );
  };

  const handleSelectFrequency = (key) => {
    // console.log(`frequency changed to: ${Number(key)}`)
    dispatch(
      updateFrequencyIndex(frequencies.findIndex((x) => x === Number(key)))
    );
    setSearchParams(
      (prev) => {
        prev.set(
          "frequency",
          frequencies.findIndex((x) => x === Number(key))
        );
        return prev;
      },
      { preventScrollReset: true }
    );
  };

  const handleSelectAnnotation = () => {
    dispatch(updateAnnotation(!annotation));
  };

  useEffect(() => {
    if (frequencies !== null) {
      // TODO: add all constraints
      setLoading(false);
    }
  }, [frequencies]);

  const url_level_0 = `https://noaa-wcsd-pds.s3.amazonaws.com/index.html#data/raw/${ship}/${cruise}/${sensor}/`;
  const url_level_1 = `https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/${ship}/${cruise}/${sensor}/`;
  const url_level_2 = `https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/${ship}/${cruise}/${sensor}/`;

  if (isLoading) {
    return (
      <div className="WaterColumnInformationPanelLoading">
        <div className="overlay">
          <Spinner animation="grow" />
        </div>
      </div>
    );
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
            {ship} <font color="#00CC33">/</font> {cruise}{" "}
            <font color="#00CC33">/</font> {sensor}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          
          {/* TODO: move me to the main water column view and float to the bottom */}
          {/* <TimeAxis /> */}

          <MiniMapView />

          <SvPlotView />
          {/* frequencyButtonIndex replaces frequencyIndex */}

          <br />


          { (window.location.href.includes("test") || window.location.href.includes("localhost")) ? (
            <p style={{ color: 'grey' }}>
              <b>Debugging:</b>
              <span className="font-monospace float-end">[d: { depthIndex }, t: { timeIndex }, f: { frequencyIndex }]</span>
            </p>
          ) : <></> }

          {/* <PiSailboat /> */}
          <p>
            {/* TODO: change to platform? */}
            <b>Ship:</b>
            <span className="font-monospace float-end">{ship}</span>
          </p>

          {/* <TbRoute /> */}
          <p>
            <b>Cruise:</b>
            <span className="font-monospace float-end">{cruise}</span>
          </p>

          {/* <MdLeakAdd /> */}
          <p>
            <b>Instrument:</b>
            <span className="font-monospace float-end">{sensor}</span>
          </p>

          {/* <TbClockHour9 /> */}
          <p>
            <b>Time:</b>{" "}
            <span className="font-monospace float-end">
              {getDateTime(time, "Etc/UTC")}{" "}
              <span style={{ color: "#9933CC" }}>UTC</span>
            </span>
          </p>

          <p>
            <b>Ping Time:</b>{" "}
            <span className="font-monospace float-end">
              [min: {timeMinIndex}, max: {timeMaxIndex}]
            </span>
          </p>

          {/* <TbLocation /> */}
          <p>
            <b>Lon / Lat:</b>{" "}
            <span className="font-monospace float-end">
              {latitudeStatus === 'succeeded' && longitudeStatus === 'succeeded' ? (
                <>{longitude.toFixed(5)}° E, {latitude.toFixed(5)}° N</>
              ) : (
                <>...</>
              )}
            </span>
          </p>

          {/* <TfiRuler /> */}
          {depth !== null ? (
            <>
              <p>
                <b>Depth:</b>
                <span className="font-monospace float-end">
                  {depth.toFixed(1)} meters
                </span>
              </p>
              <p>
                <b>Range Depth:</b>
                <span className="font-monospace float-end">
                  <i>[min: {depthMinIndex}, max: {depthMaxIndex}]</i>
                </span>
              </p>
            </>
          ) : (
            <></>
          )}

          {/* <MdOutlineAnchor /> */}
          {bottom !== null ? (
            <p>
              <b> Bottom:</b>
              <span className="font-monospace float-end">
                {bottom.toFixed(1)} meters
              </span>
            </p>
          ) : (
            <></>
          )}

          {/* <TbCrosshair /> */}
          {sv !== null &&
          frequencyIndex !== null &&
          !isNaN(sv[frequencyIndex]) ? (
            <p>
              <b> Selected Sv:</b>{" "}
              <span className="font-monospace float-end">
                {sv[frequencyIndex].toFixed(2)} dB
              </span>
            </p>
          ) : (
            <p>
              <b>Selected Sv:</b>{" "}
              <span
                className="font-monospace float-end"
                style={{ fontSize: "14px" }}
              >
                <i>click to compute</i>
              </span>
            </p>
          )}

          {/* <RiCompasses2Line /> */}
          {attributes !== null ? (
            <p>
              <b>Calibration:</b>
              <span className="font-monospace float-end">
                <i>
                  {attributes.calibration_status
                    ? "calibrated"
                    : "not calibrated"}
                </i>
              </span>
            </p>
          ) : (
            <></>
          )}

          <div className="mt-4">
            <Dropdown onSelect={handleSelectFrequency}>
              <Dropdown.Toggle
                variant="dark"
                id="dropdown-basic"
                className="btn-sm float-end"
              >
                Frequency
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {frequencies.map((item, index) => {
                  return (
                    <Dropdown.Item key={index} eventKey={item}>
                      {item / 1000} kHz
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>

            {/* <LuAudioWaveform /> */}
            <p>
              <b>Frequency:</b>{" "}
              <span className="font-monospace">
                {frequencies[frequencyIndex] / 1000} kHz
              </span>
            </p>
          </div>

          <div className="mt-4">
            <Dropdown onSelect={handleSelectColorMap}>
              <Dropdown.Toggle
                variant="dark"
                id="dropdown-basic"
                className="btn-sm float-end"
              >
                Color Map
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.keys(colorMaps).map((item, index) => {
                  return (
                    <Dropdown.Item key={index} eventKey={item}>
                      {item}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>

            {/* <IoIosColorFilter /> */}
            <p>
              <b>Color Map:</b>{" "}
              <span className="font-monospace">
                {Object.keys(colorMaps)[colorIndex]}
              </span>
            </p>
          </div>
          <br />

          <ColorMap selectedColorPalette={Object.keys(colorMaps)[colorIndex]} />

          <br />

          <Row className="mb-3">
            <Form.Group as={Col} controlId="minDB">
              <Form.Label>Sv Minimum (dB)</Form.Label>
              <Form.Control
                type="number"
                size="sm"
                defaultValue={svMin}
                max={svMax}
                name="minDB"
                onChange={(e) => dispatch(updateSvMin(e.target.value))}
                className="w-75"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="maxDB">
              <Form.Label>Sv Maximum (dB)</Form.Label>
              <Form.Control
                type="number"
                defaultValue={svMax}
                min={svMin}
                name="maxDB"
                onChange={(e) => dispatch(updateSvMax(e.target.value))}
                className="w-75"
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group>
              <Form.Check
                type="switch"
                id="annotate-switch"
                label="Show Annotations"
                onChange={() => handleSelectAnnotation()}
                checked={annotation}
              />
            </Form.Group>
          </Row>

          <AnnotationColors />

          <br />

          <Row className="mb-3">
            <Form.Group>
              <Form.Check
                disabled
                type="switch"
                id="mask-switch"
                label="Mask Data Beneath Sea Floor"
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group>
              <Form.Check
                type="switch"
                id="ai-switch"
                label="Show AI Inference for HB1906"
              />
            </Form.Group>
          </Row>

          <hr />
          <p><b>Data Access</b></p>

          <p>
            <small>
            (see{' '}
            <a href="https://echolevels.readthedocs.io/en/latest/levels_proposed.html" target="_blank" rel="noopener noreferrer">
              processing levels
            </a>)
            </small>
          </p>

          {/* https://echolevels.readthedocs.io/en/latest/levels_proposed.html */}
          <p>
            <b>Level 0:</b>
            <span className="font-monospace float-end">
              <a href={url_level_0} target="_blank" rel="noopener noreferrer">
                Raw Files
              </a>
            </span>
          </p>
          <p>
            <b>Level 2A:</b>
            <span className="font-monospace float-end">
              <a href={url_level_1} target="_blank" rel="noopener noreferrer">
                File-level Zarr stores
              </a>
            </span>
          </p>
          <p>
            <b>Level 3A:</b>
            <span className="font-monospace float-end">
              <a href={url_level_2} target="_blank" rel="noopener noreferrer">
                Cruise-level Zarr store
              </a>
            </span>
          </p>
          <p style={{ textIndent: "6px" }}>Total Sv dimension:</p>
          <p
            style={{
              textIndent: "6px",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          >
            {storeShape[0].toLocaleString()} x {storeShape[1].toLocaleString()}{" "}
            x {storeShape[2].toLocaleString()} ={" "}
            {(storeShape[0] * storeShape[1] * storeShape[2]).toLocaleString()}
          </p>

          <br />
          <hr />

          <p>
            <b>Provenance</b>
          </p>
          {attributes ? (
            <>
              <p>
                <b>Processing:</b>
                {/* <span className="float-end softwareName">{processingSoftwareName}</span> */}
                <span className="font-monospace float-end">
                  {attributes.processing_software_name}
                </span>
              </p>
              <p>
                <b>Date:</b>
                <span className="font-monospace float-end">
                  {attributes.processing_software_time}
                </span>
              </p>
              <p>
                <b>Version:</b>
                {/* https://pypi.org/project/water_column_sonar_processing/#history */}
                <span className="font-monospace float-end">
                  <a
                    href="https://pypi.org/project/water_column_sonar_processing/#history"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    v{attributes.processing_software_version}
                  </a>
                </span>
              </p>
            </>
          ) : (
            <></>
          )}

          <p className="text-center">
            <b>~</b>
          </p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default WaterColumnInformationPanel;

WaterColumnInformationPanel.propTypes = {};
