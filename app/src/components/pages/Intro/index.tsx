import React, { useEffect, useState } from 'react';
import { openSearch } from '../../../utils/function';
import { StyledCarouselImage, StyledColumnFlex, StyledMainScale, StyledRowFlex } from '../../../utils/styled';
import { TypeCafe, TypePlace } from '../../../utils/type';
import { getCafeListByPlace, getPlaceList } from '../../api';
import CarouselHorizontal from '../../others/CarouselHorizontal';
import CarouselMainImage from '../../others/CarouselMainImage';
import PlaceSlide from '../../others/PlaceSlide';
import './index.css';

const Intro = () => {
    const [places, setPlaces] = useState<TypePlace[]>([]);
    const [place, setPlace] = useState<TypePlace | null>(null);
    const [cafes, setCafes] = useState<TypeCafe[]>([])
   
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
            setPlace(places[0]);
        }
    }, [places])

    useEffect(() => {
        const fetchData = async (place: TypePlace) => {
            await getCafeListByPlace(place.name).then(data => {
                if(data.cafe) {
                    setCafes(data.cafe.list);
                }
            });
        }
        if(place !== null){
            fetchData(place)
        } 
    }, [place])

    return(
        <StyledMainScale>
            <StyledColumnFlex className="intro">
                <div className="carousel-container">
                    <CarouselHorizontal title="Carousel">
                    {cafes?.map((cafe) => {
                        return(
                            <div key={cafe.id}>
                                <div className="cafe-preview-info">
                                    <h4>{cafe.name}</h4>
                                    <span className="cafe-preview-info-list">OPEN {cafe.metadata?.hour}</span>
                                    <span className="cafe-preview-info-list">{cafe.metadata?.tag}</span>
                                    <span className="cafe-preview-info-by">jyuunnii님이 올려주신 {cafe.name}</span>
                                </div>
                                <StyledCarouselImage key={cafe.id}>
                                    <CarouselMainImage cafe={cafe}/>
                                </StyledCarouselImage>
                                <StyledRowFlex className="cafe-preview-websearch">
                                    <span onClick={() => openSearch((cafe?.name || "")+" "+cafe?.place.name, "Naver")}>네이버 바로가기</span>
                                    <span onClick={() => openSearch((cafe?.name || ""), "Instagram")}>인스타그램 바로가기</span>       
                                </StyledRowFlex>
                            </div>
                    )})}
                    </CarouselHorizontal>
                </div>
                {place &&  <PlaceSlide places={places} currentPlace={place} setCurrentPlace={setPlace}/>}
            </StyledColumnFlex>
        </StyledMainScale>
    )
}

export default Intro;