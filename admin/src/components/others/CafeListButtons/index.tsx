import React from 'react';
import { StyledFlexRow } from '../../../utils/Styled';
import './index.css';

type CafeListButtonsProps = {
    isVisibleOnly: boolean;
    setVisibleOnly: (isVisibleOnly: boolean) => void;
}

const CafeListButtons = ({isVisibleOnly, setVisibleOnly}: CafeListButtonsProps) => {
    const handleVisibility = () => {
        if(isVisibleOnly){
            setVisibleOnly(false);
        }else{
            setVisibleOnly(true);
        }
    }

    return(
        <StyledFlexRow className="list-button-wrapper">
            <button className="cafe-register-button"><span>신규 카페 등록</span></button>
            <button className="cafe-visible-button" onClick={handleVisibility}><i className="material-icons">{isVisibleOnly? 'visibility_off' : 'visibility'}</i></button>
            <button className="cafe-refresh-button"><i className="material-icons">refresh</i></button>
        </StyledFlexRow>
    )
}

export default CafeListButtons;