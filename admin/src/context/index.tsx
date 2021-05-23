import {createContext} from 'react';
import { InitialImage, InitialReview } from '../utils/Const';
import { TypeImage, TypeReview } from '../utils/Type';

export const ModalContext = createContext({
    isModalOpen: false,
    setModalOpen: (isModalOpen: boolean) => {}
})

export const ReviewContext = createContext({
    review: InitialReview,
    setReview: (review: TypeReview) => {}
})

export const ImageContext = createContext({
    image: InitialImage,
    setImage: (image: TypeImage) => {}
})

export const TokenCtx = createContext({
    hmmAdminTokenCtx: "",
    setHmmAdminTokenCtx: (token: string) => {}
})