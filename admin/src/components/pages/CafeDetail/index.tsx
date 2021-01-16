import React, { useEffect, useState } from 'react';
import { SliceImageArray, SliceReviewArray } from '../../../utils/Function';
import { StyledFlexColumn } from '../../../utils/Styled';
import { Cafe, TypeImage, TypeReview } from '../../../utils/Type';
import CafeDetailBoard from '../../others/CafeDetailBoard';
import PageTitle from '../../others/PageTitle';
import './index.css';

const cafe: Cafe = {id: 1, name: "cafe1", place: "판교", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-01", updatedAt:"2020-12-08", images: 2, reviews: 2 };
const reviewsTest: TypeReview[] = [{id: 1, userId:1, status:"status", content:"", images:5, createdAt:"2020-12-01"}];
const imagesTest: TypeImage[] = [
    {id: 1, imageUrl:"imageUrl", status:"visible", createdAt: "2020-12-01"}, 
    {id: 2, imageUrl: "imageUrl", status:"visible",createdAt: "2020-12-01"}, 
    {id: 3, imageUrl: "imageUrl", status:"hidden",createdAt: "2020-12-01"}
];


const CafeDetail = () => { 
    // const { cafeId } = useParams<{cafeId: string}>();
    // const [cafe, setCafe] = useState<Cafe>({id: 1, name: "cafename"});
    const [images, setImages] = useState<TypeImage[]>([]);
    const [imageLoading, setImageLoading] = useState(false);
    const [reviews, setReviews] = useState<TypeReview[]>([]);
    const [reviewLoading, setReviewLoading] = useState(false);

   
    useEffect(() => {
    //    async function fetchData(){         
    //        //fetch api by cafeId
    //    }
    //     async function fetchImageData(){
                setImageLoading(true);
    //             //fetch image data .then(data => setImages(data))
                setImageLoading(false);
    //     }
    //      async function fetchReviewData(){
                setReviewLoading(true);
    //     //fetch review data .thenm(data => setReviews(data))
                setReviewLoading(false);

    // }

    //    fetchData();
    //    fetchImageData();
    //    fetchReviewData();
        setImages(SliceImageArray(imagesTest));
        setReviews(SliceReviewArray(reviewsTest));
    }, [])

    return(
        <StyledFlexColumn className="detail-container">
            <PageTitle cafeId={cafe.id} name={cafe.name}/>
            <CafeDetailBoard cafe={cafe} images={images} imageLoading={imageLoading} reviews={reviews} reviewLoading={reviewLoading}/>
        </StyledFlexColumn>
    )
}

export default CafeDetail;