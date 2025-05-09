import {
  useState,
  useEffect,
} from "react";
import { useSearchParams } from 'react-router';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Row from 'react-bootstrap/Row';
import Form from "react-bootstrap/Form";
import MiniMapView from "./MiniMapView.jsx";
import ColorMap from "./ColorMap.jsx";
import SvPlotView from "./SvPlotView.jsx";
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
  selectColorMapButtonIndex,
  updateColorMapButtonIndex,
  //
  selectAnnotation,
  updateAnnotation,
  //
  selectDepthIndex,
  selectTimeIndex,
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
  selectLongitude,
  selectTime,
  selectDepth,
  selectBottom,
  selectSv,
} from "../../reducers/store/storeSlice.ts";
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";

const getDateTime = function (epochSeconds, timezone) {
  // timezone='Etc/UTC'
  const tempDate = new Date(0);
  tempDate.setUTCMilliseconds(epochSeconds * 1000);
  return `${tempDate.toISOString().substring(0, 19)}Z`
};


const WaterColumnInformationPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch()

  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);
  const colorMaps = useAppSelector(selectColorMaps); // from store
  const annotation = useAppSelector(selectAnnotation);
  const colorMapButtonIndex = useAppSelector(selectColorMapButtonIndex); // 
  const attributes = useAppSelector(selectStoreAttributes);
  const storeShape = useAppSelector(selectStoreShape);
  const frequencies = useAppSelector(selectFrequencies); // from store
  const frequencyIndex = useAppSelector(selectFrequencyIndex); // 
  // const frequencyButtonIndex = useAppSelector(selectFrequencyButtonIndex); // 
  const latitude = useAppSelector(selectLatitude); // from store
  const longitude = useAppSelector(selectLongitude);
  const time = useAppSelector(selectTime);
  const depth = useAppSelector(selectDepth);
  const bottom = useAppSelector(selectBottom);
  const sv = useAppSelector(selectSv);
  const svMin = useAppSelector(selectSvMin);
  const svMax = useAppSelector(selectSvMax);
  const depthIndex = useAppSelector(selectDepthIndex);
  const timeIndex = useAppSelector(selectTimeIndex);
  
  const [isLoading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelectColorMap = (key) => {
    dispatch(updateColorMapButtonIndex(Object.keys(colorMaps).findIndex(x => x === key)));
    setSearchParams(
      (prev) => {
        prev.set('color', Object.keys(colorMaps).findIndex(x => x === key));
        return prev;
      },
      { preventScrollReset: true }
    );
  };

  const handleSelectFrequency = (key) => {
    // console.log(`frequency changed to: ${Number(key)}`)
    dispatch(updateFrequencyIndex(frequencies.findIndex(x => x === Number(key))));
    setSearchParams(
      (prev) => {
        prev.set('frequency', frequencies.findIndex(x => x === Number(key)));
        return prev;
      },
      { preventScrollReset: true }
    );
  };

  const handleSelectAnnotation = () => {
    dispatch(updateAnnotation(!annotation));
  };

  useEffect(() => {
    if(frequencies !== null){ // TODO: add all constraints
      setLoading(false);
    }
  }, [frequencies]);

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
          <MiniMapView />

          <SvPlotView />
          {/* frequencyButtonIndex replaces frequencyIndex */}

          <br />

          {/* <p style={{ color: 'hotpink' }}>
            <b>Debugging:</b>
            <span className="font-monospace float-end">[d: { depthIndex }, t: { timeIndex }, f: { frequencyIndex }]</span>
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
            <span className="font-monospace float-end">{ getDateTime(time, 'Etc/UTC') } <span style={{color: '#9933CC'}}>UTC</span></span>
          </p>

          {
            latitude !== null && longitude !== null ?
            <p>
              <b>Lon/Lat:</b>{" "}
              <span className="font-monospace float-end">{ longitude.toFixed(5) }° E, { latitude.toFixed(5) }° N</span>
            </p>
            :
            <></>
          }

          {
            depth !== null ?
            <p>
              <b>Depth:</b>
              <span className="font-monospace float-end">{ depth.toFixed(1) } meters</span>
            </p>
            :
            <></>
          }

          {
            bottom !== null ?
            <p>
              <b>Bottom:</b>
              <span className="font-monospace float-end">{ bottom.toFixed(1) } meters</span>
            </p>
            :
            <></>
          }

          {
            sv !== null && frequencyIndex !== null && !isNaN(sv[frequencyIndex]) ?
            <p>
              <b>Selected Sv:</b>{" "}
              <span className="font-monospace float-end">{ sv[frequencyIndex].toFixed(2) } dB</span>
            </p>
            :
            <p>
              <b>Selected Sv:</b>{" "}
              <span className="font-monospace float-end" style={{ fontSize: "14px" }}><i>click to see</i></span>
            </p>
          }

          {
            attributes !== null ?
            <p>
              <b>Calibration Status:</b>
              <span className="font-monospace float-end"><i>{attributes.calibration_status ? "calibrated" : "not calibrated"}</i></span>
            </p>
            :
            <></>
          }

          <div className="mt-4">
            <Dropdown onSelect={handleSelectFrequency}>
              <Dropdown.Toggle variant="dark" id="dropdown-basic" className="btn-sm float-end">
                Frequency
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {
                  frequencies.map((item, index) => {
                    return (
                      <Dropdown.Item key={index} eventKey={item}>
                        {item / 1000} kHz
                      </Dropdown.Item>
                    );
                  })
                }
              </Dropdown.Menu>
            </Dropdown>
            <p>
              <b>Frequency:</b>{" "}
              <span className="font-monospace">{frequencies[frequencyIndex] / 1000} kHz</span>
            </p>
          </div>

          <div className="mt-4">
            <Dropdown onSelect={handleSelectColorMap}>
              <Dropdown.Toggle variant="dark" id="dropdown-basic" className="btn-sm float-end">
                Color Map
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {
                  Object.keys(colorMaps).map((item, index) => {
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
              <b>Color Map:</b>{" "}
              <span className="font-monospace">{Object.keys(colorMaps)[colorMapButtonIndex]}</span>
            </p>
          </div>

          <ColorMap selectedColorPalette={Object.keys(colorMaps)[colorMapButtonIndex]}/>
          
          <br />

          <Row className="mb-3">
            <Form.Group
              as={Col}
              controlId="minDB"
            >
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

            <Form.Group
              as={Col}
              controlId="maxDB"
            >
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
              />
            </Form.Group>
          </Row>

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

          {/* <p>Min: {svMin}, Max: {svMax}</p> */}

          <hr />
          <p><b>Data Access:</b></p>
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
          <p style={{ textIndent: "6px" }}>Total Sv dimension:</p>
          <p style={{ textIndent: "6px", fontFamily: "monospace", fontSize: "14px" }}>{storeShape[0].toLocaleString()} x {storeShape[1].toLocaleString()} x {storeShape[2].toLocaleString()} = {(storeShape[0]*storeShape[1]*storeShape[2]).toLocaleString()}</p>
          
          <br />
          <hr />
          
          <p><b>Provenance:</b></p>
          {attributes ?
            <>
              <p>
                <b>name:</b>
                {/* <span className="float-end softwareName">{processingSoftwareName}</span> */}
                <span className="font-monospace float-end">{attributes.processing_software_name}</span>
              </p>
              <p>
                <b>Date:</b>
                <span className="font-monospace float-end">{attributes.processing_software_time}</span>
              </p>
              <p>
                <b>Version:</b>
                {/* https://pypi.org/project/water_column_sonar_processing/#history */}
                <span className="font-monospace float-end">
                  <a href="https://pypi.org/project/water_column_sonar_processing/#history" target="_blank" rel="noopener noreferrer">
                    v{attributes.processing_software_version}
                  </a>
                </span>
              </p>
            </>
            :
            <></>
          }

          <p className="text-center"><b>~</b></p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default WaterColumnInformationPanel;

WaterColumnInformationPanel.propTypes = {
};
