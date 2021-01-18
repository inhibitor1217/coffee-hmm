import React, { useState } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import { SearchValueCtx } from '../context';
import DesktopFallback from './DesktopFallback';
import PageTemplate from './PageTemplate';

function App() {
  const [target, setTarget] = useState("");
  
  return (
    <div className="App">
      {isBrowser && <DesktopFallback/>}
      {isMobile && (
        <BrowserRouter>       
          <SearchValueCtx.Provider value={{
            searchValueCtx: target,
            setSearchValueCtx: (data: string) => setTarget(data)}}>
         
            <PageTemplate searchValue={target}/>

          </SearchValueCtx.Provider>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
