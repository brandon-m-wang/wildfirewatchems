import pandas as pd
import math
from google.cloud import firestore
from twilio.rest import Client


def calculate_distance(user_lon, user_lat, fire_lon, fire_lat):
    return math.sqrt((user_lon - fire_lon) ** 2 + (user_lat - fire_lat) ** 2)*110.574


def should_evacuate(distance, danger_level):
    if distance <= 0.5:
        ping_emergency()
        return True
    if danger_level == 5:
        if distance <= 22:
            return True
    elif danger_level == 4:
        if distance <= 17:
            return True
    elif danger_level == 3:
        if distance <= 13:
            return True
    elif danger_level == 2:
        if distance <= 10:
            return True
    elif danger_level == 1:
        if distance <= 6:
            return True
    return False

token = 'Anh Le'

def ping_emergency():
    client = Client("AC5dd88f3a1f281008e47f835d8f688175", "9e5776689807bcd6472996783dcb06aa")
    client.messages.create(to="+15129406636",
                           from_="+15153738738",
                           body= f'User: {token} is in danger at Long: -123.1380, Lat: 39.9260 currently at distance: 4km from wildfire contact.')

db = firestore.Client()
doc_ref = db.collection('fires').document('firesID')
wildfires = doc_ref.get()
wildfires = wildfires.to_dict()

def danger_level(fire):
    count = 0 #may need to implement conversion from series to 2-element array
    for i in range(1, len(wildfires)):
        if calculate_distance(fire[0], fire[1], float(wildfires[str(i)].split(",")[0]),
                              float(wildfires[str(i)].split(",")[1]) < 4.5):
            count+=1
    if count >= 9:
        return 5
    elif count >= 6:
        return 4
    elif count >=3:
        return 3
    elif count >= 1:
        return 2
    return 1

def shouldEvacuate(requests):

    user_longitude = requests.args.get('lon')
    user_latitude = requests.args.get('lat')
    #response = {'shouldEvacuate': False}
    #reponseTrue = {'shouldEvacuate': True}

    for i in range(len(wildfires)):
        fire = list(map(float, wildfires[str(i)].split(',')))
        danger = danger_level(fire)
        distance = calculate_distance(float(user_longitude), float(user_latitude), fire[1], fire[0])
        if should_evacuate(distance, danger):
            return {'shouldEvacuate': True}
    return {'shouldEvacuate': False}


