import requests
import json

from Argument import *

args = initialize()

env = str(args['env'])
token = str(args['token'])

baseApi = 'https://' + env + '.api.coffee-hmm.inhibitor.io/place/'

def getPlaces():
    response = requests.get(baseApi + 'list').json()

    data = []

    for place in response['place']['list']:
        data.append(place['name'])

    return data
