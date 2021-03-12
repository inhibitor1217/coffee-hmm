import React from 'react';
import { useHistory } from 'react-router-dom';
import './index.css';


interface HeaderProps {
    location: {
      pathname: string;
    };
}
  

const Header = ({location}: HeaderProps) => {
    const history = useHistory();
    if(location.pathname === "/"){
        return(<header><div className="header-title">coffee hmm</div></header>)
    }

    if(location.pathname !== "/") {
        return(
            <header>
                <button className="back-button" onClick={() => history.goBack()}><img src="/icons/baseline_navigate_before_black_18dp.png" alt="back"/></button>
            </header>
        )
    }
    
    return <header></header>
}

export default Header;