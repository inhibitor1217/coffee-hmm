import { INITIAL_CAROUSEL_STATE } from "constants/initialState";
import { DOWN, LEFT, RIGHT, UP } from "constants/direction";

export default function reducerCarousel(state: any, action: any) {
  switch (action.type) {
    case "reset":
      return INITIAL_CAROUSEL_STATE;
    case DOWN:
      return {
        ...state,
        dir: DOWN,
        sliding: true,
        pos: state.pos === 0 ? action.numItems - 1 : state.pos - 1,
      };
    case UP:
      return {
        ...state,
        dir: UP,
        sliding: true,
        pos: state.pos === action.numItems - 1 ? 0 : state.pos + 1,
      };
    case RIGHT:
      return {
        ...state,
        dir: RIGHT,
        sliding: true,
        pos: state.pos === 0 ? action.numItems - 1 : state.pos - 1,
      };
    case LEFT:
      return {
        ...state,
        dir: LEFT,
        sliding: true,
        pos: state.pos === action.numItems - 1 ? 0 : state.pos + 1,
      };
    case "stopSliding":
      return {
        ...state,
        sliding: false,
      };
    default:
      return state;
  }
}
