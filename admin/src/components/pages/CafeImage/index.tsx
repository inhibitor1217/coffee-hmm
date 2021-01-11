import React, { useContext, useEffect, useState } from 'react';
import { ImageContext, ModalContext } from '../../../context';
import Modal from '../../../Modal';
import ImageModal from '../../../modalContents/imageModal';
import UploadImageModal from '../../../modalContents/uploadImageModal';
import { StyledFlexColumn } from '../../../utils/Styled';
import { Cafe, TypeImage } from '../../../utils/Type';
import CafeImageBoard from '../../others/CafeImageBoard';
import PageTitle from '../../others/PageTitle';
import './index.css';

const cafe: Cafe = {id: 1, name: "cafe1", place: "판교", openHour: "9:00", closeHour: "19:00", status: "visible", createdAt: "2020-12-01", updatedAt:"2020-12-08", images: 2, reviews: 2 };
const imageTest: TypeImage[] = [
    {id: 1, imageUrl:"imageUrl", status:"visible", createdAt: "2020-12-01"}, 
    {id: 2, imageUrl: "imageUrl", status:"visible",createdAt: "2020-12-01"}, 
    {id: 3, imageUrl: "imageUrl", status:"hidden",createdAt: "2020-12-01"}
]


const CafeImage = () => {
    const [images, setImages] = useState<TypeImage[]>([]); 
    const [imageLoading, setImageLoading] = useState(false);
    const [isCheckedAll, setCheckedAll] = useState<boolean>(false);
    const [isEditOn, setEditOn] = useState<boolean>(false);
    const [isUploadImage, setUploadImage] = useState<boolean>(false);
    const {isModalOpen, setModalOpen} = useContext(ModalContext);

    useEffect(() => {
//      async function fetchReviewData(){
            setImageLoading(true);
//     //fetch review data .thenm(data => setReviews(data))
            setImageLoading(false);
            setImages(imageTest);
    }, [])


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       // change status mode
    }

    const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // s3 upload new image
    }

    return(
        <ImageContext.Consumer>
            {image => {
                return(
                    <div>
                        <StyledFlexColumn className="image-container">
                            <PageTitle cafeId={cafe.id} name={cafe.name}/>
                            <CafeImageBoard name={cafe.name} images={images} imageLoading={imageLoading} 
                                                        isCheckedAll={isCheckedAll} setCheckedAll={setCheckedAll}
                                                        setUploadImage={setUploadImage}/>
                        </StyledFlexColumn>
                        <form onSubmit={handleSubmit}>
                            <Modal isModalOpen={isModalOpen}>
                                <ImageModal setModalOpen={setModalOpen} image={image.image} isEditOn={isEditOn} setEditOn={setEditOn}/>
                            </Modal>
                        </form>

                        <form onSubmit={handleUpload}>
                            <Modal isModalOpen={isModalOpen && isUploadImage}>
                                <UploadImageModal setModalOpen={setModalOpen} setUploadImage={setUploadImage}/>
                            </Modal>
                        </form>
                    </div>
                )
            }}
        </ImageContext.Consumer>
    )
}

export default CafeImage;