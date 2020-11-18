import { serverUrl } from "../../utils/constant";

export const getAllCafesByName = async (place: string) => {
    let cafes = await fetch(serverUrl+`?place=${place}`, {
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