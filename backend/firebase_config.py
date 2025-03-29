import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("C:\\Users\\yajur\\Desktop\\\mood notes\\mood-notes\\backend\\service-account.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
