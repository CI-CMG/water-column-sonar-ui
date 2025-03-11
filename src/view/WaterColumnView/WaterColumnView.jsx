import {
  useEffect,
  useState,
  useRef
} from "react";

import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import queryString from "query-string";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

import { useLocation } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  useMap,
  LayersControl,
} from "react-leaflet";
// import { useLeafletContext } from '@react-leaflet/core';
import {
  CRS,
  GridLayer,
  L,
} from "leaflet";
import * as zarr from "zarrita";
import { get } from "@zarrita/ndarray"; // https://www.npmjs.com/package/zarrita
import CustomLayer from "./CustomLayer";


import MiniMapView from "./MiniMapView";

// const bucketName = "noaa-wcsd-zarr-pds";
// const shipName = "Henry_B._Bigelow";
// const cruiseName = "HB0707";
// const sensorName = "EK60";
// https://www.echo.fish/view/echofish/cruise/David_Starr_Jordan/DS0604/EK60/104377/447/38000
// ?ship=Henry_B._Bigelow&cruise=HB0707&sensor=EK60&x=100&y=200&frequency=38000
// const time_index = 100;
// const frequency = 38000; // TODO: embed these as query parameters that define what data we are looking at

// const zarrStoreUrl = (ship, cruise, sensor) => {
// //   return `https://${bucketName}.s3.us-east-1.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr`;
//   return "https://noaa-wcsd-zarr-pds.s3.amazonaws.com/level_2/Henry_B._Bigelow/HB0707/EK60/HB0707.zarr/";
// };


const mapParameters = {
  crs: CRS.Simple,
  zoom: 0,
  center: [0, 0],
  minZoom: 0,
  maxZoom: 0,
  zoomControl: false,
};

// http://localhost:5173/water-column?ship=Henry_B._Bigelow&cruise=HB0706
export default function WaterColumnView() {
  const [map, setMap] = useState(null);
  // const context = useLeafletContext();

  const { search } = useLocation();
  const values = queryString.parse(search);

  const [zarrLoaded, setZarrLoaded] = useState(false);

  const [calibrationStatus, setCalibrationStatus] = useState(null);
  const [processingSoftwareName, setProcessingSoftwareName] = useState(null);
  const [processingSoftwareTime, setProcessingSoftwareTime] = useState(null);
  const [processingSoftwareVersion, setProcessingSoftwareVersion] = useState(null);


  const [depthArray, setDepthArray] = useState(null);
  const [timeArray, setTimeArray] = useState(null);
  const [frequencyArray, setFrequencyArray] = useState(null);
  const [latitudeArray, setLatitudeArray] = useState(null);
  const [longitudeArray, setLongitudeArray] = useState(null);
  const [svArray, setSvArray] = useState(null);
  const [depthIndices, setDepthIndices] = useState(null);
  const [timeIndices, setTimeIndices] = useState(null);
  const [frequencyIndices, setFrequencyIndices] = useState(null);
  const [chunkShape, setChunkShape] = useState(null);

  const [show, setShow] = useState(false); // https://react-bootstrap.netlify.app/docs/components/offcanvas
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true); // TODO: move these to offcanvas component

  function loadZarr() {
    const storePromise = zarr.withConsolidated(
      new zarr.FetchStore(
        `https://noaa-wcsd-zarr-pds.s3.amazonaws.com/level_2/${values.ship}/${values.cruise}/${values.sensor}/${values.cruise}.zarr/`
      )
    );

    storePromise // need to store the time/latitude/longitude/Sv/depth arrays for iterative use
      .then((storePromise) => {
        return zarr.open.v2(storePromise, { kind: "group" });
      })
      .then((rootPromise) => {
        setCalibrationStatus(rootPromise.attrs.calibration_status);

        setProcessingSoftwareName(rootPromise.attrs.processing_software_name);
        setProcessingSoftwareTime(rootPromise.attrs.processing_software_time);
        setProcessingSoftwareVersion(rootPromise.attrs.processing_software_version);

        const depthPromise = zarr.open(rootPromise.resolve("depth"), {
          kind: "array",
        });
        const timePromise = zarr.open(rootPromise.resolve("time"), {
          kind: "array",
        });
        const frequencyPromise = zarr.open(rootPromise.resolve("frequency"), {
          kind: "array",
        });
        const latitudePromise = zarr.open(rootPromise.resolve("latitude"), {
          kind: "array",
        });
        const longitudePromise = zarr.open(rootPromise.resolve("longitude"), {
          kind: "array",
        });
        const svPromise = zarr.open(rootPromise.resolve("Sv"), {
          kind: "array",
        });

        Promise.all([
          depthPromise,
          timePromise,
          frequencyPromise,
          latitudePromise,
          longitudePromise,
          svPromise,
        ]).then(
          ([
            depthArray,
            timeArray,
            frequencyArray,
            latitudeArray,
            longitudeArray,
            svArray,
          ]) => {
            setDepthArray(depthArray);
            setTimeArray(timeArray);
            setFrequencyArray(frequencyArray);
            setLatitudeArray(latitudeArray);
            setLongitudeArray(longitudeArray);
            setSvArray(svArray);
          }
        );
      });
  }

  useEffect(() => {
    if (!zarrLoaded) {
      setZarrLoaded(true);
      loadZarr();
    }
  }, []);

  useEffect(() => {
    if (
      depthArray !== null &&
      timeArray !== null &&
      frequencyArray !== null &&
      latitudeArray !== null &&
      longitudeArray !== null &&
      svArray !== null
    ) {
      console.log(depthArray);
      console.log(timeArray);
      console.log(frequencyArray);
      console.log(latitudeArray);
      // const latitudeSlice = get(latitudePromise, [zarr.slice(2, 4)]);
      console.log(longitudeArray);
      console.log(svArray);

      const svArrayShape = svArray.shape;
      setDepthIndices(svArrayShape[0]);
      setTimeIndices(svArrayShape[1]);
      setFrequencyIndices(svArrayShape[2]);
      setChunkShape(svArray.chunks);
    }
  }, [
    depthArray,
    timeArray,
    frequencyArray,
    latitudeArray,
    longitudeArray,
    svArray,
  ]);

  useEffect(() => {
    if (map) {
      // debugger;
      // https://javascript.plainenglish.io/creating-an-ellipse-in-react-leaflet-72e2c5beff03
      // const container = context.layerContainer || context.map
      // // const circle = new L.circle([0, 0], 10, { color: 'blue', fillColor: 'red' });
      // // container.addLayer(circle)
      // // const gridLayer = new L.GridLayer.extend({})
      // L.GridLayer.DebugCoords = L.GridLayer.extend({
      //   createTile: function (coords) {
      //       var tile = document.createElement('div');
      //       tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
      //       tile.style.outline = '1px solid red';
      //       return tile;
      //   }
      // });
      // L.gridLayer.debugCoords = function(opts) {
      //     return new L.GridLayer.DebugCoords(opts);
      // };
      // container.addLayer( L.gridLayer.debugCoords() );

      console.log('map exists')
    }
  }, [map]);

  return (
    <div className="WaterColumnView">
      <MapContainer {...mapParameters} className="Map" ref={setMap}>
        {/* <TileLayer
          className="Map z-0"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <LayersControl>
          <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LayersControl.Overlay checked name="Pluscode Grid">
            <CustomLayer />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>

      <Button
        variant="outline-secondary"
        size="sm"
        onClick={handleShow}
        className="legend z-9999"
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
            {values.ship} <font color="#00CC33">/</font> {values.cruise}{" "}
            <font color="#00CC33">/</font> {values.sensor}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <center>
            <MiniMapView />
          </center>

          <br />

          <p>
            <b>Ship:</b> {values.ship}
          </p>
          <p>
            <b>Cruise:</b> {values.cruise}
          </p>
          <p>
            <b>Sensor:</b> {values.sensor}
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
            <b>Calibration Status:</b> {calibrationStatus ? "Calibrated": "Not Calibrated"}
          </p>
          <p>
            <b>Frequency:</b> {values.frequency} Hz
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
          <p><b>Raw Data Downloads:</b></p>
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

          <br />
          <p><b>Processing Information:</b></p>
          <p><b>Software</b>: {processingSoftwareName}</p>
          <p><b>Date</b>: {processingSoftwareTime}</p>
          <p><b>Version</b>: {processingSoftwareVersion}</p>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
