import React, { useState } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import { CarouselIndexCtx, SearchValueCtx } from '../context';
import DesktopFallback from './DesktopFallback';
import PageTemplate from './PageTemplate';

function App() {
  const [target, setTarget] = useState("");
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);

  return (
    <div className="App">
      {isBrowser && <DesktopFallback/>}
      {isMobile && (
        <BrowserRouter>       
          <SearchValueCtx.Provider value={{
            searchValueCtx: target,
            setSearchValueCtx: (data: string) => setTarget(data)}}>
          <CarouselIndexCtx.Provider value={{
            carouselIndexCtx: carouselIndex,
            setCarouselIndexCtx: (index: number | null) => setCarouselIndex(index)}}>
            
            <PageTemplate/>
          
          </CarouselIndexCtx.Provider>
          </SearchValueCtx.Provider>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
