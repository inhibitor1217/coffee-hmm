import React from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import useFirebase from '../hooks/useFirebase';
import DesktopFallback from './DesktopFallback';
import PageTemplate from './PageTemplate';

function App() {
  useFirebase();

  return (
    <div className="App">
      {isBrowser && <DesktopFallback />}
      {isMobile && (
        <BrowserRouter>
          <PageTemplate />
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
