import React, { lazy } from "react";
import { Switch, Route, Redirect, RouteProps } from "react-router-dom";

import { useAnalyticsPageView } from "hooks/common";

interface RouterProps {
  location?: RouteProps["location"];
}

const MainPage = lazy(() => import("./pages/main"));
const CafeDetailPage = lazy(() => import("./pages/detail"));

const Router: React.FC<RouterProps> = (props: RouterProps) => {
  useAnalyticsPageView();

  return (
    <React.Suspense fallback={<div></div>}>
      <Switch location={props.location}>
        <Route path="/" exact render={() => <MainPage />} />
        <Route path="/cafe/:cafeId" exact render={() => <CafeDetailPage />} />
        <Redirect to="/" />
      </Switch>
    </React.Suspense>
  );
};

export default Router;
