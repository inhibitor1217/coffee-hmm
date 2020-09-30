import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

interface RouterProps {
  location?: any;
}

const MainPage = lazy(() => import("./pages/Main"));
const CafeDetailPage = lazy(() => import("./pages/CafeDetail"));
const CafePlacePage = lazy(() => import("./pages/Place"));
const PlaceListPage = lazy(() => import("./pages/PlaceList"));

const Router = (props: RouterProps) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Switch location={props.location}>
        <Route path="/" exact render={() => <MainPage />} />
        <Route path="/cafe/:cafeId" render={() => <CafeDetailPage />} />
        <Route path="/place/:place" render={() => <CafePlacePage />} />
        <Route path="/places" render={() => <PlaceListPage />} />

        <Redirect to="/" />
      </Switch>
    </React.Suspense>
  );
};

export default Router;
