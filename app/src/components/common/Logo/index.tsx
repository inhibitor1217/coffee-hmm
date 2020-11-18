import React from 'react';
import './index.css';

type LogoProps = {
    pathname: string;
 }

const Logo = ({pathname}: LogoProps) => {
    return(
        <div className="logo">Coffee Hmm</div>
    )
}

export default Logo;