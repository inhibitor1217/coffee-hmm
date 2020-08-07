import React from 'react';
import './Board.css';

type CafesProps = {
    cafes: {
        title: string;
        lat: number;
    }[];
}

const Cafes = (props: CafesProps) =>{
    const getInfo = () => {
        
    }

    return (
        <div >
            {
                props.cafes.map((cafe) => 
                    <div id='space' style={{
                        width: Math.random() * 40 + 60,
                        // height: Math.random() * 30 + 40
                    }} key={cafe.title}>{cafe.title}</div>
                    
                )
            }
            <div id='infoArea'></div>
        </div>
    );
}

export default Cafes;