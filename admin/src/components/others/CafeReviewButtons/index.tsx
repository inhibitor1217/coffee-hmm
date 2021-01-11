import React from 'react';
import { StyledFlexRow } from '../../../utils/Styled';
import './index.css';

const CafeReviewButtons = () => {
    return(
        <StyledFlexRow className="list-button-wrapper">
            <button type="submit" className="cafe-delete-button"><i className="material-icons">delete</i></button>
            <button className="cafe-refresh-button"><i className="material-icons">refresh</i></button>
        </StyledFlexRow>
    )
}

export default CafeReviewButtons;