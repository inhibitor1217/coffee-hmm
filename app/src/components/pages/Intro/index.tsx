import React, { useEffect, useState } from 'react';
import { openSearch } from '../../../utils/function';
import { StyledColumnFlex, StyledMainScale, StyledRowFlex } from '../../../utils/styled';
import { TypeCafe, TypePlace } from '../../../utils/type';
import { getCafeListByPlace, getPlaceList } from '../../api';
import PlaceSlide from '../../others/PlaceSlide';
import CafeByPlace from '../../others/CafeByPlace';
import InitialLoading from '../../others/InitialLoading';
import './index.css';

const Intro = () => {
    const [places, setPlaces] = useState<TypePlace[]>([]);
    const [currentPlaceIndex, setCurrentPlaceIndex] = useState<number>(0);
    const [cafes, setCafes] = useState<TypeCafe[] | null>(null)
    const [currentCafeIndex, setCurrentCafeIndex] = useState<number>(0);
    const [isImageReady, setIsImageReady] = useState<boolean>(false);

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
            {!isImageReady && <InitialLoading/> }
            {cafes && 
                <StyledColumnFlex className="intro" style={{display: isImageReady? 'block' : 'none'}}>
                    <div className="carousel-container">
                        <div className="cafe-preview-info">
                            <h4>{cafes[currentCafeIndex]?.name}</h4>
                            <span className="cafe-preview-info-list">OPEN {cafes[currentCafeIndex]?.metadata?.hour}</span>
                            <span className="cafe-preview-info-by">{cafes[currentCafeIndex]?.metadata?.creator || 'jyuunnii'} 님이 올려주신 {cafes[currentCafeIndex]?.name}</span>
                        </div>
                        <CafeByPlace cafes={cafes} setCurrentCafeIndex={setCurrentCafeIndex} isImageReady={isImageReady} setIsImageReady={setIsImageReady}/>
                        <StyledRowFlex className="cafe-preview-websearch">
                            <span onClick={() => openSearch((cafes[currentCafeIndex]?.name)+" "+cafes[currentCafeIndex].place.name, "Naver")}><b className="web-naver">N</b> 네이버 바로가기</span>
                            <span onClick={() => openSearch((cafes[currentCafeIndex]?.name), "Instagram")}><b className="web-instagram">I</b> 인스타그램 바로가기</span>       
                        </StyledRowFlex>
                    </div>
                    <PlaceSlide places={places} currentPlaceIndex={currentPlaceIndex} setCurrentPlaceIndex={setCurrentPlaceIndex}/>
                </StyledColumnFlex>
            }  
        </StyledMainScale>
    )
}

export default Intro;