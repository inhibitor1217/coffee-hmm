import React from 'react';
import { StyledFlexColumn } from '../../../utils/Styled';
import { TypeImage } from '../../../utils/Type';
import Loading from '../../common/loading';
import CafeDetailImageTableColumns from '../CafeDetailImageTableColumns';
import CafeDetailImageTableRow from '../CafeDetailImageTableRow';
import './index.css';

type CafeDetailImageTableColumnsProps = {
    images: TypeImage[];
    imageLoading: boolean;
    isPreview: boolean;
    deletedImages: string[];
    setDeletedImages: (deletedReviews: string[]) => void;
    isCheckedAll: boolean;
    setCheckedAll: (isCheckedAll: boolean) => void;
}

const CafeDetailImageTable = ({images, imageLoading, isPreview, deletedImages, setDeletedImages, isCheckedAll, setCheckedAll}: CafeDetailImageTableColumnsProps) => {
    if(imageLoading){
        return <Loading/>
    }

    return(
        <StyledFlexColumn className="image-list">
            <CafeDetailImageTableColumns isPreview={isPreview} images={images}
                                        deletedImages={deletedImages} setDeletedImages={setDeletedImages}
                                        isCheckedAll={isCheckedAll} setCheckedAll={setCheckedAll}/>
            <div className="image-list-wrapper">
            {images.map((image, index) => {
                return(
                    <CafeDetailImageTableRow key={index} image={image} isPreview={isPreview} 
                                            deletedImages={deletedImages} setDeletedImages={setDeletedImages} 
                                            isCheckedAll={isCheckedAll}/>
                )
            })}
            </div>
            <div className="no-image-statement" style={{display: (images.length === 0)? "block" : "none"}}>등록된 이미지가 없습니다. 대표 이미지를 등록해주세요.</div>
        </StyledFlexColumn>
    )
}

export default CafeDetailImageTable;