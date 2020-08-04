import React from "react";
import { useLocation } from "react-router";
import { Switch, Route, Redirect } from "react-router-dom";
import HomePage from "./pages/HomePage";

const Router = () => {
  const location = useLocation();
  return (
    <Switch location={location}>
      <Route path="/" exact render={() => <HomePage />} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Router;
