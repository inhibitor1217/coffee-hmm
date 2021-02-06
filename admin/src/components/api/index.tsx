import { authServerUrl, serverUrl } from '../../utils/Const';

export const getToken = async (googleAccessToken: string) => {
    let token = await fetch(authServerUrl+`/token?id_token=${googleAccessToken}`, {
        headers:{
            "Content-Type": "application/json"
        },
        method: "GET",
    }).then(response => response.json())
    .then(data => {return data})
    .catch(error => console.log(error));

    return token;
}

export const getAllCafes = async () => {
    let cafes = await fetch(serverUrl+`/cafe/list?limit=20`, {
        headers:{
        "Content-Type": "application/json"
        },
        method: "GET"
    }).then(response => response.json())
    .then(data => {return data})
    .catch(error => console.log("Error: ", error));

    return cafes;
}

export const getCafeById = async (cafeId: string) => {
    let cafe = await fetch(serverUrl+`/cafe/${cafeId}`, {
        headers:{
            "Content-Type": "application/json"
            },
            method: "GET"
    }).then(response => response.json())
    .then(data => {return data})
    .catch(error => console.log(error));

    return cafe;
}

export const addNewCafe = async (cafe: {name: string, placeId: string, metadata: {hour: string, tag:string[]}, state: string}) => {
    await fetch(serverUrl+`/cafe`, {
        method: "POST",
        body: JSON.stringify(cafe)
    }).then(response => response.ok)
}

export const getPlaceList = async () => {
    await fetch(serverUrl + `/place/list`, {
        headers:{
            "Content-Type": "application/json"
        },
        method: "GET"
    }).then(response => response.json())
    .then(data => {return data})
    .catch(error => console.log(error));
}