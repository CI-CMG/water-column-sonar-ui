import React from 'react';
import { Outlet } from 'react-router-dom';

export default function LayoutView() {
  return (
    <div className="LayoutView">
      <div id="wrap">
        <div id="top">
          <header role="banner" id="HeaderContent">
            <p>header</p>
          </header>

          <main role="main" id="maincontentparent">
            <div className="stp-main" id="maincontent">
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
