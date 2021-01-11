import React from 'react';
import { StyledFlexColumn } from '../../../utils/Styled';
import PageTitle from '../../others/PageTitle';
import CafeRegisterBoard from '../../others/CafeRegisterBoard';
import './index.css';

const CafeRegister = () => {
    return(
        <StyledFlexColumn className="register-container">
            <PageTitle cafeId={0} name=""/>
            <CafeRegisterBoard/>
        </StyledFlexColumn>
    )
}

export default CafeRegister;