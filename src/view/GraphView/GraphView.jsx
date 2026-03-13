import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GraphCard from "./GraphCard";
import CardGroup from 'react-bootstrap/CardGroup';
import GraphForm from "./GraphForm";
import GraphPlot from "./GraphPlot";
// import Pagination from 'react-bootstrap/Pagination';

export default function GraphView() {
  useEffect(() => { document.title = `EchoFish Knowledge Graph`; }, []);

  return (
    <div className="GraphView">
      
      <Container fluid>
        <br />
        <h1 className="text-center" style={{ color: "white", fontSize: "1.2em"}}>EchoFish Knowledge Graph</h1>
        
        <Row>
          <Col md={4}>
            <GraphForm />
          </Col>
          <Col md={8}>
            <GraphPlot />
          </Col>
        </Row>

        <Row className="mt-4">
          <CardGroup>
            <GraphCard classification="AH_School"/>
            <GraphCard />
            <GraphCard classification="unclassified" />
            <GraphCard />
            <GraphCard classification="unclassified" />
            <GraphCard />
            <GraphCard classification="AH_School"/>
            <GraphCard />
          </CardGroup>
        </Row>
        <br />
        {/* <Pagination>{items}</Pagination> */}

        <br />
      </Container>
      <br />
      <br />
    </div>
  );
}
