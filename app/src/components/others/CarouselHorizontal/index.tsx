import React, { useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';
import { LEFT, RIGHT } from '../../../utils/constant';
import { getOrder, reducerCarousel } from '../../../utils/function';
import { StyledRowCarouselBox, StyledCarouselSlot } from '../../../utils/styled';
import './index.css';

const CarouselHorizontal = (props: any) => {
    const [state, dispatch] = useReducer(reducerCarousel, {pos: 0, sliding: false, dir: RIGHT});
    const numItems = React.Children.count(props.children);

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
                        <StyledCarouselSlot key={index} order={getOrder(index, state.pos, numItems)}>
                            {child}
                        </StyledCarouselSlot>
                    ))}
                </StyledRowCarouselBox>
            </div>
        </div>
    )
}

export default CarouselHorizontal;