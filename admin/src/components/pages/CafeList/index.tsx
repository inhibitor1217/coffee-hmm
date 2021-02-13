import React, { useContext, useEffect, useState } from 'react';
import { StyledFlexColumn } from '../../../utils/Styled';
import { TypeCafe } from '../../../utils/Type';
import CafeListBoard from '../../others/CafeListBoard';
import PageTitle from '../../others/PageTitle';
import './index.css';

import { getAllCafes } from '../../api';
import { TokenCtx } from '../../../context';

const CafeList = () => {
    const [cafes, setCafes] = useState<TypeCafe[]>([]);
    const [pageLoading, setPageLoading] = useState(false);
    const { hmmAdminTokenCtx } = useContext(TokenCtx);

    useEffect(() => {
        async function fetchData(){
            setPageLoading(true);
            await getAllCafes(hmmAdminTokenCtx, 'true').then(data => {
                if(data.cafe){
                    setCafes(data.cafe.list)
                }
            })     
        }
        if(hmmAdminTokenCtx !== ""){
            fetchData();
        }
        setPageLoading(false);
    }, [hmmAdminTokenCtx])

    return(
        <div>
             <StyledFlexColumn className="main-container">
                <PageTitle cafeId={"0"} name=""/>
                {cafes.length > 0 && <CafeListBoard cafes={cafes} pageLoading={pageLoading}/>}
            </StyledFlexColumn>
        </div>
       
    )
}

export default CafeList;