import {createContext} from 'react';

export const CarouselIndexCtx = createContext<{carouselIndexCtx: number | null, setCarouselIndexCtx: (index: number | null) => void}>({
    carouselIndexCtx: 0,
    setCarouselIndexCtx: (index: number | null) => {}
})