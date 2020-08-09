import React from 'react';
import { Cafe } from './Cafes';
import './Filter.css';

interface FilterProps {
    setFilter(filter: () => (cafe: Cafe) => boolean): void;
}

const Filter = (props: FilterProps) =>{
    return(
    <div id='footer'>
        <button className='filters' onClick={() => props.setFilter(
            () => (cafe) => cafe.avgPrice >= 3000
        )}>filter 1</button>
        <button className='filters'>filter 2</button>
        <button className='filters'>filter 3</button>
    </div>
    );
}

export default Filter;