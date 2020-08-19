import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import HomePage from "./pages/Homepage";
import CafeDetailPage from "./pages/CafeDetailPage";

interface RouterProps {
  location?: any;
}

const Router = (props: RouterProps) => {
  return (
    <Switch location={props.location}>
      <Route path="/" exact render={() => <HomePage />} />
      <Route path="/cafe/:cafeId" render={() => <CafeDetailPage />} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Router;
