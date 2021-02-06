import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TypeCafe } from '../../../utils/type';
import { getAllCafes } from '../../api';
import CafeList from '../../others/CafeList';
import NoSearchResult from '../../others/NoSearchResult';

const CafesByPlace = () => {
    const { place } = useParams<{place: string}>();
    const [cafes, setCafes] = useState<TypeCafe[]>([])

    useEffect(() => {
        async function fetchData(){
            await getAllCafes().then(data => {
                setCafes(data.cafe.list);
            });
        }
        fetchData();
    },[place])

    const isEmptyArray = (array: TypeCafe[]) => {
        return (! Array.isArray(array) || !array.length );
    }

    if(isEmptyArray(cafes)){
        return(
            <NoSearchResult searchValue={place}/>
        )
    }

    return(
        <CafeList cafes={cafes}/>
    )
}

export default CafesByPlace;