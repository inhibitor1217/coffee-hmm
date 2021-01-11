import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Header = () => {
    return(
        <header>
            <Link to="/" className="header-home">Hmm Management</Link>
        </header>
    );
}

export default Header;