import React from "react";
import { isBrowser, isMobile } from "react-device-detect";
import { BrowserRouter } from "react-router-dom";
import DesktopFallback from "./DesktopFallback";
import PageTemplate from "./PageTemplate";

const App = () => {
  return (
    <>
      {isBrowser && <DesktopFallback />}
      {isMobile && (
        <BrowserRouter>
          <PageTemplate />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
