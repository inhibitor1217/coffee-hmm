import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import MainPage from "./pages/Main";
import DetailPage from "./pages/Detail";

interface RouterProps {
  location?: any;
}

const Router = (props: RouterProps) => {
  return (
    <Switch location={props.location}>
      <Route path="/" exact render={() => <MainPage />} />
      <Route path="/cafe/:cafeId" render={() => <DetailPage />} />
      <Redirect to="/" />
    </Switch>
  );
};

export default Router;
