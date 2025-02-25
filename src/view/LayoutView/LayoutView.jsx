import { Outlet } from "react-router-dom";
// import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from 'react-router-dom';


export default function LayoutView() {
  return (
    <div className="LayoutView">
      <div id="wrap">
        <div id="top">
          <header role="banner" id="HeaderContent">
            <div>
              {/* TODO: align the nav with the page content */}
              <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                  <Navbar.Brand as={Link} to="/">EchoFish</Navbar.Brand>

                  <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/water-column">Water Column</Nav.Link>
                    <Nav.Link as={Link} to="/dataset">Dataset</Nav.Link>
                    {/* <Nav.Link href="#knowledge-graph">Knowledge Graph</Nav.Link> */}
                    <Nav.Link as={Link} to="/about">About</Nav.Link>
                    {/* <Nav.Link href="#analysis">Analysis</Nav.Link> */}
                  </Nav>
                </Container>
              </Navbar>
            </div>

            {/* <Link to="/">map</Link>
            {' '}|{' '}
            <Link to="/zarr">zarr</Link>
            {' '}|{' '}
            <Link to="/water-column">water column</Link> */}
          </header>

          <main role="main" className="main">
            <div className="water-column-main" id="MainContent">
              <Outlet />
            </div>
          </main>
        </div>

        <div id="bottom">
          <footer role="contentinfo" id="FooterContent"></footer>
        </div>
      </div>
    </div>
  );
}
