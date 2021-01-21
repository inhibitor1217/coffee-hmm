import React, { useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';
import { DOWN, UP } from '../../../utils/constant';
import { getOrder, reducerCarousel } from '../../../utils/function';
import { StyledColCarouselBox, StyledCarouselSlot } from '../../../utils/styled';
import './index.css';

const CarouselVertical = (props: any) => {
    const [state, dispatch] = useReducer(reducerCarousel, {pos: 0, sliding: false, dir: UP});
    const numItems = React.Children.count(props.children);

    const slide = (dir: string) => {
        dispatch({type: dir, numItems: numItems});
        setTimeout(() => {
            dispatch({type: "stopSliding"})
        }, 50);
    }
    const handlers = useSwipeable({
        onSwipedUp: () => slide(UP),
        onSwipedDown: () => slide(DOWN),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    })

    return(
        <div {...handlers}> 
            <div className="carousel-wrapper">
                <StyledColCarouselBox dir={state.dir} sliding={state.sliding}>
                    {React.Children.map(props.children, (child, index) => (
                        <StyledCarouselSlot key={index} order={getOrder(index, state.pos, numItems)}>
                            {child}
                        </StyledCarouselSlot>
                    ))}
                </StyledColCarouselBox>
            </div>
        </div>
    )
}

export default CarouselVertical;