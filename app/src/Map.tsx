import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import ReactMapGL, {Marker, Popup, NavigationControl, FlyToInterpolator} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';


const StyledButton = Styled.button`
    color: gray;
`
const cafeList = [
    {name: 'Water-White', location:[37.401251, 127.110753]},
    {name: 'Cafe-Moire', location: [37.401399, 127.110903]}
];

function Map(){
    const MAP_TOKEN = 'pk.eyJ1Ijoianl1dW5uaWkiLCJhIjoiY2tkaGppZnBmMDBmZTJ1cHEwOGUxNzFnbyJ9.9zAelKZrHLxO7F7Zf2AOkg';
    
    const [viewport, setViewport] = useState({
        latitude: 37.401668,
        longitude: 127.111400,
        width: 400,
        height: 600,
        zoom: 16
    });

    return (
        <div>
           <StyledButton> Button </StyledButton>
            <div className = 'Map'>
                <ReactMapGL
                    {...viewport}
                    transitionDuration = {800}
                    transitionInterpolator = {new FlyToInterpolator()}
                    mapboxApiAccessToken = {MAP_TOKEN}
                    mapStyle='mapbox://styles/mapbox/streets-v9'
                    onViewportChange = {viewport =>{
                        setViewport(viewport);
                    }}

                    >
                        <div className='navi-control'>
                            <NavigationControl/>
                        </div>
                        {
                            cafeList.map((c, i)=>(
                                <Marker
                                    key={i}
                                    latitude={c.location[0]}
                                    longitude={c.location[1]}>
                                    <button className='btn-marker'></button>
                                </Marker>
                                
                            ))
                        }
                </ReactMapGL>
            </div>  
        </div>
    );
}

export default Map;