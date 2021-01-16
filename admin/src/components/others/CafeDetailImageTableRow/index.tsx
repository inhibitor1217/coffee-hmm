import React, { useContext, useEffect, useState } from 'react';
import { ImageContext, ModalContext } from '../../../context';
import { TypeImage } from '../../../utils/Type';
import './index.css';

type CafeDetailImageTableRowProps = {
    image: TypeImage;
    isPreview: boolean;
    deletedImages: string[];
    setDeletedImages: (deletedReviews: string[]) => void;
    isCheckedAll: boolean;
}

const CafeDetailImageTableRow = ({image, isPreview, deletedImages, setDeletedImages, isCheckedAll}: CafeDetailImageTableRowProps) => {
    const [checked, setChecked] = useState<boolean>(isCheckedAll);
    const {setModalOpen} = useContext(ModalContext);
    const {setImage} = useContext(ImageContext);

    useEffect(() => {
        setChecked(isCheckedAll);
     }, [isCheckedAll])

    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(e.target.checked){
            setChecked(true);
            setDeletedImages([
                ...deletedImages,
                value
            ]);
        }else{
            setChecked(false);
            setDeletedImages(deletedImages.filter(id => (id !== value)));
        }
    }

    const handleClick = () => {
        setModalOpen(true);
        setImage(image);
    }
    
    return(
        <ul className="image-row-wrapper">
            <li style={{display: isPreview? "none":"block", paddingRight: "0px"}}><input type="checkbox" name="reviewId" value={image.id} onChange={handleChecked} checked={checked}/></li>
            <li onClick={handleClick} style={{fontWeight: isPreview? "normal":"bold", textDecoration: isPreview? "none":"underline"}}>{image.id}</li>
            <li>{image.status}</li>
            <li>{image.createdAt}</li>
        </ul>
    )
}

export default CafeDetailImageTableRow;