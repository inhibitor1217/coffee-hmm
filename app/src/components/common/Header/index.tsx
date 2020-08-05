import React from "react";
import Logo from "../Logo";
import "./style.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <Link to="/" id="home-link">
        <Logo />
      </Link>
    </header>
  );
};

export default Header;
