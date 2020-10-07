from google.cloud import firestore
from flask import jsonify

def getFires(request):
    db = firestore.Client()
    doc_ref = db.collection('fires').document('firesID')
    wildfires = doc_ref.get()
    wildfires = wildfires.to_dict()
    api = []
    for i in range(len(wildfires)):
        api.append({"id": str(i),"lat": "{:.4f}".format((float(wildfires[str(i)].split(",")[0]))),"long": "{:.4f}".format((float(wildfires[str(i)].split(", ")[1])))})
    return jsonify(api)
