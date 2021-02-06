import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TypeCafe } from '../../../utils/type';
import { getCafeById } from '../../api';
import CafeDetail from '../../others/CafeDetail';
import './index.css';

const Detail = () => {
    const { cafeId } = useParams<{cafeId: string}>();
    const [cafe, setCafe] = useState<TypeCafe | null>(null);

    useEffect(() => {
        async function fetchData(){
            await getCafeById(cafeId).then(data => {
                if(data){
                    setCafe(data.cafe);
                }
            });
        }
        fetchData();
    }, [cafeId])

    return(
        <div className="cafe-detail">
            {cafe && <CafeDetail cafe={cafe} setCafe={setCafe}/>}
        </div>
    )
}

export default Detail;