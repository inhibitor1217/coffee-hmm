export type Cafe = {
    id: number;
    name: string;
    place: string;
    openHour: string;
    closeHour: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    images: number;
    reviews: number;
}

export type TypeImage = {
    id: number;
    imageUrl : string;
    status: string;
    createdAt: string;
}

export type TypeReview = {
    id: number;
    userId: number;
    status: string;
    content: string;
    images: number;
    createdAt: string;
}

export type TypeAWSPhoto = {
    album: string,
    photoKey: string | undefined,
    photoUrl: string,
    albumPhotosKey: string
}