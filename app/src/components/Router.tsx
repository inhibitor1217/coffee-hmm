import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

interface RouterProps {
  location?: any;
}

const IntroPage = lazy(() => import("./pages/Intro"));
const SearchPage = lazy(() => import("./pages/Search"));
const DetailPage = lazy(() => import("./pages/Detail"));

const Router = (props: RouterProps) => {
return(
    <React.Suspense fallback={<div>Loading...</div>}>
    <Switch location={props.location}>    
        <Route path="/" exact render={() => <IntroPage />}/>
        <Route path="/search" exact render={() => <SearchPage/>}/>
        <Route path="/cafe/:cafeId" exact render={() => <DetailPage/>}/>
      <Redirect to="/" />
    </Switch>
    </React.Suspense>  
  );
};


export default Router;