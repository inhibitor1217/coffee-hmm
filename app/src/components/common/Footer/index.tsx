import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

interface FooterProps {
    location: {
      pathname: string;
    };
}

const Footer = ({location}: FooterProps) => {
    const pathname = location.pathname;
    return(
        <footer>
            <Link to="/" style={{color: pathname === "/" ? "#524F4A" :  "#dbdbdb"}}><i className="material-icons">home</i><span>Home</span></Link>
            <Link to="/search" style={{color: pathname === "/search" ? "#524F4A" :  "#dbdbdb"}}><i className="material-icons-round">search</i><span>Search</span></Link>
            <Link to="/signin" style={{color: pathname === "/signin" ? "#524F4A" :  "#dbdbdb"}}><i className="material-icons">person</i><span>My</span></Link>
        </footer>
    )
}

export default Footer;