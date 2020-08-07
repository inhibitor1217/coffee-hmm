import React from 'react';
import './Board.css';
import Cafes from './Cafes';

let cafeList = [
    {
        title: 'Water-White', 
        lat: 37.401251,
        lng: 127.110753,
        isVisited: true
    },
    {
        title: 'Cafe-Moire', 
        lat: 37.401399, 
        lng: 127.110903,
        isVisited: false
    },
    {
        title: 'Water-White1', 
        lat: 37.401251,
        lng: 127.110753,
        isVisited: true
    },
    {
        title: 'Water-White2', 
        lat: 37.401251,
        lng: 127.110753,
        isVisited: true
    },
    {
        title: 'Water-White3', 
        lat: 37.401251,
        lng: 127.110753,
        isVisited: true
    },
    {
        title: 'Water-White4', 
        lat: 37.401251,
        lng: 127.110753,
        isVisited: true
    },
    {
        title: 'Water-White5', 
        lat: 37.401251,
        lng: 127.110753,
        isVisited: true
    },
    {
        title: 'Water-White6', 
        lat: 37.401251,
        lng: 127.110753,
        isVisited: true
    },
    {
        title: 'Water-White7', 
        lat: 37.401251,
        lng: 127.110753,
        isVisited: true
    },
    {
        title: 'Water-White8', 
        lat: 37.401251,
        lng: 127.110753,
        isVisited: true
    },
];

const Board = ()=>{
    cafeList.sort(function(a,b){
        return a.lat < b.lat ? -1 : a.lat > b.lat ? 1 : 0;
    });

    return(
        <div id = "box">
            <Cafes cafes={cafeList} />
        </div>
    );
}


export default Board; 