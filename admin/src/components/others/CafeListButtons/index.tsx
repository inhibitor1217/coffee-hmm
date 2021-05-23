import React from 'react';
import { Link } from 'react-router-dom';
import { StyledFlexRow } from '../../../utils/Styled';
import './index.css';

type CafeListButtonsProps = {
    showHidden: boolean;
    handleShowHidden: () => void;
    setSearchTarget: (searchTarget: string) => void;
}

const CafeListButtons = ({showHidden, handleShowHidden, setSearchTarget}: CafeListButtonsProps) => {
    return(
        <StyledFlexRow className="list-button-wrapper">
            <button className="cafe-register-button"><Link to="/register"><span>신규 카페 등록</span></Link></button>
            <button className="cafe-visible-button" onClick={handleShowHidden}><i className="material-icons">{showHidden? 'visibility_off' : 'visibility'}</i></button>
            <button className="cafe-refresh-button" onClick={() => setSearchTarget("")}><i className="material-icons">refresh</i></button>
        </StyledFlexRow>
    )
}

export default CafeListButtons;