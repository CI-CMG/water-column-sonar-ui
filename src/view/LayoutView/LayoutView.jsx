import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { PiCubeLight } from "react-icons/pi";
import { PiDatabase } from "react-icons/pi";
import { PiMapTrifoldThin } from "react-icons/pi";
import { PiGraphLight } from "react-icons/pi";

// https://react-icons.github.io/react-icons/search/#q=fish
export default function LayoutView() {
  let title = "echofish";

  if (window.location.href.includes("test")) {
    // for test tier print different title
    console.log(`dev: ${window.location.href}`);
    title = "echofish-test";
  } else if (
    window.location.href.includes("dev") ||
    window.location.href.includes("localhost")
  ) {
    title = "echofish-dev";
  }

  return (
    <div className="LayoutView">
      {/* <header role="banner" id="HeaderContent"></header> */}
      <div className="NavBarView">
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} to="/" className="font-weight-bold">
              <h1 className="fs-4 m-0">
                <i className="bi bi-intersect"></i>&nbsp; {title}
              </h1>
            </Navbar.Brand>
            <p style={{ color: "grey", fontSize: "0.75em" }}>{`v${import.meta.env.VITE_REACT_APP_VERSION}`}</p>

            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                <PiMapTrifoldThin />
                &nbsp;Map
              </Nav.Link>
              <Nav.Link
                as={Link}
                reloadDocument
                to="/water-column?ship=Henry_B._Bigelow&cruise=HB0710&sensor=EK60&frequency=0&color=2&time=0"
                key={Date.now()}
              >
                <PiCubeLight />
                &nbsp;Water Column
              </Nav.Link>

              <Nav.Link as={Link} to="/dataset">
                <PiDatabase />
                &nbsp;Dataset
              </Nav.Link>

              <Nav.Link disabled as={Link} to="/graph">
                <PiGraphLight />
                &nbsp;Graph
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>

      <div className="MainView">
        <Outlet />
      </div>
    </div>
  );
}
