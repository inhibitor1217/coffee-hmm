import React, { useState, useEffect } from 'react';
import Styled from 'styled-components';
import './Map.css';
import { listenerCount } from 'stream';

declare global{
    interface Window{
      kakao: any;
    }
  }

const Map = () => {
    useEffect(() =>{
        let container = document.getElementById('map');
        let options = {
          center: new window.kakao.maps.LatLng(37.401707, 127.110459),
          level: 1
        };
    
        let map = new window.kakao.maps.Map(container, options);

        let cafeList = [
            {
                title: 'Water-White', 
                latlng: new window.kakao.maps.LatLng(37.401251, 127.110753)
            },
            {
                title: 'Cafe-Moire', 
                latlng: new window.kakao.maps.LatLng(37.401399, 127.110903)
            }
        ];

        let markerImgSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        for(let i=0; i<cafeList.length; i++){
            let markerSize = new window.kakao.maps.Size(24,35);
            let markerImg = new window.kakao.maps.MarkerImage(markerImgSrc, markerSize);

            let marker = new window.kakao.maps.Marker({
                map: map,
                position: cafeList[i].latlng,
                title: cafeList[i].title,
                image: markerImg
            });
        }

      }, [])

    return (
        <div className='Map'>
            <div id='map' style={{width: '100vw', height: '100vh'}}></div>
        </div>
    );
}

export default Map;