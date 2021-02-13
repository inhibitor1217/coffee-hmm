import React from 'react';
import { StyledFlexColumn, StyledFlexRow } from '../../../utils/Styled';
import { TypeCafe } from '../../../utils/Type';
import './index.css';

type CafeRegisterFormProps = {
    cafe: TypeCafe;
    setCafe: (cafe: TypeCafe) => void;
}

const CafeRegisterForm = ({cafe, setCafe}: CafeRegisterFormProps) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCafe({
        ...cafe,
        [name]: value
        });
    }

    return(
        <StyledFlexRow>
            <StyledFlexColumn className="basic-info-box basic-info-border">
                <span>카페 ID</span><span className="basic-value">{cafe.id === "0"? "-" : cafe.id}</span>
                <span>이름 Name</span>
                <input type="text" placeholder="카페 이름" name="name" value={cafe.name} onChange={onChange}/>
                <span>장소 Place</span>
                {/* <select name="place" value={cafe.place.name} onChange={onChange}>
                    <option value="">-</option>
                    <option value="강남">강남</option>
                    <option value="판교">판교</option>
                </select> */}
            </StyledFlexColumn>

            <StyledFlexColumn className="basic-info-box basic-info-border">
                <span>영업 시간 Hour</span>
                <div>
                    <input type="text" placeholder="9:00" name="openHour" value={cafe.metadata?.hour} onChange={onChange}/>
                </div>
                <span>상태 State</span>
                <select name="state" value={cafe.state} onChange={onChange}>
                    <option value="">-</option>
                    <option value="active">active</option>
                    <option value="hidden">hidden</option>
                </select>
                <span>카페 등록 일자 Created At</span><span className="basic-value">{cafe.createdAt === ""? "-" : cafe.createdAt}</span>
            </StyledFlexColumn>

            <StyledFlexColumn className="basic-info-box">
                <span>이미지 수 Images</span><span className="basic-value">{cafe.image.count === 0? "0" : cafe.image.list.length}</span>
                {/* <span>리뷰 수 Reviews</span><span className="basic-value">{cafe.reviews === 0? "0" : cafe.reviews}</span> */}
                <span>최근 수정 일자 Updated At</span><span className="basic-value">{cafe.updatedAt === ""? "-" : cafe.updatedAt}</span>
            </StyledFlexColumn>
        </StyledFlexRow>
    )
}

export default CafeRegisterForm;