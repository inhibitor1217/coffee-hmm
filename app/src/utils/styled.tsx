import styled from "styled-components";
import { DOWN, LEFT, RIGHT } from "./constant";

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

export const StyledColCarouselBox = styled.div<{dir?: string, sliding?: boolean}>`
    display: flex;
    flex-direction: column;
    transition: ${(props) => props.sliding? "none" : "all 1s ease 0s"};
    transform: ${(props) => {
        if (!props.sliding) return "translateY(calc(-14%))";
        if (props.dir === DOWN) return "translateY(calc(2*(-14%)))";
        return "translateY(calc(0%))";
    }};
`;

export const StyledRowCarouselBox = styled.div<{dir?: string, sliding?: boolean, numItems: number}>`
    display: flex;
    flex-direction: row;
    transition: ${(props) => props.sliding? "none" : "all 1s ease 0s"};
    transform: ${(props) => {
        // #image = 1
        if (props.numItems === 1) return "translateX(0%)"; 
        // #image = 2
        if (props.numItems === 2){ 
            if (!props.sliding && props.dir === LEFT) return "translateX(calc(-92%))";
            if(props.dir === LEFT) return "translateX(calc(7%))";

            if (!props.sliding && props.dir === RIGHT) return "translateX(calc(7%))";
            if(props.dir === RIGHT) return "translateX(calc(-92%))";
        }
        // #image > 2
        if (!props.sliding) return "translateX(calc(-92%))";
        if (props.dir === RIGHT) return "translateX(calc(2 * (-92% - 4%)))";
        return "translateX(8%)";     
    }};
`;

export const StyledCarouselSlot = styled.div<{order?: number}>`
    flex: 1 0 100%;
    flex-basis: 100%;
    order: ${(props) => props.order};
`;

export const StyledCarouselImage = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
`;