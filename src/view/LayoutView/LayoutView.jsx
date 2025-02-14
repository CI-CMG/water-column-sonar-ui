import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";


// https://codesandbox.io/embed/z9zxcc?module=/src/Demo.js&fontsize=12

// https://codesandbox.io/embed/w7rtjg?module=/src/Demo.js&fontsize=12

export default function LayoutView() {

  return (
    <div className="LayoutView">
      
      <br />
      <br />
      <div id="wrap">
        <div id="top">
          <header role="banner" id="HeaderContent">
            <Link to="/">home</Link>
            <br />

            <Link to="/cruises">cruises</Link>
            <br />

            <Link to="/map">map</Link>
            <br />

            <Link to="/zarr">zarr</Link>
            <br />

            <Link to="/water-column">water column</Link>
            <br />
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
