import { useEffect, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";
// import Image from "react-bootstrap/Image";
// import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

// Would like to get this example working:
// https://github.com/vasturiano/react-force-graph/blob/master/example/text-nodes/index-3d.html
// Using code from here:
// https://codesandbox.io/p/sandbox/react-l6tnvc?file=%2Fsrc%2FApp.js%3A21%2C7-42%2C9
export default function GraphView() {
  useEffect(() => {
    document.title = `Graph`;
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
    bloomPass.strength = 0.1;
    bloomPass.radius = 0.1;
    bloomPass.threshold = 0;
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);

  return (
    <div className="GraphView">
      <Container>
        <Row>
          <Col md={3} />

          <Col md={3}>
            <ForceGraph3D
              ref={fgRef}
              graphData={genRandomTree(20)}
              nodeThreeObjectExtend={true}
              width={600}
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
          <Col md={3} />
        </Row>
        <Row mx-auto>
          {/* <Col xs={6} md={4}>
            <Image
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/03ff1a28a5d78c955265a95d96ad1f7ccd8497d5d31f309e29fb4c50c7839f31.jpeg"
              rounded
            />
          </Col> */}

          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/03ff1a28a5d78c955265a95d96ad1f7ccd8497d5d31f309e29fb4c50c7839f31.jpeg"
            />
            <Card.Body>
              <Card.Title>EVR: 03ff1a2</Card.Title>
              <Card.Text>
                Henry_B._Bigelow / HB1906 / EK60
              </Card.Text>
              <Card.Text>
                Time: [2025-02-06 10:50:00, 2025-02-06 10:51:00]
              </Card.Text>
              <Card.Text>
                Depth: [11.12, 13.14]
              </Card.Text>
              <Card.Text>
                Altitude: 1.23
              </Card.Text>
              <Card.Link href="#">View water column</Card.Link>
            </Card.Body>
          </Card>
          <Card style={{ width: "18rem" }} className="mx-auto">
            <Card.Img
              variant="top"
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/3dcc07f31feb57001cd30f7857237d89389dac389734faf3bf38af87ce560a0d.jpeg"
            />
            <Card.Body>
              <Card.Title>EVR: 03ff1a2</Card.Title>
              <Card.Text>Henry_B._Bigelow / HB1906 / EK60</Card.Text>
              <Card.Link href="#">View water column</Card.Link>
            </Card.Body>
          </Card>
          <Card style={{ width: "18rem" }} className="mx-auto">
            <Card.Img
              variant="top"
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/1fc15b0a466777f3cb81c5e6c2fb2641654adbcce25d6695ec06939b21968682.jpeg"
            />
            <Card.Body>
              <Card.Title>EVR: 03ff1a2</Card.Title>
              <Card.Text>Henry_B._Bigelow / HB1906 / EK60</Card.Text>
              <Card.Link href="#">View water column</Card.Link>
            </Card.Body>
          </Card>
          <Card style={{ width: "18rem" }} className="mx-auto">
            <Card.Img
              variant="top"
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/5ffd9952ae125c6758afb41222c019afc06587bbbc2ebcc01d0b96330e5198c7.jpeg"
            />
            <Card.Body>
              <Card.Title>EVR: 03ff1a2</Card.Title>
              <Card.Text>Henry_B._Bigelow / HB1906 / EK60</Card.Text>
              <Card.Link href="#">View water column</Card.Link>
            </Card.Body>
          </Card>
        </Row>
        <br />
      </Container>
      <br />
      <br />
      
    </div>
  );
}
