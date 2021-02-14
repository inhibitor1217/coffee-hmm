import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SliceReviewArray } from '../../../utils/Function';
import { StyledFlexColumn } from '../../../utils/Styled';
import { TypeCafe, TypeImage, TypeReview } from '../../../utils/Type';
import { getCafeById } from '../../api';
import CafeDetailBoard from '../../others/CafeDetailBoard';
import PageTitle from '../../others/PageTitle';
import './index.css';

const reviewsTest: TypeReview[] = [{id: 1, userId:1, status:"status", content:"", images:5, createdAt:"2020-12-01"}];


const CafeDetail = () => { 
    const { cafeId } = useParams<{cafeId: string}>();
    const [cafe, setCafe] = useState<TypeCafe | null>(null);
    const [images, setImages] = useState<TypeImage[]>([]);
    const [cafeLoading, setCafeLoading] = useState(false);
    const [reviews, setReviews] = useState<TypeReview[]>([]);
 
    useEffect(() => {
        async function fetchData(){ 
            setCafeLoading(true);        
            await getCafeById(cafeId).then(data => {
                if(data) {
                    setCafe(data.cafe)
                    setImages(data.cafe.image.list)
                }
            })
            setCafeLoading(false);
        }
        
        fetchData();
        setReviews(SliceReviewArray(reviewsTest));
    }, [cafeId])

    return(
        <div>
            {cafe && 
                <StyledFlexColumn className="detail-container">
                <PageTitle cafeId={cafeId} name={cafe.name}/>
                <CafeDetailBoard cafe={cafe} images={images} reviews={reviews} cafeLoading={cafeLoading} />
            </StyledFlexColumn>
            }
        </div>  
    )
}

export default CafeDetail;