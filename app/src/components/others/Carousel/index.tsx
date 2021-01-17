import React, { useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';
import { NEXT, PREV } from '../../../utils/constant';
import { StyledCarouselBox, StyledCarouselSlot } from '../../../utils/styled';
import './index.css';

const initialState = { pos: 0, sliding: false, dir: NEXT };
const getOrder = (index: number, pos: number, numItems:number) => {
    return (index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos);
}

const Carousel = (props: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const numItems = React.Children.count(props.children);
    const slide = (dir: string) => {
        dispatch({type: dir, numItems});
        setTimeout(() => {
            dispatch({type: "stopSliding"})
        }, 50);
    }
    const handlers = useSwipeable({
        onSwipedUp: () => slide(NEXT),
        onSwipedDown: () => slide(PREV),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    })

    return(
        <div {...handlers}> 
            <div className="carousel-wrapper">
                <StyledCarouselBox dir={state.dir} sliding={state.sliding}>
                    {React.Children.map(props.children, (child, index) => (
                        <StyledCarouselSlot key={index} order={getOrder(index, state.pos, numItems)}>
                            {child}
                        </StyledCarouselSlot>
                    ))}
                </StyledCarouselBox>
            </div>
        </div>
    )
}

const reducer = (state: any, {type, numItems}: any) => {
    switch(type){
        case "reset":
            return initialState;
        case PREV:
            return {
                ...state,
                dir: PREV,
                sliding: true,
                pos: state.pos === 0? numItems - 1 : state.pos - 1
            }
        case NEXT:
            return {
                ...state,
                dir: NEXT,
                sliding: true,
                pos: state.pos === numItems - 1? 0 : state.pos + 1
            }
        case "stopSliding":
            return {
                ...state,
                sliding: false
            }
        default:
            return state;
    }
}

export default Carousel;