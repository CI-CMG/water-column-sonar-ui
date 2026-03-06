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

        <Row className="mx-auto mt-4">
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
                start: 2025-02-06 10:50:00
                <br />
                end: 2025-02-06 10:51:00
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

          <Card style={{ width: "18rem" }} className="mx-auto">
            <Card.Img
              variant="top"
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/058ca885054617fc5e15bec4f3c7e3b3bfc2a92cdf218f32cab7000a74895edc.jpeg"
            />
            <Card.Body>
              <Card.Title className="text-center">AH_School</Card.Title>
              <Card.Text className="text-center">
                Henry_B._Bigelow / HB1906 / EK60
                <br />
                start: 2025-02-06 10:50:00
                <br />
                end: 2025-02-06 10:51:00
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
                phase of day: night
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

          <Card style={{ width: "18rem" }} className="mx-auto">
            <Card.Img
              variant="top"
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/03ff1a28a5d78c955265a95d96ad1f7ccd8497d5d31f309e29fb4c50c7839f31.jpeg"
            />
            <Card.Body>
              <Card.Title className="text-center">
                Unclassified regions
              </Card.Title>
              <Card.Text className="text-center">
                Henry_B._Bigelow / HB1906 / EK60
                <br />
                start: 2025-02-06 10:50:00
                <br />
                end: 2025-02-06 10:51:00
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
                phase of day: sunrise
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
        </Row>

        <Row className="mx-auto mt-5">
          <Card style={{ width: "18rem" }} className="mx-auto">
            <Card.Img
              variant="top"
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/8bbeec194add2f5c4d9f153caea83f6d4a61506cc458907443bda654d73ba8fa.jpeg"
            />
            <Card.Body>
              <Card.Title className="text-center">AH_School</Card.Title>
              <Card.Text className="text-center">
                Henry_B._Bigelow / HB1906 / EK60
                <br />
                start: 2025-02-06 10:50:00
                <br />
                end: 2025-02-06 10:51:00
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

          <Card style={{ width: "18rem" }} className="mx-auto">
            <Card.Img
              variant="top"
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/8be3f1af949c92cf03171491ca4e6db1b03c595fb56f108cdb20dfc026c00cfe.jpeg"
            />
            <Card.Body>
              <Card.Title className="text-center">
                Unclassified regions
              </Card.Title>
              <Card.Text className="text-center">
                Henry_B._Bigelow / HB1906 / EK60
                <br />
                start: 2025-02-06 10:50:00
                <br />
                end: 2025-02-06 10:51:00
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

          <Card style={{ width: "18rem" }} className="mx-auto">
            <Card.Img
              variant="top"
              src="https://noaa-wcsd-pds-index.s3.us-east-1.amazonaws.com/thumbnails/9f1a7a95e93801996eb4e88b829c6070320dabdc8dce0669a706c96f1e5f9e53.jpeg"
            />
            <Card.Body>
              <Card.Title className="text-center">AH_School</Card.Title>
              <Card.Text className="text-center">
                Henry_B._Bigelow / HB1906 / EK60
                <br />
                start: 2025-02-06 10:50:00
                <br />
                end: 2025-02-06 10:51:00
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
        </Row>
        <br />
      </Container>
      <br />
      <br />
    </div>
  );
}
