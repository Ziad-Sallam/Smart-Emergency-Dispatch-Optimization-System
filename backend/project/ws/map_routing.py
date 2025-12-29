import requests
import json
# OSRM server (local or demo)
base_url = "http://router.project-osrm.org/route/v1/driving/"

def get_route(start, end):
    # Include full route geometry
    url = f"{base_url}{start};{end}?overview=full&geometries=geojson"

    response = requests.get(url)
    data = response.json()
    return data['routes'][0]['geometry']['coordinates']
