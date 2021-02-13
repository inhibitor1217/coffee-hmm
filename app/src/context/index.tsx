import {createContext} from 'react';

export const CarouselIndexCtx = createContext({
    carouselIndexCtx: 0,
    setCarouselIndexCtx: (index: number) => {}
})