import React, { useState } from 'react';
import { CafeRegisterValidation } from '../../../utils/Function';
import { StyledFlexRow } from '../../../utils/Styled';
import { TypeCafe } from '../../../utils/Type';
import CafeRegisterForm from '../CafeRegisterForm';
import './index.css';

const CafeRegisterBoard = () => {
    const [newCafe, setNewCafe] = useState<TypeCafe | null>(null);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(newCafe){
            if(CafeRegisterValidation(newCafe)){
                // fetch data CREATE a new cafe
            }
        }else{
            window.alert("카페 기본 정보를 모두 입력해주세요.")
        }
       
    }

    return(
        <div className="register-board-container">
            <form onSubmit={handleSubmit}>
                <StyledFlexRow className="register-title-button-wrapper">
                    <h3>신규 카페 등록</h3>
                    <button type="submit"><span>카페 등록 완료</span></button>
                </StyledFlexRow>
                <div className="register-basic-wrapper">
                    <h4>카페 기본 정보</h4>
                    {newCafe && <CafeRegisterForm cafe={newCafe} setCafe={setNewCafe}/>}
                </div>
            </form>
        </div>
    )
}

export default CafeRegisterBoard;