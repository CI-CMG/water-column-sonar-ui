import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { PiCubeLight } from "react-icons/pi";
import { PiMapTrifoldThin } from "react-icons/pi";
import { PiGraphLight } from "react-icons/pi";

// https://react-icons.github.io/react-icons/search/#q=fish
export default function LayoutView() {
  let title = "EchoFish";

  if (window.location.href.includes("test")) {
    // for test tier print different title
    console.log(`dev: ${window.location.href}`);
    title = `${title}-test`;
  } else if (
    window.location.href.includes("dev") ||
    window.location.href.includes("localhost")
  ) {
    title = `${title}-dev`;
  }

  // Bootstrap Nav Examples:
  //   https://getbootstrap.com/docs/5.0/examples/navbars/

  return (
    <div className="LayoutView">
      <div className="NavBarView">
        <Navbar expand="lg" bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} to="/" className="font-weight-bold">
              <i className="bi bi-intersect"></i>&nbsp; {title}
              {' '}
              <span style={{ color: "grey", fontSize: "0.6em" }}>{`v${import.meta.env.VITE_REACT_APP_VERSION}`}</span>
            </Navbar.Brand>

            <Navbar.Toggle ariaControls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/map">
                  <PiMapTrifoldThin />
                  &nbsp;Map
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  reloadDocument
                  to="/water-column?ship=Henry_B._Bigelow&cruise=HB1906&sensor=EK60&frequency=0&color=2&time=3974082"
                >
                  <PiCubeLight />
                  &nbsp;Water Column
                </Nav.Link>

                <Nav.Link
                  // disabled
                  as={Link}
                  to="/graph"
                >
                  <PiGraphLight />
                  &nbsp;Graph
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>

      <div className="MainView">
        <Outlet />
      </div>
    </div>
  );
}
