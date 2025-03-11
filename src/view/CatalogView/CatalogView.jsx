import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function CatalogView() {
  useEffect(() => {
    document.title = `Catalog`;

    console.log(
      `★ ${import.meta.env.VITE_REACT_APP_NAME} — v${
        import.meta.env.VITE_REACT_APP_VERSION
      } — ${import.meta.env.DEV} ★`
    );
  }, []);

  return (
    <div className="CatalogView">
      <Container>
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <br />
            <br />
            {/* <h1 style={{ backgroundColor: "lightblue" }}> */}
            <h1>Water Column Sonar Catalog</h1>
            <br />

            <br />
            <p>
              Stac Catalog Information
            </p>
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
