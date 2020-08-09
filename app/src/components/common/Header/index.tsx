import React from "react";
import Logo from "../Logo";
import "./style.css";
import { Link, useHistory } from "react-router-dom";
import MaterialIcon from "../MaterialIcon";

interface HeaderProps {
  location: {
    pathname: string;
  };
}

const Header = (props: HeaderProps) => {
  const history = useHistory();
  return (
    <header>
      <Link to="/" id="home-link">
        <Logo />
      </Link>
      {props.location.pathname !== "/" && (
        <button className="leading" onClick={() => history.goBack()}>
          <MaterialIcon icon="arrow_back" />
        </button>
      )}
    </header>
  );
};

export default Header;
