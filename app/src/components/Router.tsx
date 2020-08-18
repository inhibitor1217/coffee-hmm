import React from "react";
import { useLocation } from "react-router";
import { Switch, Route, Redirect } from "react-router-dom";
import HomePage from "./pages/Homepage";
import InfoPage from "./pages/Infopage";

const Router = () => {
  const location = useLocation();
  return (
    <Switch location={location}>
      <Route path="/" exact render={() => <HomePage />} />
      <Route pathe="/cafe" component={InfoPage} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Router;
