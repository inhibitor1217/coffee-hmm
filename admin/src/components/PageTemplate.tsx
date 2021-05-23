import React from "react";
import { useLocation } from "react-router";
import Header from "./common/header";
import Menu from "./common/menu";
import Router from "./Router";

const PageTemplate = () => {
  const location = useLocation();

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        minHeight: "100%",
        top: 0,
        left: 0,
        backgroundColor: "#F0F0F0",
        opacity: 1
      }}>
      <Header/>
      <main>
        <Router location={location}/>
        <Menu/>
      </main>  
    </div>
  );
};

export default PageTemplate;