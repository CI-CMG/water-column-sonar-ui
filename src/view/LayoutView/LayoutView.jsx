import { Outlet } from "react-router-dom";
// import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

export default function LayoutView() {

  return (
    <div className="LayoutView">
      {/* <header role="banner" id="HeaderContent"></header> */}
      <div>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} to="/" className="font-weight-bold">
              EchoFish
            </Navbar.Brand>

            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/water-column">
                Water Column
              </Nav.Link>
              <Nav.Link as={Link} to="/dataset">
                Dataset
              </Nav.Link>
              {/* <Nav.Link href="#knowledge-graph">Knowledge Graph</Nav.Link> */}
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
              {/* <Nav.Link href="#analysis">Analysis</Nav.Link> */}
            </Nav>
          </Container>
        </Navbar>
      </div>

      <div className="Main">
        <Outlet />
      </div>
    </div>
  );
}
