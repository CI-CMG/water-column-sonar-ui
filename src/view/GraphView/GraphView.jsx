import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GraphForm from "./GraphForm";
import GraphPlot from "./GraphPlot";
import GraphList from "./GraphList";

export default function GraphView() {
  useEffect(() => { document.title = `EchoFish Knowledge Graph`; }, []);

  return (
    <div className="GraphView">
      
      <Container>
        <br />
        <h1 className="text-center" style={{ color: "white", fontSize: "1.2em"}}>EchoFish Knowledge Graph</h1>
        <br />
        
        <Row>
          <Col md={4}>
            <GraphForm />
          </Col>

          <Col md={8}>
            <GraphPlot />
          </Col>
        </Row>
        
        <br />

        <Row style={{ border: "1px solid red" }}>
          <GraphList />
        </Row>
      </Container>

      <br /><br />
    </div>
  );
}
