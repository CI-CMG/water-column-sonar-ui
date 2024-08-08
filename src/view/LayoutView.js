import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function LayoutView() {
  return (
    <div className="LayoutView">
      <div id="wrap">
        <div id="top">
          <header role="banner" id="HeaderContent">
            <p>water column project</p>

            <Link to="/">home</Link>
            <br />

            <Link to="/map">map</Link>
            <br />
            
            <Link to="/water-column">water column</Link>
            <br />
          </header>

          <main role="main">
            <div className="water-column-main" id="MainContent">
              <Outlet />
            </div>
          </main>
        </div>

        <div id="bottom">
          <footer role="contentinfo" id="FooterContent">
            <p>footer</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
