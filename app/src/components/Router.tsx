import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import MainPage from "./pages/Main";
import CafeSpotPage from "./pages/CafeSpot";
import CafeDetailPage from "./pages/CafeDetail";

interface RouterProps {
  location?: any;
}

const Router = (props: RouterProps) => {
  return (
    <Switch location={props.location}>
      <Route path="/" exact render={() => <MainPage />} />
      <Route path="/cafe/:cafeId" render={() => <CafeDetailPage />} />
      <Route path="/cafe" render={() => <CafeSpotPage />} />

      <Redirect to="/" />
    </Switch>
  );
};

export default Router;
