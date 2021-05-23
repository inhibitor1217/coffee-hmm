import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const Menu = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const handleMenuOpen = () => {
        if(menuOpen){
            setMenuOpen(false);
        }else{
            setMenuOpen(true);
        }
    }


    if(! menuOpen){
        return(
            <div className="menu" style={{width: "48px"}}>      
                <button onClick={handleMenuOpen}><i className="material-icons menu-close">menu</i></button>  
                <Link to="/cafes"><i className="material-icons business" style={{left: "54px"}}>add_business</i></Link>
                <Link to="/"><i className="material-icons chart" style={{left: "54px"}}>bar_chart</i></Link>
            </div>
        );
    }else{
        return(
            <div className="menu" style={{width: "96px"}}>      
                <button onClick={handleMenuOpen}><i className="material-icons menu-open">menu</i></button>   
                <Link to="/cafes"><i className="material-icons business" style={{left: "36px"}}>add_business</i></Link>
                <Link to="/"><i className="material-icons chart" style={{left: "36px"}}>bar_chart</i></Link>
            </div>
        );
    } 
}

export default Menu;