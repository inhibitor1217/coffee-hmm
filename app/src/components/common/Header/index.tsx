import React from "react";
import { Link, useHistory } from "react-router-dom";
import { COFFEEHMM_REPORT_URL } from "../../../constants";
import "./index.css";

interface HeaderProps {
  location: {
    pathname: string;
  };
}

const Header = ({ location }: HeaderProps) => {
  const history = useHistory();

  return (
    <header>
      {location.pathname !== "/" && (
        <button className="back-button" onClick={() => history.goBack()}>
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
