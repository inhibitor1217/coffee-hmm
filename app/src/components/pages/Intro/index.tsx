import React, { useEffect, useState } from 'react';
import { openSearch } from '../../../utils/function';
import { StyledColumnFlex, StyledMainScale, StyledRowFlex } from '../../../utils/styled';
import { TypeCafe, TypePlace } from '../../../utils/type';
import { getCafeListByPlace, getPlaceList } from '../../api';
import PlaceSlide from '../../others/PlaceSlide';
import CafeByPlace from '../../others/CafeByPlace';
import './index.css';

const Intro = () => {
    const [places, setPlaces] = useState<TypePlace[]>([]);
    const [currentPlaceIndex, setCurrentPlaceIndex] = useState<number>(0);
    const [cafes, setCafes] = useState<TypeCafe[] | null>(null)
    const [currentCafeIndex, setCurrentCafeIndex] = useState<number>(0);

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
                    <div className="carousel-container">
                        <div className="cafe-preview-info">
                            <h4>{cafes[currentCafeIndex]?.name}</h4>
                            <span className="cafe-preview-info-list">OPEN {cafes[currentCafeIndex]?.metadata?.hour}</span>
                            <span className="cafe-preview-info-by">{cafes[currentCafeIndex]?.metadata?.creator || 'jyuunnii'} 님이 올려주신 {cafes[currentCafeIndex]?.name}</span>
                        </div>
                        <CafeByPlace cafes={cafes} setCurrentCafeIndex={setCurrentCafeIndex}/>
                        <StyledRowFlex className="cafe-preview-websearch">
                            <span onClick={() => openSearch((cafes[currentCafeIndex]?.name)+" "+cafes[currentCafeIndex].place.name, "Naver")}>네이버 바로가기</span>
                            <span onClick={() => openSearch((cafes[currentCafeIndex]?.name), "Instagram")}>인스타그램 바로가기</span>       
                        </StyledRowFlex>
                    </div>
                    <PlaceSlide places={places} currentPlaceIndex={currentPlaceIndex} setCurrentPlaceIndex={setCurrentPlaceIndex}/>
                </StyledColumnFlex>
            }  
        </StyledMainScale>
    )
}

export default Intro;