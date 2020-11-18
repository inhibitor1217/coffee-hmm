import React from 'react';
import { useHistory } from 'react-router-dom';
import './index.css';


interface HeaderProps {
    location: {
      pathname: string;
    };
    searchValue: string;
}
  

const Header = ({location, searchValue}: HeaderProps) => {
    const history = useHistory();

    switch(location.pathname){
        case "/search" : 
            return(
                <header>
                    <button className="back-button" onClick={() => history.goBack()}><span className="material-icons">keyboard_arrow_left</span></button>
                    <span className="header-searchvalue">{searchValue}</span>
                </header>
            )
    }
    return <header></header>
}

export default Header;