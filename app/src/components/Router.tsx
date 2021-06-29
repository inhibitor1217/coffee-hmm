import React, { lazy } from "react";
import { Switch, Route, Redirect, RouteProps } from "react-router-dom";

import useAnalyticsPageView from "hooks/useAnalyticsPageView";

interface RouterProps {
  location?: RouteProps['location'];
}

const IntroPage = lazy(() => import('./pages/Intro'));
const CafeDetailPage = lazy(() => import('./pages/Detail'));

const Router: React.FC<RouterProps> = (props: RouterProps) => {
  useAnalyticsPageView();

  return (
    <React.Suspense fallback={<div></div>}>
      <Switch location={props.location}>
        <Route path="/" exact render={() => <IntroPage />} />
        <Route path="/cafe/:cafeId" exact render={() => <CafeDetailPage />} />
        <Redirect to="/" />
      </Switch>
    </React.Suspense>
  );
};

export default Router;
