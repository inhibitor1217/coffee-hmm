import {createContext} from 'react';
import { initialCafe } from '../utils/constant';
import { CafeInfo } from '../utils/type';

export const SearchValueCtx = createContext({
    searchValueCtx: "",
    setSearchValueCtx: (data: string) => {}
})

export const CarouselIndexCtx = createContext({
    carouselIndexCtx: 0,
    setCarouselIndexCtx: (index: number) => {}
})

export const CafeCtx = createContext({
    cafeCtx: initialCafe,
    setCafeCtx: (cafe: CafeInfo) => {}
})