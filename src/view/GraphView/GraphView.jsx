import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GraphForm from "./GraphForm";
import GraphPlot from "./GraphPlot";
import GraphList from "./GraphList";
import { useAppSelector } from "../../app/hooks";
import {
  selectSearchPhaseOfDay,
  selectSearchClassification,
  selectSearchDistanceFromCoastline,
  selectSearchAltitude,
} from "../../reducers/store/storeSlice";

export default function GraphView() {
  useEffect(() => { document.title = `EchoFish Knowledge Graph`; }, []);

  const altitude = useAppSelector(selectSearchAltitude);
  const distanceFromCoastline = useAppSelector(selectSearchDistanceFromCoastline);
  const phaseOfDay = useAppSelector(selectSearchPhaseOfDay);
  const classification = useAppSelector(selectSearchClassification);

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

        <Row style={{ border: "1px solid grey" }}>
          <GraphList
            classification={classification}
            phaseOfDay={phaseOfDay}
            minAltitude={altitude[0]}
            maxAltitude={altitude[1]}
            minDistanceFromCoastline={distanceFromCoastline[0]}
            maxDistanceFromCoastline={distanceFromCoastline[1]}
          />
        </Row>
        <br />
        <br />
      </Container>

      <br /><br />
    </div>
  );
}
