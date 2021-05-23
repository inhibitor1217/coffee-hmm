import React, { useEffect, useState } from 'react';
import { TypeImage } from '../../../utils/Type';
import './index.css';

type CafeDetailImageTableColumnsProps = {
    isPreview: boolean;
    images: TypeImage[];
    deletedImages: string[];
    setDeletedImages: (deletedReviews: string[]) => void;
    isCheckedAll: boolean;
    setCheckedAll: (isCheckedAll: boolean) => void;
}

const CafeDetailImageTableColumns = ({isPreview, images, deletedImages, setDeletedImages, isCheckedAll, setCheckedAll}: CafeDetailImageTableColumnsProps) => {
    const [isSortByCreatedAt, setSortByCreatedAt] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(isCheckedAll);

    useEffect(() => {
        setChecked(isCheckedAll);
        if(images.length >= 10){
            if(deletedImages.length !== 10){
                setChecked(false);
            }
        }else{
            if(deletedImages.length !== images.length){
                setChecked(false)
            }
        }
     }, [isCheckedAll, deletedImages, images])

    const handleCheckedAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked){
            setCheckedAll(true);
            const reviewIds = images.map(image => image.id.toString());
            setDeletedImages(reviewIds);
        }else{
            setCheckedAll(false);
            setDeletedImages([]);    
        }
    }

    const handleClick = () => {
        if(isSortByCreatedAt){
            setSortByCreatedAt(false);
        }else{
            setSortByCreatedAt(true);
        }
    }

    return(
        <ul className="image-column-wrapper">
            <li style={{display: isPreview? "none": "block", paddingRight: "0px"}}><input type="checkbox" onChange={handleCheckedAll} checked={checked}/></li>
            <li>IMAGE ID</li>
            <li>STATUS <i className="material-icons" style={{fontSize: "16px"}}>help_outline</i></li>
            <li>CREATED AT <i className="material-icons-round" onClick={handleClick}>{isSortByCreatedAt? `arrow_drop_up` : `arrow_drop_down`}</i></li>
        </ul>
    )
}

export default CafeDetailImageTableColumns;