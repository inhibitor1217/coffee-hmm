import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

interface RouterProps {
  location?: any;
}

const IntroPage = lazy(() => import("./pages/Intro"));
const CafeDetailPage = lazy(() => import("./pages/Detail"));

const Router = (props: RouterProps) => {
  return(
      <React.Suspense fallback={<div></div>}>
        <Switch location={props.location}>    
            <Route path="/" exact render={() => <IntroPage />}/>
            <Route path="/cafe/:cafeId" exact render={() => <CafeDetailPage/>}/>
          <Redirect to="/" />
        </Switch>
      </React.Suspense>
  );
};


export default Router;