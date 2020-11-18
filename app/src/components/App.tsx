import React, { useState } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import SearchValueContext from '../context';
import DesktopFallback from './DesktopFallback';
import PageTemplate from './PageTemplate';

function App() {
  const [target, setTarget] = useState("");
  return (
    <div className="App">
      {isBrowser && <DesktopFallback/>}
      {isMobile && (
        <BrowserRouter>       
          <SearchValueContext.Provider value={{
            searchValue: target,
            setSearchValue: (data: string) => setTarget(data)}}>
            <PageTemplate searchValue={target}/>
          </SearchValueContext.Provider>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
