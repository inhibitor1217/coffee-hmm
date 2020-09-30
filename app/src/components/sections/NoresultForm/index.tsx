import React from "react";
import styled from "styled-components";
import "./index.css";

const NContainer = styled.div`
  max-width: 360px;
  min-height: 480px;
  margin: auto;
  display: flex;
`;

const NWrapper = styled.div`
  max-width: 360px;
  height: 100px;
  margin: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

type NoresultFormProps = {
  data: string;
};

const NoresultForm = ({ data }: NoresultFormProps) => {
  return (
    <NContainer>
      <NWrapper>
        <div>
          <span className="material-icons-outlined result-icon">
            contact_support
          </span>
        </div>
        <div className="result-text">
          '{data}'&nbsp;에 대한 검색 결과가 없습니다.
        </div>
      </NWrapper>
    </NContainer>
  );
};

export default NoresultForm;
