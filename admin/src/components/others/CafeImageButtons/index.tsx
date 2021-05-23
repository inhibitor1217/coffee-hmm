import React from 'react';
import { StyledFlexRow } from '../../../utils/Styled';
import './index.css';

type CafeImageButtonsProps = {
    setChangeInsert: (isChangeInsert: boolean) => void;
    setModalOpen: (isModalOpen: boolean) => void;
    setUploadImage: (isUploadImage: boolean) => void;
}

const CafeImageButtons = ({setChangeInsert, setModalOpen, setUploadImage}: CafeImageButtonsProps) => {
    const handleUpload = () => {
        setUploadImage(true);
        setModalOpen(true);
    }
    
    return(
        <StyledFlexRow className="list-button-wrapper">
            <button className="image-upload-button" onClick={handleUpload}><span>카페 사진 등록</span></button>
            <button type="submit" className="main-image-change-button" onClick={() => setChangeInsert(true)}><span>대표 사진 변경</span></button>
            <button type="submit" className="cafe-delete-button"><i className="material-icons">delete</i></button>
            <button className="cafe-refresh-button"><i className="material-icons">refresh</i></button>
        </StyledFlexRow>
    )
}

export default CafeImageButtons;