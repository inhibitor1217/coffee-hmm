import React from 'react';
import './Board.css';

type CafesProps = {
    cafes: {
        title: string;
        lat: number;
    }[];
}

const Cafes = (props: CafesProps) =>{
    return (
        <div >
            {
                props.cafes.map((cafe) => 
                    <div id='space' key={cafe.title}>{cafe.title}</div>
                )
            }
        </div>
    );
}

export default Cafes;