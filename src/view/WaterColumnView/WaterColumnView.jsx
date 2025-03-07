import { useEffect, useState } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import queryString from "query-string";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import { CRS } from "leaflet";
// import {
//   HTTPStore,
//   openArray, // ZarrArray, slice,
// } from "zarr";
import * as zarr from "zarrita";
// import { get } from "zarrita";
import { get } from "@zarrita/ndarray"; // https://www.npmjs.com/package/zarrita


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
//   return `https://${bucketName}.s3.us-east-1.amazonaws.com/level_2/${ship}/${cruise}/${sensor}/${cruise}.zarr`;
// };

// function loadZarr() {
//   debugger;
//   const store = new HTTPStore(zarrStoreUrl);
//   const depthPromise = openArray({ store, path: "depth", mode: "r" });
//   const timePromise = openArray({ store, path: "time", mode: "r" });
//   const latitudePromise = openArray({ store, path: "latitude", mode: "r" });
//   const longitudePromise = openArray({ store, path: "longitude", mode: "r" });
//   const svPromise = openArray({ store, path: "Sv", mode: "r" });
//   Promise.all([
//     depthPromise,
//     timePromise,
//     latitudePromise,
//     longitudePromise,
//     svPromise,
//   ])
//     .then(
//       ([
//         depthArray1,
//         timeArray1,
//         latitudeArray1,
//         longitudeArray1,
//         svArray1,
//       ]) => {
//         depthArray.value = depthArray1;
//         timeArray.value = timeArray1;
//         latitudeArray.value = latitudeArray1;
//         longitudeArray.value = longitudeArray1;
//         svArray.value = svArray1;
//       }
//     )
//     .then(() => {
//       console.log('the then')
//       // drawTiles();
//       // const latlon = new LatLng(0, storeIndex.value);
//     })
//     .then(() => {
//       console.log('the other then')
//       // moveend();
//     });
// }

async function loadZarrNew() {
  // debugger;
  // let latitudeArray;
  // https://noaa-wcsd-zarr-pds.s3.amazonaws.com/level_2/Henry_B._Bigelow/HB0707/EK60/HB0707.zarr/latitude/
  // https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/Henry_B._Bigelow/HB0707/EK60/HB0707.zarr/latitude/
  const store = new zarr.FetchStore("https://noaa-wcsd-zarr-pds.s3.amazonaws.com/level_2/Henry_B._Bigelow/HB0707/EK60/HB0707.zarr/latitude/");
  const latitudePromise = zarr.open.v2(store, { kind: "array" });

  Promise.all([latitudePromise])
    .then(
      ([latitudeArr]) => {
        const foo = get(latitudeArr, [zarr.slice(2, 4)])
        Promise.all([foo])
          .then(
            ([values]) => {
                console.log(values.data);
            }
          )
      }
    )

    // .then((latitudeArray) => {
    //   console.log(zarr.get(latitudeArray, [0, 10]));
    // })
    // .then(() => {
    //   console.log('the other then')
    // });
}

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
  const [zarrLoaded, setZarrLoaded] = useState(false);

  const [show, setShow] = useState(false); // https://react-bootstrap.netlify.app/docs/components/offcanvas
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true); // TODO: move these to offcanvas component

  const { search } = useLocation();
  const values = queryString.parse(search);

  useEffect(() => {
    if(!zarrLoaded){
      setZarrLoaded(true);

      loadZarrNew();

      console.log('should only run once')
    }

  }, [zarrLoaded]);

  return (
    <div className="WaterColumnView">
      <MapContainer {...mapParameters} className="Map">
        <TileLayer
          className="Map z-0"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>

      {/* Offcanvas control */}
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={handleShow}
        className="legend z-9999"
      >
        Cruise Information
      </Button>
      {/* To nest offcanvas in div https://codepen.io/rvanlaak/pen/dympKXQ */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        scroll
        backdrop={false}
        offcanvas-width={50}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {values.ship} <font color="grey">/</font> {values.cruise} <font color="grey">/</font> {values.sensor}
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
            <b>Status:</b> Calibrated
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
          <p>
            <b>Raw Data:</b>
            <br />
            <a href="https://noaa-wcsd-pds.s3.amazonaws.com/index.html#data/raw/Henry_B._Bigelow/HB0707/EK60/">Level 0 — Raw Files</a>
            <br />
            <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_1/Henry_B._Bigelow/HB0707/EK60/">Level 1 — File-level Zarr stores</a>
            <br />
            <a href="https://noaa-wcsd-zarr-pds.s3.amazonaws.com/index.html#level_2/Henry_B._Bigelow/HB0707/EK60/HB0707.zarr/">Level 2 — Cruise-level Zarr store</a>
          </p>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
