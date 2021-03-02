import React, { useEffect, useState } from 'react';
import { StyledColumnFlex, StyledMainScale } from '../../../utils/styled';
import { TypeCafe, TypePlace } from '../../../utils/type';
import { getCafeListByPlace, getPlaceList } from '../../api';
import PlaceSlide from '../../others/PlaceSlide';
import CafeByPlace from '../../others/CafeByPlace';

const Intro = () => {
    const [places, setPlaces] = useState<TypePlace[]>([]);
    const [currentPlaceIndex, setCurrentPlaceIndex] = useState<number>(0);
    const [cafes, setCafes] = useState<TypeCafe[] | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            await getPlaceList().then(data => {
                if(data){
                    setPlaces(data.place.list)
                }
            })
        }
        fetchData();
    },[])

    useEffect(() => {
        if(places.length > 0){
            const fetchData = async (place: TypePlace) => {
                await getCafeListByPlace(place.name).then(data => {
                    if(data.cafe) {
                        setCafes(data.cafe.list);
                    }
                });
            }
            fetchData(places[currentPlaceIndex]);
        }
    }, [currentPlaceIndex, places])

    return(
        <StyledMainScale>
            {cafes && 
                <StyledColumnFlex className="intro">
                    <CafeByPlace cafes={cafes} />
                    <PlaceSlide places={places} currentPlaceIndex={currentPlaceIndex} setCurrentPlaceIndex={setCurrentPlaceIndex}/>
                </StyledColumnFlex>
            }  
        </StyledMainScale>
    )
}

export default Intro;