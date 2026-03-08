import { useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function ErrorView() {
  useEffect(() => {
    document.title = `Error`;
  }, []);

  return (
    <div className="ErrorView">
      <Container>
        <Row>
          <Col sm={3} />

          <Col sm={6}>
            <center>
              <br />
              <br />
              <br />
              <br />
              <h1 className="text-center">Sorry</h1>

              <br />

              <p>This path does not exist!</p>

              <br /><br />

              <Link to="/">
                <p style={{ color: "white"}}>Click Here to Return Home</p>
              </Link>
            </center>
          </Col>
          <Col sm={3} />
        </Row>
      </Container>
    </div>
  );
}
