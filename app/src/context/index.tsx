import {createContext} from 'react';

export const SearchValueCtx = createContext({
    searchValueCtx: "",
    setSearchValueCtx: (data: string) => {}
})

export const CarouselIndexCtx = createContext({
    carouselIndexCtx: 0,
    setCarouselIndexCtx: (index: number) => {}
})