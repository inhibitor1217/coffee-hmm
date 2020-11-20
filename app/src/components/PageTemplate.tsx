import React from "react";
import { useLocation } from "react-router";
import { animated, useTransition } from "react-spring";
import Footer from "./common/Footer";
import Header from "./common/Header";
import Router from "./Router";


function getPageTransition(pathname: string){
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

type props = {
  searchValue: string;
}


const PageTemplate = ({searchValue}: props) => {
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
    <div>
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
            ...springProps,
          }}
        >
          <Header location={item} searchValue={searchValue}/>
          <main>
            <Router location={item}/>
          </main>
          <Footer location={item} />
        </animated.div>
      ))}
    </div>
  );
};

export default PageTemplate;