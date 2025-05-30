import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { PiCubeLight } from "react-icons/pi";
import { PiDatabase } from "react-icons/pi";
import { PiMapTrifoldThin } from "react-icons/pi";

// https://react-icons.github.io/react-icons/search/#q=fish
export default function LayoutView() {
  let title = 'echofish';
  if (window.location.href.includes("test")) { // for test tier print different title
    console.log(`dev: ${window.location.href}`);
    title = "echofish-test"
  } else if (window.location.href.includes("localhost")) {
    title = "echofish-dev"
  }

  return (
    <div className="LayoutView">
      {/* <header role="banner" id="HeaderContent"></header> */}
      <div>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} to="/" className="font-weight-bold">
            <h1 className="fs-4"><i className="bi bi-intersect"></i>&nbsp; {title}</h1>
            </Navbar.Brand>

            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/"
              >
                <PiMapTrifoldThin />&nbsp;Map
              </Nav.Link>
              <Nav.Link
                as={Link}
                reloadDocument
                to="/water-column?ship=Henry_B._Bigelow&cruise=HB1906&sensor=EK60&frequency=0&color=2&time=435042"
                key={Date.now()}
                // sidescan ping time at: 435042, physical school at: 42472
              >
                {/* <i className="bi bi-box"></i> */}
                <PiCubeLight />&nbsp;Water Column
              </Nav.Link>

              <Nav.Link as={Link} to="/dataset">
                {/* <i className="bi bi-collection"></i> */}
                <PiDatabase />&nbsp;Dataset
              </Nav.Link>

              {/* <Nav.Link as={Link} to="/catalog">
                <PiBookOpenThin />&nbsp;Catalog
              </Nav.Link> */}

              {/* <Nav.Link as={Link} to="/catalog">
                <PiGraph />&nbsp;Knowledge Graph
              </Nav.Link> */}

              {/* <Nav.Link href="#knowledge-graph">Knowledge Graph</Nav.Link> */}
              {/* <Nav.Link as={Link} to="/about">
                <i className="bi bi-info-square"></i>
                {' '}
                &nbsp;
                {' '}
                About
              </Nav.Link> */}
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
