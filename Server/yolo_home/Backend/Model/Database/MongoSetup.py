import sys
import json
from datetime import date
from pymongo.mongo_client  import MongoClient
from pymongo.server_api import ServerApi
import hashlib, binascii, os
import uuid
from flask_jwt_extended import create_access_token, create_refresh_token, unset_jwt_cookies,get_jwt_identity
from flask import session,request,jsonify,make_response
def hash_password(password: str):
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwhash = hashlib.pbkdf2_hmac('sha512',password.encode('utf-8'),salt,100000)
    pwhash = binascii.hexlify(pwhash)
    return (salt + pwhash).decode('ascii')
uri = "Your URI"

client = MongoClient(uri, server_api=ServerApi('uri'))
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
    
    def signIn():
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
        found = users.find_one_and_update({"email": email},{'$set': {'refresh_token': refresh_token}},return_document=True)
        if found is None:
            return jsonify({"msg": "Unknown error when working with database Mongo"}) , 400
        response = make_response(jsonify({"msg": "Successful login","token":access_token}))
        response.status = 200
        
        response.set_cookie('refresh_token' , refresh_token,httponly=True,secure=True,samesite='None',max_age=24*60*60)
        return response
        
        
    
    def signUp():
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
        return {"name": found['name']}

    def handleLogOut(refresh_token:str):
        found = users.find_one_and_update({"refresh_token": refresh_token}
                                          ,{'$set': {'refresh_token': ""}},return_document=True)
        if found is None:
            return jsonify({"msg": "Unknown error when working with database Mongo"}) , 400
        response = make_response(jsonify({"msg": "Successful log out"}))
        response.status = 200
        response.delete_cookie('refresh_token')
        return response
    def handleRefresh(refresh_token:str):
        found = users.find_one({"refresh_token": refresh_token})
        if found is None:
            return jsonify({"message": "Invalid refresh token"}), 401
        try:
            new_access_token = create_access_token(identity=found['email'])
            response = jsonify({"msg": "Successfully retrieve new token","token":new_access_token}) , 200
            return response 
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            response = jsonify({"msg": "Not valid JWT"}) , 403
            return response
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
        
        
