import React from "react";
import { Link } from "react-router-dom";

import { COFFEEHMM_MAIN_URL, COFFEEHMM_REPORT_URL } from "constants/url";

import "./index.css";

interface HeaderProps {
  location: {
    pathname: string;
  };
}

const Header = ({ location }: HeaderProps) => {
  return (
    <header>
      {location.pathname !== COFFEEHMM_MAIN_URL && (
        <Link to={{ pathname: COFFEEHMM_MAIN_URL }}>
          <button className="back-button">
            <img src="/icons/baseline_navigate_before_black_18dp.png" alt="" />
          </button>
        </Link>
      )}
      <Link to={{pathname: COFFEEHMM_MAIN_URL }}><div className="header-title">coffee hmm</div></Link>
      <Link to={{ pathname: COFFEEHMM_REPORT_URL }} target="_blank">
        <span className="airplane-icon">
          <img src="/icons/plane.png" alt="" />
        </span>
      </Link>
    </header>
  );
};

export default Header;
