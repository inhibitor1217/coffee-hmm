import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import './Map.css';

declare global{
    interface Window{
      kakao: any;
    }
  }

const StyledButton = Styled.button`
    color: gray;
`
const cafeList = [
    {name: 'Water-White', location:[37.401251, 127.110753]},
    {name: 'Cafe-Moire', location: [37.401399, 127.110903]}
];

const Map = () => {
    useEffect(() =>{
        let container = document.getElementById('map');
        let options = {
          center: new window.kakao.maps.LatLng(37.401707, 127.110459),
          level: 1
        };
    
        let map = new window.kakao.maps.Map(container, options);
      }, [])

    return (
        <div className='Map'>
            <div id='map' style={{width: '100vw', height: '100vh'}}></div>
        </div>
    );
}

export default Map;