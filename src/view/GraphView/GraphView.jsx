import { useEffect, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";
// import Image from "react-bootstrap/Image";
// import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import GraphCard from "./GraphCard";
import CardGroup from 'react-bootstrap/CardGroup';

// Would like to get this example working:
// https://github.com/vasturiano/react-force-graph/blob/master/example/text-nodes/index-3d.html
// Using code from here:
// https://codesandbox.io/p/sandbox/react-l6tnvc?file=%2Fsrc%2FApp.js%3A21%2C7-42%2C9
export default function GraphView() {
  useEffect(() => {
    document.title = `Knowledge Graph`;
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
          <br />
            <p className="text-center" style={{ color: "white"}}>EchoFish Meta Graph</p>
            <ForceGraph3D
              ref={fgRef}
              graphData={genRandomTree(15)}
              nodeThreeObjectExtend={true}
              width={800}
              height={400}
              // backgroundColor='#000003'
              backgroundColor="black"
              nodeAutoColorBy="group"
              nodeLabel="id"
              //
              nodeRelSize={6}
              linkDirectionalArrowLength={5}
              linkDirectionalArrowRelPos={1}
              // nodeCanvasObjectMode={() => "after"}
              // nodeThreeObject
              nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id;
                const fontSize = 24 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "white"; //node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.fillText(label, node.x, node.y, 10);
              }}
              linkCurvature={0.025}
              // bloomPass={bloomPass}
            />
          </Col>
          <Col md={4}>
            <br />
            <p style={{ color: "white" }}>Query the Knowledge Graph</p>
            <Form.Select aria-label="Default select example">
              <option>Phase of the Day</option>
              <option value="1">Night</option>
              <option value="2">Dawn</option>
              <option value="3">Day</option>
              <option value="4">Dusk</option>
            </Form.Select>
            <br />
            <Form.Select aria-label="Default select example">
              <option>Classification</option>
              <option value="1">AH_School</option>
              <option value="2">Unclassified</option>
              <option value="3">fish_school</option>
              <option value="4">possible_herring</option>
            </Form.Select>
            <br />
            <div style={{ color: "white"}}>
              <Form.Label>Altitude</Form.Label>
              <Form.Range min="0" max="200" step="10" value="100" id="customRange3" />
            </div>
            <br />
            <div style={{ color: "white"}}>
              <Form.Label>Distance From the Coast</Form.Label>
              <Form.Range min="0" max="1000" step="100" value="200" id="customRange3" />
            </div>
            <br />
            <Form style={{color: "white"}}>
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Include Unknown"
                default={true}
              />
            </Form>
          </Col>
        </Row>

        <br />
        <CardGroup>
          <GraphCard />
          <GraphCard />
          <GraphCard />
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
