import { useEffect, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import GraphCard from "./GraphCard";
import CardGroup from 'react-bootstrap/CardGroup';
import GraphForm from "./GraphForm";
import GraphPlot from "./GraphPlot";

// Would like to get this example working:
// https://github.com/vasturiano/react-force-graph/blob/master/example/text-nodes/index-3d.html
// Using code from here:
// https://codesandbox.io/p/sandbox/react-l6tnvc?file=%2Fsrc%2FApp.js%3A21%2C7-42%2C9
export default function GraphView() {
  useEffect(() => {
    document.title = `EchoFish Knowledge Graph`;
  }, []);

  function genRandomTree(N = 10, reverse = false) {
    return {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          [reverse ? "target" : "source"]: id,
          [reverse ? "source" : "target"]: Math.floor(Math.random() * (id - 1)),
        })),
    };
  }
  const fgRef = useRef();

  useEffect(() => {
    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = 0.033;
    bloomPass.radius = 0.01;
    bloomPass.threshold = 0;
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);

  return (
    <div className="GraphView">
      <Container>
        <Row>
          {/* <Col md={3} /> */}

          <Col md={8}>
            <GraphPlot />
          </Col>
          <Col md={4}>
            <GraphForm />
          </Col>
        </Row>

        <br />
        <CardGroup>
          <GraphCard classification="AH School"/>
          <GraphCard />
          <GraphCard classification="unclassified" />
          <GraphCard />
          <GraphCard />
          <GraphCard />
          <GraphCard />
          <GraphCard />
        </CardGroup>

        <br />
      </Container>
      <br />
      <br />
    </div>
  );
}
