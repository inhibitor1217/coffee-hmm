import React, { useEffect, useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';
import { LEFT, RIGHT } from '../../../utils/constant';
import { getOrder, reducerCarousel } from '../../../utils/function';
import { StyledRowCarouselBox, StyledCarouselSlot } from '../../../utils/styled';
import './index.css';

interface CarouselHorizontalProps {
    title: string;
    children?: React.ReactNode;
    setCurrentIndex: (index: number) => void;
}

const CarouselHorizontal = React.forwardRef<number, CarouselHorizontalProps>((props, ref) => {
    const [state, dispatch] = useReducer(reducerCarousel, {pos: 0, sliding: false, dir: RIGHT});
    const numItems = React.Children.count(props.children);

    useEffect(() => {
        if (typeof ref === 'function') {
            return;
        }

        React.Children.toArray(props.children).forEach((child, index) => {
            let order = getOrder(index, state.pos, numItems); 
            if(order === 1){
                props.setCurrentIndex(index);
            }
        })
    }, [numItems, props, props.children, ref, state.pos])

    const slide =  (dir: string) => {
        dispatch({type: dir, numItems: numItems});
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
                <StyledRowCarouselBox dir={state.dir} sliding={state.sliding} numItems={numItems}>
                    {React.Children.toArray(props.children).map((child, index) => (
                        <StyledCarouselSlot key={index} order={getOrder(index, state.pos, numItems)}>
                            {child}
                        </StyledCarouselSlot>
                    ))}
                </StyledRowCarouselBox>
            </div>
        </div>
    )
})

export default CarouselHorizontal;