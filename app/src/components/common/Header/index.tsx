import React from "react";
import { Link } from "react-router-dom";

import { COFFEEHMM_REPORT_URL } from "constants/url";

import "./index.css";

interface HeaderProps {
  location: {
    pathname: string;
  };
}

const Header = ({ location }: HeaderProps) => {
  function handleBackClick() {
    window.location.assign("https://www.coffeehmm.com");
  }

  return (
    <header>
      {location.pathname !== "/" && (
        <button className="back-button" onClick={handleBackClick}>
          <img src="/icons/baseline_navigate_before_black_18dp.png" alt="" />
        </button>
      )}
      <div className="header-title">coffee hmm</div>
      <Link to={{ pathname: COFFEEHMM_REPORT_URL }} target="_blank">
        <span className="airplane-icon">
          <img src="/icons/plane.png" alt="" />
        </span>
      </Link>
    </header>
  );
};

export default Header;
