from Cafe import *

def createMetaTemplate():
    response = getAllCafes()

    data = {}
    data['cafes'] = []

    for cafe in response['cafes']:
        data['cafes'].append({
            'id': cafe['id']
        })

    with open('meta_template.json', "w", encoding='UTF-8-sig') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

createMetaTemplate()