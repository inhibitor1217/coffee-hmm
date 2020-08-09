import React from "react";
import { useLocation } from "react-router";
import { useTransition, animated } from "react-spring";
import Header from "./common/Header";
import Router from "./Router";

function getPageTransition(pathname: string) {
  if (pathname === "/") {
    return {
      initial: { opacity: 0 },
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    };
  }

  return {
    initial: { transform: "translate(0, 0)", opacity: 0 },
    from: { transform: "translate(100%, 0)", opacity: 0 },
    enter: { transform: "translate(0, 0)", opacity: 1 },
    leave: { transform: "translate(100%, 0)", opacity: 0 },
  };
}

const PageTemplate = () => {
  const location = useLocation();
  const routeTransition = useTransition(
    location,
    (location) => location.pathname,
    {
      initial: (location) => getPageTransition(location.pathname).initial,
      from: (location) => getPageTransition(location.pathname).from,
      enter: (location) => getPageTransition(location.pathname).enter,
      leave: (location) => getPageTransition(location.pathname).leave,
      unique: true,
    }
  );
  return (
    <>
      {routeTransition.map(({ item, props: springProps, key }) => (
        <animated.div
          key={key}
          style={{
            position: "absolute",
            width: "100%",
            minHeight: "100%",
            top: 0,
            left: 0,
            backgroundColor: "#ffffff",
            opacity: 1,
            transform: "translate(0, 0)",
            ...springProps,
          }}
        >
          <Header location={item} />
          <main>
            <Router location={item} />
          </main>
          <footer></footer>
        </animated.div>
      ))}
    </>
  );
};

export default PageTemplate;
