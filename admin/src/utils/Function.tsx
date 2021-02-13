import { ImagePreviewNumber, ReviewPreviewNumber } from "./Const";
import { TypeCafe, TypeImage, TypeReview } from "./Type";

export const CafeRegisterValidation = (cafe: TypeCafe) => {
    let letter = /^[가-힣a-zA-Z]+$/;
    // let time = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if(! letter.test(cafe.name)){
        return false;
    }

    if(cafe.place.name === ""){
        return false;
    }

    if(cafe.metadata?.hour === ""){
        return false;
    }

    if(cafe.state === ""){
        return false;
    }

    return true;
}

export const SliceImageArray = (array: TypeImage[]) => {
    if(array.length >= ImagePreviewNumber){
        return array.slice(0, ImagePreviewNumber);
    }else{
        return array;
    }
}

export const SliceReviewArray = (array: TypeReview[]) => {
    if(array.length >= ReviewPreviewNumber){
        return array.slice(0, ImagePreviewNumber);
    }else{
        return array;
    }
}