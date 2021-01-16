import React, { useState } from 'react';
import { StyledFlexColumn } from '../../../utils/Styled';
import { Cafe } from '../../../utils/Type';
import CafeListBoard from '../../others/CafeListBoard';
import PageTitle from '../../others/PageTitle';
import './index.css';

const cafeList: Cafe[] = [
    {id: 1, name: "cafe1", place: "place", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-01", updatedAt:"2020-12-08", images: 2, reviews: 2 }, 
    {id: 2, name: "cafe2", place: "place", openHour: "9:00", closeHour: "19:00", status: "hidden", createdAt: "2020-12-02", updatedAt:"2020-12-08", images: 2, reviews: 4 }, 
    {id: 3, name: "cafe3", place: "place", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-03", updatedAt:"2020-12-08", images: 5, reviews: 6 }, 
    {id: 4, name: "cafe4", place: "place", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-04", updatedAt:"2020-12-08", images: 6, reviews: 8 }, 
    {id: 5, name: "cafe5", place: "place", openHour: "9:00", closeHour: "19:00", status: "hidden", createdAt: "2020-12-04", updatedAt:"2020-12-08", images: 7, reviews: 0 }, 
    {id: 6, name: "cafe6", place: "place", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-04", updatedAt:"2020-12-08", images: 1, reviews: 2 }, 
    {id: 7, name: "cafe7", place: "place", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-05", updatedAt:"2020-12-08", images: 0, reviews: 2 }, 
    {id: 8, name: "cafe8", place: "place", openHour: "9:00", closeHour: "19:00", status: "hidden", createdAt: "2020-12-05", updatedAt:"2020-12-08", images: 2, reviews: 2 }, 
    {id: 9, name: "cafe9", place: "place", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-06", updatedAt:"2020-12-08", images: 2, reviews: 2 }, 
    {id: 10, name: "cafe10", place: "place", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-06", updatedAt:"2020-12-08", images: 2, reviews: 2 }, 
    {id: 11, name: "cafe11", place: "place", openHour: "9:00", closeHour: "19:00", status: "hidden", createdAt: "2020-12-07", updatedAt:"2020-12-08", images: 2, reviews: 2 }, 
    {id: 12, name: "cafe12", place: "place", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-07", updatedAt:"2020-12-08", images: 2, reviews: 2 },
];

const CafeList = () => {
    // const [cafeList, setCafeList] = useState<Cafe[]>([]);
    const [pageLoading, setPageLoading] = useState(false);
    
    // useEffect(() => {
    //     async function fetchData(){
    //         setPageLoading(true);
    //         //fetch cafe list api .then(data => setCafeList(data));
    //         setPageLoading(false);
    //     }
    //     fetchData();
    // }, [])
    
    return(
        <StyledFlexColumn className="main-container">
            <PageTitle cafeId={0} name=""/>
            <CafeListBoard cafes={cafeList} pageLoading={pageLoading} setPageLoading={setPageLoading}/>
        </StyledFlexColumn>
    )
}

export default CafeList;