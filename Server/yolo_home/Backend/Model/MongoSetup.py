
from datetime import date,datetime,time,timedelta
from pymongo.mongo_client  import MongoClient
from pymongo import ASCENDING
from pymongo.server_api import ServerApi
import random
import hashlib, binascii, os

def hash_password(password: str):
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwhash = hashlib.pbkdf2_hmac('sha512',password.encode('utf-8'),salt,100000)
    pwhash = binascii.hexlify(pwhash)
    return (salt + pwhash).decode('ascii')
uri = "mongodb+srv://minhdangquocminh03:VYG5T0R0rmS9MKZ0@cluster0.28iompk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi('1'))
db = client.get_database('SmartHome')
records = db.Log
users = db.Users
users.create_index([("email", 1)],unique=True,sparse=True)
records.create_index([("date", 1)],unique=True,sparse=True)

class MongoAPI():
    #Authentication
    
    @classmethod
    def checkUser(cls,email:str,password=None) -> bool:
        found = users.find({
            "email": email
        })
        if len(list(found)) == 0:
            return False
        if not(password is None):
            for account in found:
                if account['password'] != password:
                    return False
        return True
    
    @classmethod
    def addUser(cls,new_user: dict) -> bool:
        insert_result = users.insert_one(new_user)
        if insert_result.inserted_id:
            return True
        else:
            return False
        
    
    @classmethod
    def updateRefreshToken(cls,email:str|None = None,refresh_token:str|None = None,logout = False) -> dict:
        if email is None and refresh_token is None:
            return None
        if email is not None and refresh_token is not None:
            found = users.find_one_and_update({"email": email},{'$set': {'refresh_token': refresh_token}},return_document=True)
            return found
        if logout == True:
            found = users.find_one_and_update({"refresh_token": refresh_token}
                                            ,{'$set': {'refresh_token': ""}},return_document=True)
            return found
        return None
    
    @classmethod
    def getUserInfo(cls,email:str) -> dict:
        found = users.find_one({
            "email": email
        })
        return found
   
    @classmethod
    def getUserRecord(cls,refresh_token:str) -> dict:
        found = users.find_one({"refresh_token": refresh_token})
        return found
        
    @classmethod
    def createNewRecord(cls,_date = datetime.combine(datetime.today(), time.min) ):
        

       # _date = _date - timedelta(days = 1)
    
        found = records.find_one({
            "date": _date
        })
        if found is None:
            post = {
                "date": _date,
                "temperature": [{'value': [], 'hour': _date + timedelta(hours=hour)} for hour in range(0,24)],
                "humidity": [{'value': [], 'hour': _date + timedelta(hours=hour)} for hour in range(0,24)],
                "light": "#000000",
                "fan": 0,
                "door_log": []
            }
            found = records.insert_one(post)
            return found.inserted_id
        return found['_id']
    
    @classmethod
    def addTemp(cls,temp: float,hour: int = datetime.now().hour,date = datetime.combine(datetime.today(), time.min)): 
        date = date - timedelta(days=5)
        id = MongoAPI.createNewRecord(date)
        hour = date + timedelta(hours=hour)
        if records.find_one({"_id": id,"temperature.hour": hour}) is None:
            
            result = records.find_one_and_update({"_id": id},{'$push': {'temperature': {'value': [temp],'hour': hour}}})
            return result
            
        return records.find_one_and_update({"_id": id, 'temperature.hour': hour},{'$push': {'temperature.$.value': temp}})
    
    @classmethod
    def addHumid(cls,humid: float,hour: int = datetime.now().hour,date = datetime.combine(datetime.today(), time.min)): 
        id = MongoAPI.createNewRecord(date)
        hour = date + timedelta(hours=hour)
        if records.find_one({"_id": id,"humidity.hour": hour}) is None:
            
            result = records.find_one_and_update({"_id": id},{'$push': {'humidity': {'value': [humid],'hour': hour}}})
            return result
        
        return records.find_one_and_update({"_id": id, 'humidity.hour': hour},{'$push': {'humidity.$.value': humid}})
    
    @classmethod
    def updateLight(cls,val: str):
        id = MongoAPI.createNewRecord()
        result = records.find_one_and_update({"_id": id},{"$set": {"light": val}})
        return result
    
    @classmethod
    def updateFan(cls,val: float):
        id = MongoAPI.createNewRecord()
        result = records.find_one_and_update({"_id": id},{"$set": {"fan": val}})
        return result
    
    @classmethod
    def getTempHumid(cls,limit_record: int,start_date: datetime,end_date : datetime = datetime.combine(datetime.today(), time.min)):
        res = records.find({
            'date': {
                '$gte': start_date,
                '$lte': end_date
            }
        }).limit(limit_record)
        
        return res
    
    
        
        
    
    
    
# result = None
for i in range(0,4):
    #MongoAPI.addTemp(random.uniform(20, 40),i)
    result = MongoAPI.addTemp(random.uniform(20, 40),i)
    result = MongoAPI.addTemp(random.uniform(20, 40),i)
    result = MongoAPI.addTemp(random.uniform(20, 40),i)

# res  = records.aggregate([
                
#                 {'$unwind': '$temperature'},
#                 {'$sort': {'temperature.hour': 1}},
#                 {'$group': {
#                     '_id': '$_id',
#                     'temperature': {'$push': '$temperature'}
#                 }},
            
#             ])
# for i in res:
#     print(i['temperature'])


