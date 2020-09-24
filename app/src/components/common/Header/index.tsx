import React, { useState } from "react";
import Logo from "../Logo";
import "./style.css";
import { Link, useHistory } from "react-router-dom";
import MaterialIcon from "../MaterialIcon";
import styled from "styled-components";

const SearchBox = styled.div`
  z-index: 9999;
  position: absolute;
  top: 12px;
  left: 32%;
`;

interface HeaderProps {
  location: {
    pathname: string;
  };
}

export const handleSubmit = (event: React.SyntheticEvent) => {
  event.preventDefault();
};

const Header = (props: HeaderProps) => {
  const history = useHistory();

  const [currentPlace, setCurrentPlace] = useState<string | undefined>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPlace(event.currentTarget.value);
  };

  return (
    <header>
      {props.location.pathname === "/" && (
        <Link to="/" id="home-link">
          <Logo />
        </Link>
      )}
      <SearchBox>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="지역을 입력해주세요"
            value={currentPlace}
            onChange={handleChange}
            className="search-box"
          />
          <Link to={`/place/${currentPlace}`}>
            <button type="submit" className="search-button"></button>
          </Link>
        </form>
      </SearchBox>
      {props.location.pathname !== "/" && props.location.pathname !== "/cafe" && (
        <button className="back-button" onClick={() => history.goBack()}>
          <MaterialIcon icon="keyboard_arrow_left" />
        </button>
      )}
    </header>
  );
};

export default Header;
