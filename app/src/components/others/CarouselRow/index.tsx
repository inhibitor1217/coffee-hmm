import React, { useReducer } from 'react';
import { useSwipeable } from 'react-swipeable';
import { DOWN, LEFT, RIGHT, UP } from '../../../utils/constant';
import { StyledRowCarouselBox, StyledCarouselSlot } from '../../../utils/styled';
import './index.css';

const getOrder = (index: number, pos: number, numItems:number) => {
    return (index - pos < 0 ? numItems - Math.abs(index - pos) : index - pos);
}

const initialState = { pos: 0, sliding: false, dir: RIGHT };

const CarouselRow = (props: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);
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

const reducer = (state: any, {type, numItems}: any) => {
    switch(type){
        case "reset":
            return initialState;
        case DOWN:
            return {
                ...state,
                dir: DOWN,
                sliding: true,
                pos: state.pos === 0? numItems - 1 : state.pos - 1
            }
        case UP:
            return {
                ...state,
                dir: UP,
                sliding: true,
                pos: state.pos === numItems - 1? 0 : state.pos + 1
            }
        case RIGHT:
            return {
                ...state,
                dir: RIGHT,
                sliding: true,
                pos: state.pos === 0? numItems - 1 : state.pos -1
            }
        case LEFT:
            return {
                ...state,
                dir: LEFT,
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

export default CarouselRow;