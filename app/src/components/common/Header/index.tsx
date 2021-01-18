import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SearchValueCtx } from '../../../context';
import './index.css';


interface HeaderProps {
    location: {
      pathname: string;
    };
}
  

const Header = ({location}: HeaderProps) => {
    const history = useHistory();
    const { searchValueCtx } = useContext(SearchValueCtx);

    switch(location.pathname){
        case "/search" : 
            return(
                <header>
                    <button className="back-button" onClick={() => history.goBack()}><i className="material-icons">keyboard_arrow_left</i></button>
                    <span className="header-searchvalue">{searchValueCtx}</span>
                </header>
            )
    }
    return <header></header>
}

export default Header;