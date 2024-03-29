import React, { lazy, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { TokenCtx } from "../context";

interface RouterProps {
  location?: any;
}

const Main = lazy(() => import("./pages/Main"));
const CafeList = lazy(() => import("./pages/CafeList"));
const CafeDetail = lazy(() => import("./pages/CafeDetail"));
const CafeRegister = lazy(() => import("./pages/CafeRegister"));
const CafeReview = lazy(() => import("./pages/CafeReview"));
const CafeImage = lazy(() => import("./pages/CafeImage"));

const Router = (props: RouterProps) => {
  const [hmmAdminToken, setHmmAdminToken] = useState<string>("");

  return (
    <TokenCtx.Provider
      value={{
        hmmAdminTokenCtx: hmmAdminToken,
        setHmmAdminTokenCtx: (token: string) => setHmmAdminToken(token),
      }}
    >
      <React.Suspense fallback={<div>Loading...</div>}>
        <Switch location={props.location}>
          <Route path="/" exact render={() => <Main />} />
          <Route path="/cafes" exact render={() => <CafeList />} />
          <Route path="/cafe/:cafeId" exact render={() => <CafeDetail />} />
          <Route
            path="/cafe/:cafeId/review"
            exact
            render={() => <CafeReview />}
          />
          <Route
            path="/cafe/:cafeId/image"
            exact
            render={() => <CafeImage />}
          />
          <Route path="/register" exact render={() => <CafeRegister />} />
          <Redirect to="/" />
        </Switch>
      </React.Suspense>
    </TokenCtx.Provider>
  );
};

export default Router;
