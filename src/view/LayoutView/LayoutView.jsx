import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
// import { GiWashingMachine } from "react-icons/gi";
// import { FaOctopusDeploy } from "react-icons/fa6";
// import { PiGraph } from "react-icons/pi";
import { PiCubeLight } from "react-icons/pi";
import { PiDatabase } from "react-icons/pi";
import { PiMapTrifoldThin } from "react-icons/pi";
// import { PiBookOpenThin } from "react-icons/pi";
// import { LiaFishSolid } from "react-icons/lia";

// https://react-icons.github.io/react-icons/search/#q=fish
export default function LayoutView() {
  return (
    <div className="LayoutView">
      {/* <header role="banner" id="HeaderContent"></header> */}
      <div>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} to="/" className="font-weight-bold">
            <i className="bi bi-intersect"></i>&nbsp; echofish
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
