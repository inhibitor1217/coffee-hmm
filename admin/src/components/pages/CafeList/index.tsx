import React, { useEffect, useState } from 'react';
import { StyledFlexColumn } from '../../../utils/Styled';
import { TypeCafe } from '../../../utils/Type';
import CafeListBoard from '../../others/CafeListBoard';
import PageTitle from '../../others/PageTitle';
import './index.css';

import { getAllCafes } from '../../api';

const CafeList = () => {
    const [cafes, setCafes] = useState<TypeCafe[]>([]);
    const [pageLoading, setPageLoading] = useState(false);
    
    useEffect(() => {
        async function fetchData(){
            setPageLoading(true);
            await getAllCafes().then(data => {
                if(data.cafe){
                    setCafes(data.cafe.list)
                }
            })
        }
        fetchData();
        setPageLoading(false);
    }, [])

    return(
        <div>
            {cafes.length > 0 && 
             <StyledFlexColumn className="main-container">
                <PageTitle cafeId={0} name=""/>
                <CafeListBoard cafes={cafes} pageLoading={pageLoading} setPageLoading={setPageLoading}/>
            </StyledFlexColumn>
            }
        </div>
       
    )
}

export default CafeList;