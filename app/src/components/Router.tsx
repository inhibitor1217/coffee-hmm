import React, { lazy, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { CarouselIndexCtx } from "../context";

interface RouterProps {
  location?: any;
}

const IntroPage = lazy(() => import("./pages/Intro"));
const CafeDetailPage = lazy(() => import("./pages/Detail"));

const Router = (props: RouterProps) => {
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  return(
    <CarouselIndexCtx.Provider value={{
      carouselIndexCtx: carouselIndex,
      setCarouselIndexCtx: (index: number) => setCarouselIndex(index)}}>

      <React.Suspense fallback={<div>Loading...</div>}>
        <Switch location={props.location}>    
            <Route path="/" exact render={() => <IntroPage />}/>
            <Route path="/cafe/:cafeId" exact render={() => <CafeDetailPage/>}/>
          <Redirect to="/" />
        </Switch>
      </React.Suspense>

    </CarouselIndexCtx.Provider>    
  );
};


export default Router;