import pandas as pd
from google.cloud import firestore

def updateDatabase(request):

    data = pd.read_csv('https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_USA_contiguous_and_Hawaii_24h.csv')

    wildfires = pd.DataFrame(data)
    wildfires = wildfires[wildfires['latitude'] >= 32.5121]
    wildfires = wildfires[wildfires['latitude'] <= 42.0126]
    wildfires = wildfires[wildfires['longitude'] >= -124.6509]
    wildfires = wildfires[wildfires['longitude'] <= -114.1315]

    wildfires = wildfires.drop(
        columns=['brightness', 'scan', 'track', 'acq_date', 'acq_time', 'satellite',
         'confidence', 'version', 'bright_t31','frp', 'daynight'])
        
    # Add a new document
    db = firestore.Client()

    doc_ref = db.collection('fires').document('firesID')

    wildfires_doc = {}

    for i in range(len(wildfires.index)):
        wildfires_doc[str(i)] = str(wildfires.loc[wildfires.index[i]].get('latitude')) + ', ' + str(wildfires.loc[wildfires.index[i]].get('longitude'))
    
    doc_ref.set(wildfires_doc, merge = False)

    #return request.args.get('lat')
    return 'database has updated'
