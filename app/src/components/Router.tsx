import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import MainPage from "./pages/Main";
import CafePlacePage from "./pages/Place";
import CafeDetailPage from "./pages/CafeDetail";
import PlaceListPage from "./pages/PlaceList";

interface RouterProps {
  location?: any;
}

const Router = (props: RouterProps) => {
  return (
    <Switch location={props.location}>
      <Route path="/" exact render={() => <MainPage />} />
      <Route path="/cafe/:cafeId" render={() => <CafeDetailPage />} />
      <Route path="/place/:place" render={() => <CafePlacePage />} />
      <Route path="/places" render={() => <PlaceListPage />} />

      <Redirect to="/" />
    </Switch>
  );
};

export default Router;
