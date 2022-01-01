import { SERVER_URL } from "constants/common";

// Cafe
export const getCafeListByPlace = async (place: string) => {
  const cafes = await fetch(
    SERVER_URL + `/cafe/feed?limit=64&placeName=${place}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    },
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log("Error: ", error));

  return cafes;
};

export const getCafeList = async () => {
  const cafes = await fetch(SERVER_URL + `/cafe/list?limit=20`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log("Error: ", error));

  return cafes;
};

export const getPlaceList = async () => {
  const places = await fetch(SERVER_URL + `/place/list`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));

  return places;
};

export const getCafeById = async (cafeId: string) => {
  const cafe = await fetch(SERVER_URL + `/cafe/${cafeId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));

  return cafe;
};
