import sys
import json
from datetime import date
from pymongo.mongo_client  import MongoClient
from pymongo.server_api import ServerApi
import hashlib, binascii, os
import uuid
from flask_jwt_extended import create_access_token, create_refresh_token
from flask import session,request,jsonify
def hash_password(password: str):
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwhash = hashlib.pbkdf2_hmac('sha512',password.encode('utf-8'),salt,100000)
    pwhash = binascii.hexlify(pwhash)
    return (salt + pwhash).decode('ascii')
uri = "YOUR_URL"

client = MongoClient(uri, server_api=ServerApi('1'))
db = client.get_database('SmartHome')
records = db.Log
users = db.Users
users.create_index([("email", 1)],unique=True,sparse=True)
records.create_index([("date", 1)],unique=True,sparse=True)
class MongoAPI:
    def checkUser(email:str,password=None):
        found = users.find({
            "email": email
        })
        if len(list(found)) == 0:
            return False
        if len(list(found)) > 1:
            raise Exception("Email not unique ??")
        if not(password is None):
            for account in found:
                if account['password'] != password:
                    return False
        return True
    
    def addUser(new_user: dict):
        insert_result = users.insert_one(new_user)
        return insert_result.inserted_id
    
    def signIn(self):
        for item in ['saved','email','password']:
            if item not in request.json:
                return jsonify({"msg": "{} doesnt exisit".format(item.capitalize())}) ,400
        email = request.json.get("email",None)
        password = hash_password(request.json.get("password",None))
        saved = (request.json.get('saved',None))
        if MongoAPI.checkUser(email,password) == False:
            return jsonify({"msg": "Wrong email or password"}) , 400
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        return jsonify({"msg": "Successful login","token":access_token,"refresh":refresh_token}) , 200
        
        
    
    def signUp(self):
        for item in ['name','email','password']:
            if item not in request.json:
                return jsonify({"msg": "{} doesnt exisit".format(item.capitalize())}) ,400
        new_user = {
            "_id":  uuid.uuid4().hex,
            "name": request.json.get("name",None),
            "email": request.json.get("email",None),
            "password": hash_password(request.json.get("password",None))
        }
        if MongoAPI.checkUser(new_user["email"],None) == True:
            return jsonify({"msg": "Email already used"}) , 400
        MongoAPI.addUser(new_user)
        
        return jsonify({"msg": "Successful sign up"}) , 200
        
    def getUserInfo(email:str):
        found = users.find_one({
            "email": email
        },{"_id":0,"password":0,"email": 0})
        
        return {"name": "Minh"}

    def get_logged_in():
        if 'logged_in' in session:
            return session['logged_in']
        else: return False
    def createNewRecord():
        today = str(date.today())
        found = records.find({
            "date": today
        })
        if found.count == 0:
            post = {
                "date": today,
                "temperature": [],
                "humidity": []
            }
        
        
