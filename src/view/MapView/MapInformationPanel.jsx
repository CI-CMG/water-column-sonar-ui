import { useState } from "react";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";

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

const MapInformationPanel = ({
  ship,
  cruise,
  sensor,
  // latitude,
  // longitude,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      >
        Cruise Information
      </Button>
      <Offcanvas
        show={show}
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
          <p>
            <b>Selected Ship:</b>
            <span className="font-monospace float-end">{ship}</span>
          </p>
          <p>
            <b>Selected Cruise:</b>
            <span className="font-monospace float-end">{cruise}</span>
          </p>
          <p>
            <b>Selected Sensor:</b>
            <span className="font-monospace float-end">{sensor}</span>
          </p>

          <hr />

          {/* <Card
            bg="Light"
            text='dark'
            className="mb-2"
            border="dark"
          >
            <Card.Header>HB0707</Card.Header>
            <Card.Body>
              <Card.Text>
                Ship: Henry_B._Bigelow
                <br />
                Sensor: EK60
                <br />
              </Card.Text>
              <Button size="sm" variant="dark">View Cruise</Button>
            </Card.Body>
          </Card>
          <hr /> */}

          <Form>
            <Form.Group controlId="exampleForm.ControlInput1">
              {/* <Form.Label size="sm">Search Cruises</Form.Label> */}
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
          <Stack gap={3}>{listItems}</Stack>
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
  // latitude: PropTypes.instanceOf(Number),
  // longitude: PropTypes.instanceOf(Number),
};
