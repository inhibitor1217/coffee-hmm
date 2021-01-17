import styled from "styled-components";
import { PREV } from "./constant";

export const StyledMainScale = styled.div`
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
`;

export const StyledColumnFlex = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const StyledRowFlex = styled.div`
    display: flex;
    flex-direction: row;
`;

export const StyledRowFlexCenter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const StyledSpinnerContainer = styled.div<{ visible: boolean, size: number }>`
    justify-content: center;
    align-items: center;
    display: none;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    ${(props) => props.visible && "display: flex;"}
`;

export const StyledCarouselBox = styled.div<{dir?: string, sliding?: boolean}>`
    display: flex;
    flex-direction: column;
    transition: ${(props) => props.sliding? "none" : "all 1s ease 0s"};
    transform: ${(props) => {
        if (!props.sliding) return "translateY(calc(-10%))";
        if (props.dir === PREV) return "translateY(calc(2 * (-10%)))";
        return "translateY(5%)";
    }}
`;

export const StyledCarouselSlot = styled.div<{order?: number}>`
    flex: 1 0 100%;
    flex-basis: 80%;
    margin-right: 20px;
    order: ${(props) => props.order};
    padding-bottom: 24px;
`;

export const StyledCarouselImage = styled.div`
    text-align: center;
    padding-left: 24px;
`;