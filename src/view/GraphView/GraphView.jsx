import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GraphCard from "./GraphCard";
import CardGroup from 'react-bootstrap/CardGroup';
import GraphForm from "./GraphForm";
import GraphPlot from "./GraphPlot";

export default function GraphView() {
  useEffect(() => {
    document.title = `EchoFish Knowledge Graph`;
  }, []);

  return (
    <div className="GraphView">
      <Container>
        <br />
        <Row>
          <Col md={6}>
            <GraphPlot />
          </Col>
          <Col md={6}>
            <GraphForm />
          </Col>
        </Row>

        <br />
        <CardGroup>
          <GraphCard classification="AH School"/>
          <GraphCard />
          <GraphCard classification="unclassified" />
          <GraphCard />
          <GraphCard classification="unclassified" />
          <GraphCard />
          <GraphCard classification="AH School"/>
          <GraphCard />
        </CardGroup>

        <br />
      </Container>
      <br />
      <br />
    </div>
  );
}
