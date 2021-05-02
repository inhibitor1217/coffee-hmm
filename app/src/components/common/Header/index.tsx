import React from 'react';
import { useHistory } from 'react-router-dom';
import { COFFEEHMM_REPORT_URL } from '../../../utils/constant';
import './index.css';


interface HeaderProps {
    location: {
      pathname: string;
    };
}
  

const Header = ({location}: HeaderProps) => {
    const history = useHistory();
    const sendMessage = () => {
        window.open(COFFEEHMM_REPORT_URL, "_blank")?.focus();
    }
    
    if(location.pathname === "/"){
        return(
            <header>
                <div className="header-title">coffee hmm</div>
                <span className="airplane-icon" onClick={sendMessage}><img src="/icons/plane.png" alt=""/></span>
            </header>
        )
    }

    if(location.pathname !== "/") {
        return(
            <header>
                <button className="back-button" onClick={() => history.goBack()}><img src="/icons/baseline_navigate_before_black_18dp.png" alt=""/></button>
                <div className="header-title">coffee hmm</div>
                <span className="airplane-icon" onClick={sendMessage}><img src="/icons/plane.png" alt=""/></span>
            </header>
        )
    }
    
    return <header></header>
}

export default Header;