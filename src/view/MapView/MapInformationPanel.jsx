// import { useState } from "react";
// import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";

// import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
// import { round } from "@turf/helpers";
// import Card from "react-bootstrap/Card";
// import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";

// import Col from "react-bootstrap/Col";
// import Row from "react-bootstrap/Row";
// import Toast from "react-bootstrap/Toast";
import {
  selectShowInfoPanel,
  updateShowInfoPanel,
  selectGeospatialIndex,
  // geospatialIndexStatus,
  selectGeospatialIndexStatus,
  //
  selectShip,
  selectCruise,
  selectSensor,
  //
  selectShipHovered,
  selectCruiseHovered,
  selectSensorHovered,
  //
} from "../../reducers/store/storeSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const all_cruises = [
  "HB0706",
  "HB0707",
  "HB0710",
  "HB0711",
  "HB0802",
  "HB0803",
  "HB0805",
  "HB0806",
  "HB0807",
  "HB0901",
  "HB0902",
  "HB0903",
  "HB0904",
  "HB0905",
  "HB1002",
  "HB1006",
  "HB1102",
  "HB1103",
  "HB1105",
  "HB1201",
  "HB1206",
  "HB1301",
  "HB1303",
  "HB1304",
  "HB1401",
  "HB1402",
  "HB1403",
  "HB1405",
  "HB1501",
  "HB1502",
  "HB1503",
  "HB1506",
  "HB1507",
  "HB1601",
  "HB1603",
  "HB1604",
  "HB1701",
  "HB1702",
  "HB1801",
  "HB1802",
  "HB1803",
  "HB1804",
  "HB1805",
  "HB1806",
  "HB1901",
  "HB1902",
  "HB1903",
  "HB1904",
  "HB1906",
  "HB1907",
  "HB2001",
  "HB2006",
  "HB2007",
  "HB20ORT",
  "HB20TR",
];

// const MapInformationPanel = ({
//   ship,
//   cruise,
//   sensor,
// }) => {
const MapInformationPanel = () => {
  // TODO: move these to redux
  const dispatch = useAppDispatch();
  const showInfoPanel = useAppSelector(selectShowInfoPanel);
  const geospatialIndex = useAppSelector(selectGeospatialIndex);
  const geospatialIndexStatus = useAppSelector(selectGeospatialIndexStatus);

  const ship = useAppSelector(selectShip);
  const cruise = useAppSelector(selectCruise);
  const sensor = useAppSelector(selectSensor);

  const shipHovered = useAppSelector(selectShipHovered);
  const cruiseHovered = useAppSelector(selectCruiseHovered);
  const sensorHovered = useAppSelector(selectSensorHovered);

  const handleClose = () => dispatch(updateShowInfoPanel(false));
  const handleShow = () => dispatch(updateShowInfoPanel(true));

  const listItems = all_cruises.map((cruise) => (
    <div className="p-2" key={cruise}>
      Henry_B._Bigelow / {cruise} / EK60
    </div>
  ));

  return (
    <div className="MapInformationPanel">
      <Button
        variant="dark"
        onClick={handleShow}
        className="legend"
        style={{ zIndex: 999 }}
        size="sm"
      >
        Cruise Information
      </Button>

      <Offcanvas
        show={showInfoPanel}
        onHide={handleClose}
        scroll
        backdrop={false}
        placement="end"
        className="MapInformationPanelOffcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Cruise Information</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* { (latitude && longitude) (
              <>
                <p>
                  <b>Latitude:</b>
                  <span className="font-monospace float-end">
                    {round(latitude, 5)}° N,{" "}
                    {round(longitude, 5)}° E
                  </span>
                </p>
              </>
            )
          } */}

          <p>
            <b>Last Hovered:</b>
          </p>
          <p>
            Ship:
            {shipHovered && cruiseHovered && sensorHovered ? (
              <>
                <span className="font-monospace float-end">{shipHovered}</span>
              </>
            ) : (
              <span className="font-monospace float-end">...</span>
            )}
          </p>

          <p>
            Cruise:
            <span className="font-monospace float-end">{cruiseHovered}</span>
          </p>

          <p>
            Sensor:
            <span className="font-monospace float-end">{sensorHovered}</span>
          </p>

          <hr />

          <p>
            <b>Last Clicked:</b>
          </p>
          <p>
            Ship:
            {ship ? (
              <>
                <span className="font-monospace float-end">{ship}</span>
              </>
            ) : (
              <span className="font-monospace float-end">...</span>
            )}
          </p>

          <p>
            Cruise:
            <span className="font-monospace float-end">{cruise}</span>
          </p>

          <p>
            Sensor:
            <span className="font-monospace float-end">{sensor}</span>
          </p>

          {geospatialIndex === null && geospatialIndexStatus !== "loading" ? (
            <></>
          ) : (
            <>
              {geospatialIndexStatus === "loading" ? (
                <>
                  <center>
                    <Spinner animation="grow" />
                  </center>
                  <br />
                  <p className="text-center">
                    Finding geospatial index for point clicked...
                  </p>
                </>
              ) : (
                <>
                  <p className="text-center">
                    <Link
                      to={`/water-column?ship=${ship}&cruise=${cruise}&sensor=${sensor}&frequency=0&color=2&time=${geospatialIndex}`}
                    >
                      → View Echogram
                    </Link>
                  </p>
                  <p className="text-center">
                    Nearest ping time index: {geospatialIndex}
                  </p>
                </>
              )}
            </>
          )}

          {/* <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Filter Cruises"
                disabled
              />
            </Form.Group>
          </Form>
          <br />

          <b>Ship / Cruise / Instrument:</b>
          <br />
          <br />
          <Stack gap={3}>{listItems}</Stack> */}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default MapInformationPanel;

MapInformationPanel.propTypes = {
  ship: PropTypes.instanceOf(String).isRequired,
  cruise: PropTypes.instanceOf(String).isRequired,
  sensor: PropTypes.string.isRequired,
  // latitude: PropTypes.number,
  // longitude: PropTypes.number,
};
