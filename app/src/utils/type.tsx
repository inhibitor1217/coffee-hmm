export type TypeCafe = {
    id: string,
    createdAt: string,
    updatedAt: string,
    name: string,
    place: TypePlace,
    metadata?: TypeCafeMetadata,
    state: string,
    image: TypeCafeImageList,
    views: TypeCafeViews,
    numLikes: number
}

export type TypePlace = {
    id: string,
    createdAt: string,
    updatedAt: string,
    name: string
}

export type TypeCafeImageList = {
    count: number,
    list: TypeCafeImage[] | []
}

export type TypeCafeImage = {
    id: string,
    createdAt: string,
    updatedAt: string,
    cafeId: string,
    index: number,
    isMain: boolean,
    metadata?: {
        tag: string,
        width: number,
        height: number
    },
    relativeUri: string,
    state: string
}

export type TypeCafeMetadata = {
    hour?: string
}

export type TypeCafeViews = {
    daily: number,
    weekly: number,
    monthly: number,
    total: number
}