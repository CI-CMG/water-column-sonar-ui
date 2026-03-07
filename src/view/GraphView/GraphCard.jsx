import { useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";

export default function GraphCard() {
  return (
    <div className="GraphCard">
      <Card style={{ width: "18rem" }} className="mx-auto">
        <Card.Img
          variant="top"
          src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/1d4b073ae6dda69972e42d4f707134640c1897c63b04c620d355dc527f7ef4ed.jpeg"
        />
        <Card.Body>
          <Card.Title className="text-center">fish_school</Card.Title>
          <Card.Text className="text-center">
            Henry_B._Bigelow / HB1906 / EK60
            <br />
            2025-02-06 10:50:00 / 2025-02-06 10:51:00
            <br />
            depth: [11.12, 13.14]
            <br />
            altitude: 1.23 m<br />
            gps: -69.80750° E, 41.79967° N<br />
            distance from coast: 250 m<br />
            local time: 2019-09-25T10:02:06.60
            <br />
            solar altitude: 35.02°
            <br />
            phase of day: day
            <br />
            <Link
              to="/water-column?ship=Henry_B._Bigelow&cruise=HB1906&sensor=EK60&frequency=0&color=2&time=3974082"
              target="_blank"
            >
              View in the water column →
            </Link>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
