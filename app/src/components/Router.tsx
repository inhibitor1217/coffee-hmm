import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

interface RouterProps {
  location?: any;
}

const IntroPage = lazy(() => import("./pages/Intro"));
const CafesByPlacePage = lazy(() => import("./pages/CafesByPlace"));
const DetailPage = lazy(() => import("./pages/Detail"));

const Router = (props: RouterProps) => {
return(
    <React.Suspense fallback={<div>Loading...</div>}>
    <Switch location={props.location}>    
        <Route path="/" exact render={() => <IntroPage />}/>
        <Route path="/place" exact render={() => <CafesByPlacePage/>}/>
        <Route path="/cafe/:cafeId" exact render={() => <DetailPage/>}/>
      <Redirect to="/" />
    </Switch>
    </React.Suspense>  
  );
};


export default Router;