import requests
import json

from Argument import *
from Place import *

args = initialize()

env = str(args['env'])
token = str(args['token'])

baseApi = 'https://' + env + '.api.coffee-hmm.inhibitor.io/cafe/'


header = {
    'User-Agent': 'python-requests/2.27.1', 
    'Accept-Encoding': 'gzip, deflate', 
    'Accept': '*/*', 
    'Connection': 'keep-alive', 
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': 'Bearer ' + token
}

def getCafeByPlaceName(name):
    response = requests.get(baseApi + 'feed?limit=64&placeName=' + str(name)).json()
    return response['cafe']['list']


def getAllCafes():
    places = getPlaces()

    data = {}
    data['cafes'] = []

    for place in places:
        cafes = getCafeByPlaceName(place)
        data['cafes'] += cafes

    with open('cafes.json', "w", encoding='UTF-8-sig') as output_file:
        json.dump(data, output_file, indent=4, ensure_ascii=False)

    return data

def getCafe(id):
    return requests.get(baseApi + str(id))

def putCafe(id, requestBody):
    return requests.put(baseApi + str(id), headers=header, data=requestBody)


def addCafeMeta(cafeData, metadata, fieldName):
    newMeta = {
        **cafeData['cafe']['metadata'],
        fieldName: metadata
    }
    requestBody = json.dumps({
        'name': cafeData['cafe']['name'],
        'placeId': cafeData['cafe']['place']['id'],
        'state': cafeData['cafe']['state'],
        'metadata': newMeta
    })

    return putCafe(cafe['id'], requestBody)


def addAllCafesMeta(inputFile):
    with open(inputFile, encoding='utf-8-sig') as json_file:
        data = json.load(json_file)

    for cafe in data['cafes']:
        cafeData = getCafe(cafe['id']).json()

        newMeta = cafe['meta']['menus']
        response = addCafeMeta(cafeData, newMeta, 'menu')

        print(str(cafeData['cafe']['name']) + '의 메타데이터 수정 결과 : ' + str(response))

