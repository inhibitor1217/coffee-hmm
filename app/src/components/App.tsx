import React from "react";
import { isBrowser, isMobile } from "react-device-detect";
import MaterialIcon from "./common/MaterialIcon";
import DesktopFallback from "./DesktopFallback";

const App = () => {
  return (
    <>
      {isBrowser && <DesktopFallback />}
      {isMobile && <MaterialIcon icon="face" />}
    </>
  );
};

export default App;
