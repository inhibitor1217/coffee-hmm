import React, { useContext } from 'react';
import { ImageContext } from '../../context';
import { StyledFlexColumn, StyledFlexRow } from '../../utils/Styled';
import { TypeImage } from '../../utils/Type';
import './index.css';

type ImageModalProps = {
    setModalOpen: (isModalOpen: boolean) => void;
    image: TypeImage;
    isEditOn: boolean;
    setEditOn: (isEditOn: boolean) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({setModalOpen, image, isEditOn, setEditOn}) => {
    const {setImage} = useContext(ImageContext);
    
    const handleClick = () => {
        if(isEditOn){
          setEditOn(false);
        }else{
          setEditOn(true);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // fetch update review status
    }

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setImage({
          ...image,
          [name]: value
        });
    }

    return(
        <div className="modal-content-container">
            <button className="image-close-button" type="button" onClick={() => setModalOpen(false)}><i className="material-icons">close</i></button>
            <div className="image-image-box">image {image.imageUrl}</div>
            <StyledFlexColumn className="modal-content-wrapper">
                <div><span><i className="material-icons">mms</i>IMAGE ID</span><span className="image-category">{image.id}</span></div>
                <div><span><i className="material-icons">event</i>CREATED AT</span><span className="image-category">{image.createdAt}</span></div>
                <form onSubmit={handleSubmit}>
                    <StyledFlexRow>
                        <div>
                        <span><i className="material-icons">visibility</i>STATUS</span>
                        {isEditOn ? 
                        <span><select name="status" value={image.status} onChange={onChange}>
                                <option value="visible">visible</option>
                                <option value="hidden">hidden</option>
                        </select></span> : 
                        <span className="image-category">{image.status}</span>
                        }
                        </div>
                        <button className="image-edit-button" 
                                type="submit" 
                                onClick={handleClick}
                                style={{backgroundColor: isEditOn? "#2E3559":"#ffffff", color: isEditOn? "#ffffff":"#000000"}}
                        >{isEditOn? "변경 상태 저장":"리뷰 상태 변경"}</button>
                    </StyledFlexRow>
                </form>
            </StyledFlexColumn>
        </div>
    )
}

export default ImageModal;