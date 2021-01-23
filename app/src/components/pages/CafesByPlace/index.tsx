import React, { useContext, useEffect, useState } from 'react';
import { SearchValueCtx } from '../../../context';
import { CafeInfo } from '../../../utils/type';
import { getAllCafesByName } from '../../api';
import CafeList from '../../others/CafeList';

const CafesByPlace = () => {
    // const location = useLocation();
    // const place = location.pathname.slice(6);

    const { searchValueCtx } = useContext(SearchValueCtx); //FIX: parameter 이용으로 대체
    const [cafes, setCafes] = useState<CafeInfo[]>([])

    useEffect(() => {
        async function fetchData(){
            await getAllCafesByName(searchValueCtx).then(data => {
                if(data){
                    setCafes(data);
                }        
            });

            // await getAllCafesByPlace(place).then(data => {
            //     if(data){
            //         setCafes(data);
            //     }
            // })
        }
        fetchData();
    },[searchValueCtx])

    return(
        <CafeList cafes={cafes}/>
    )
}

export default CafesByPlace;