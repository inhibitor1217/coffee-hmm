import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { initialCafe } from '../../../utils/constant';
import { getCafeById } from '../../api';
import CafeDetail from '../../others/CafeDetail';
import './index.css';

const Detail = () => {
    const location = useLocation();
    const id = location.pathname.slice(6);
    const [cafe, setCafe] = useState(initialCafe);

    useEffect(() => {
        async function fetchData(){
            await getCafeById(id).then(data => {
                if(data){
                    setCafe(data);
                }
            });
        }
        fetchData();
    }, [id])

    return(
        <div className="cafe-detail">
            <CafeDetail cafe={cafe}/>
        </div>
    )
}

export default Detail;