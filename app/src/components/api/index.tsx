import { serverUrl } from "../../utils/constant";

// Cafe
export const getAllCafesByName = async (place: string) => {
    let cafes = await fetch(serverUrl+`/cafe/?place=${place}`, {
        headers:{
        "Content-Type": "application/json"
    },
    method: "GET"
    }).then(response => response.json())
    .then(dataJSON => JSON.stringify(dataJSON))
    .then(dataStr => JSON.parse(dataStr))
    .then(data => {return data})
    .catch((error) => console.log("Error: ", error));

    return cafes;
}

export const getCafeById = async (id: string) => {
    let cafe = await fetch(serverUrl+`/cafe/${id}`, {
        headers:{
            "Content-Type": "application/json",
        },
        method: "GET"
    }).then(response => response.json())
    .then(dataJSON => JSON.stringify(dataJSON))
    .then(dataStr => JSON.parse(dataStr))
    .then(data => {return data})
    .catch((error) => console.log("Error: ", error));

    return cafe;
}


// Place
export const getAllCafesByPlace = async (name: string) => {
    let cafes = await fetch(serverUrl+`/?place=${name}`, {
        headers:{
            "Content-Type": "application/json",
        },
        method: "GET"
    }).then(response => response.json())
    .then(dataJSON => JSON.stringify(dataJSON))
    .then(dataStr => JSON.parse(dataStr))
    .then(data => {return data})
    .catch((error) => console.log("Error: ", error));

    return cafes;
}