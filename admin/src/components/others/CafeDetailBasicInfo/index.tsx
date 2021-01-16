import React from 'react';
import { StyledFlexRow, StyledFlexColumn } from '../../../utils/Styled';
import { Cafe } from '../../../utils/Type';
import './index.css';

type CafeDetailBasicInfoProps = {
    cafe: Cafe;
}

const CafeDetailBasicInfo = ({cafe}: CafeDetailBasicInfoProps) => {
    return(
        <StyledFlexRow>
            <StyledFlexColumn className="basic-info-box basic-info-border">
                <span>카페 ID</span><span className="basic-value"><i className="material-icons">content_copy</i>{cafe.id}</span>
                <span>이름 Name</span><span className="basic-value">{cafe.name}</span>
                <span>장소 Place</span><span className="basic-value">{cafe.place}</span>
            </StyledFlexColumn>

            <StyledFlexColumn className="basic-info-box basic-info-border">
                <span>영업 시간 Hour</span><span className="basic-value">{cafe.openHour} ~ {cafe.closeHour}</span>
                <span style={{position: "relative"}}>상태 Status <i className="material-icons help-icon">help_outline</i></span><span className="basic-value">{cafe.status}</span>
                <span>카페 등록 일자 Created At</span><span className="basic-value">{cafe.createdAt}</span>
            </StyledFlexColumn>

            <StyledFlexColumn className="basic-info-box">
                <span>이미지 수 Images</span><span className="basic-value">{cafe.images} <i className="material-icons">open_in_new</i> </span>
                <span>리뷰 수 Reviews</span><span className="basic-value">{cafe.reviews} <i className="material-icons">open_in_new</i> </span>
                <span>최근 수정 일자 Updated At</span><span className="basic-value">{cafe.updatedAt}</span>
            </StyledFlexColumn>
        </StyledFlexRow>
    )
}

export default CafeDetailBasicInfo;