export const serverUrl = "https://beta.api.coffee-hmm.inhibitor.io";

export const BIG_CAFE_IMAGE_SIZE = 320;
export const SMALL_CAFE_IMAGE_SIZE = 260;

export const UP = "UP";
export const DOWN = "DOWN";
export const LEFT = "LEFT";
export const RIGHT = "RIGHT";

export const initialCarouselState = { pos: 0, sliding: false, dir: null };

export const initialCafe = {
    id: 0,
    name: "",
    place: "",
    imageUris: [""],
    mainImageUri: "",
    americanoPrice: 0,
    floor: 0,
    viewCount: 0
}