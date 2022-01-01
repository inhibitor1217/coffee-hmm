import { Place } from "./place";

export interface Cafe {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  place: Place;
  state: string;
  image: {
    count: number;
    list: CafeImage[] | [];
  };
  views: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
  numLikes: number;
  metadata?: {
    creator?: string;
    hour?: string;
    tag?: string[];
  };
}

interface CafeImage {
  id: string;
  createdAt: string;
  updatedAt: string;
  cafeId: string;
  index: number;
  isMain: boolean;
  relativeUri: string;
  state: string;
  metadata?: {
    tag: string;
    width: number;
    height: number;
  };
}
