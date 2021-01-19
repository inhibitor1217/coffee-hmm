import React, { useContext, useEffect, useReducer, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { CarouselIndexCtx } from '../../../context';
import { LEFT, RIGHT } from '../../../utils/constant';
import { getOrder, reducerCarousel } from '../../../utils/function';
import { StyledRowCarouselBox, StyledCarouselSlot } from '../../../utils/styled';
import './index.css';

const CarouselHorizontal = (props: any) => {
    const [state, dispatch] = useReducer(reducerCarousel, {pos: 0, sliding: false, dir: RIGHT});
    const numItems = React.Children.count(props.children);
    const divRef = useRef<HTMLDivElement>(null);
    const { setCarouselIndexCtx } = useContext(CarouselIndexCtx);

    useEffect(() => {
        if(divRef.current !== null){
            const order = divRef.current.getAttribute("order");
            if(order !== null){
                setCarouselIndexCtx(parseInt(order));
            } 
        }
    },)

    const slide =  (dir: string) => {
        dispatch({type: dir, numItems});
        setTimeout(() => {
            dispatch({type: "stopSliding"})
        }, 50);
    }
    const handlers = useSwipeable({
        onSwipedLeft: () => slide(LEFT),
        onSwipedRight: () => slide(RIGHT),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    })

    return(
        <div {...handlers}> 
            <div className="carousel-wrapper">
                <StyledRowCarouselBox dir={state.dir} sliding={state.sliding}>
                    {React.Children.map(props.children, (child, index) => (
                        <StyledCarouselSlot key={index} order={getOrder(index, state.pos, numItems)} ref={divRef}>
                            {child}
                        </StyledCarouselSlot>
                    ))}
                </StyledRowCarouselBox>
            </div>
        </div>
    )
}

export default CarouselHorizontal;