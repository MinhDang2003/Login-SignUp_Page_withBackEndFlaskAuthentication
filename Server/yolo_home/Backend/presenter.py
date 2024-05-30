from __future__ import annotations

from typing import Protocol
from flask import request,jsonify,make_response
from flask_jwt_extended import create_access_token, create_refresh_token, unset_jwt_cookies,get_jwt_identity
from functools import *
from Ada import AdaAPI,MongoAPI,hash_password
from datetime import date,datetime,time,timedelta
from statistics import mean 
import uuid


    
class Presenter:
    def __init__(self) -> None:
        pass
    @classmethod
    def processLst(cls,lst:list[dict]): 
        
        lst = ( list(filter(lambda x : x['value'] != [] , lst)) )
        if lst == []:
            return 0
        lst = list( map(lambda x: mean(x['value']),lst) )
        return mean(lst)
    
    
    @classmethod
    def handleSignUp(cls):
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
        if (MongoAPI.addUser(new_user)):
            return jsonify({"msg": "Successful sign up"}) , 200
        
        return jsonify({"msg": "Failed to sign up"}) , 400
    
    @classmethod
    def handleSignIn(cls):
        for item in ['saved','email','password']:
            if item not in request.json:
                return jsonify({"msg": "{} doesnt exisit".format(item.capitalize())}) ,400
        email = request.json.get("email",None)
        password = hash_password(request.json.get("password",None))
        if MongoAPI.checkUser(email,password) == False:
            return jsonify({"msg": "Wrong email or password"}) , 400
        
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        found = MongoAPI.updateRefreshToken(email,refresh_token)
        if found is None:
            return jsonify({"msg": "Unknown error when working with database Mongo"}) , 400
        
        response = make_response(jsonify({"msg": "Successful login","token":access_token}))
        response.status = 200
        response.set_cookie('refresh_token' , refresh_token,httponly=True,secure=True,samesite='None',max_age=24*60*60)
        return response
    
    @classmethod
    def handleLogOut(cls):
        if('refresh_token' not in request.cookies):
            return jsonify({"msg": "Cannot find refresh in cookie"}) , 400
        refresh_token = request.cookies.get('refresh_token',None)
        found = MongoAPI.updateRefreshToken(email=None,refresh_token=refresh_token,logout=True)
        if found is None:
            return jsonify({"msg": "Unknown error when working with database"}) , 400
        response = make_response(jsonify({"msg": "Successful log out"}))
        response.status = 200
        response.delete_cookie('refresh_token')
        return response
    
    @classmethod
    def handleRefresh(cls):
        if('refresh_token' not in request.cookies):
            return jsonify({"msg": "Cannot find refresh in cookie"}) , 400
        refresh_token = request.cookies.get("refresh_token")
        found = MongoAPI.getUserRecord(refresh_token)
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
    
    @classmethod
    def handleProfile(cls):
        email = get_jwt_identity()
        found = MongoAPI.getUserInfo(email)
        response_body = {
            "name": found["name"],
            "about" :"Hello! I'm a full stack developer that loves python and javascript"
        }
        return jsonify({"msg":"Successful get user info","user": response_body}), 200
    
    @classmethod
    def handleCheckEmail(cls):
        if 'email' in request.json:
            return jsonify({"msg": not (MongoAPI.checkUser(request.json["email"]))}) , 200
        return jsonify({"msg": "Email doesnt exist in request"}) , 400

    @classmethod
    def _handle_get_log(cls,choice:int,current=False):
        #0 for temp
        #1 for humid
        #2 for brightness
        
        help_dict = {0: 'temperature',1: 'humidity',2: 'brightness'}
        if current == True:
            start = datetime.combine(datetime.today(), time.min)
            end = datetime.combine(datetime.today(), time.min)
            res= MongoAPI.getLog(limit_record=1,start_date=start,end_date=end,current=True)
            
            current_log = None
            for item in res:
                print(item)
                current_log = item[help_dict[choice]]
            if current_log is None:
                current_log = 0
                #return jsonify({f"{help_dict[choice]}": current_log}) , 200
                return jsonify({f"value": current_log}) , 200
            #return jsonify({f"{help_dict[choice]}": (current_log[-1]['value'][-1])}) , 200
        
            return jsonify({f"value": (current_log[-1]['value'][-1])}) , 200
                
        if not ('option' in request.json):
            
            return jsonify({"msg": f"Invalid get {help_dict[choice]} request - missing option field"}) , 400
        
        option = request.json.get('option',None)
        if option not in [0,1,2]:
            return jsonify({"msg": f"Invalid option value {option}"}) , 400
        if option == 0:
            
            start = datetime.combine(datetime.today(), time.min) - timedelta(days=1)
            end = datetime.combine(datetime.today(), time.min)
            returnAr = Presenter._get_log_option(help_dict[choice],0,start,end)
            returnAr = list(map(lambda x : {'value': mean(x['value']),'hour': x['hour'].strftime("%H:%M %d/%m")} if x['value'] != [] else {'value': 0,'hour': x['hour'].strftime("%H:%M %d/%m")},returnAr ))
            
            return jsonify({f"{help_dict[choice]}": returnAr}) , 200
        elif option == 2:
            start = datetime.combine(datetime.today(), time.min) - timedelta(days=30)
            end = datetime.combine(datetime.today(), time.min)
            returnAr = Presenter._get_log_option(help_dict[choice],2,start,end)
            
            return jsonify({f"{help_dict[choice]}": returnAr}) , 200
        start = datetime.combine(datetime.today(), time.min) - timedelta(days=7)
        end = datetime.combine(datetime.today(), time.min)
        returnAr = Presenter._get_log_option(help_dict[choice],1,start,end)
        
        return jsonify({f"{help_dict[choice]}": returnAr}) , 200
    
    @classmethod
    def _get_log_option(cls,field:str,option: int,startdate:datetime|None = None,enddate:datetime|None = None):
        if option == 0:
            res =  MongoAPI.getLog(2,startdate,enddate)
            
            arr = []
            for i in res:
                arr =   arr + i[field]  
            length = len(arr)
            if length == 0:
                _date = enddate
                return [{'value': [], 'hour': _date + timedelta(hours=hour)} for hour in range(0,24)]
            if length == 24:
                return arr
            
            returnAr = []
            for i in range(48):
                if arr[-(i+1)]['value'] == [] and arr[-(i+1)]['hour'] > datetime.combine(datetime.today(), time(hour=datetime.now().hour)) :
                    continue
                returnAr = arr[:-(i)]
                break
            if len(returnAr) >= 24:
                return returnAr[-24:]
            if len(returnAr) == 0:
                _date = enddate
                return [{'value': [], 'hour': _date + timedelta(hours=hour)} for hour in range(0,24)]
            else: return returnAr + [{'value': [], 'hour': returnAr[-1]['hour'] + timedelta(hours=hour)} for hour in range(1,25-len(returnAr))] 
        if option == 1:
            limit = 7
        else: limit = 30
            
        res =  MongoAPI.getLog(limit,startdate,enddate)
        arr = []
        _date = startdate
        for i in res:
            while i['date'] != _date:    
                arr = arr + [{'value': 0 ,'date': _date.strftime("%d/%m")}]
                _date = _date + timedelta(days = 1)
            
            value = Presenter.processLst(i[field])
            arr = arr + [{'value': value ,'date': _date.strftime("%d/%m")}]
            _date = _date + timedelta(days = 1)
        return arr
    
    @classmethod
    def handle_get_temp(cls):
        return Presenter._handle_get_log(0)
    
    @classmethod
    def handle_get_humid(cls):
        return Presenter._handle_get_log(1)
    
    @classmethod
    def handle_get_brightness(cls):
        return Presenter._handle_get_log(2)
    
    @classmethod
    def handle_get_current_temp(cls):
        return Presenter._handle_get_log(0,True)
    
    @classmethod
    def handle_get_current_humid(cls):
        return Presenter._handle_get_log(1,True)
    
    @classmethod
    def handle_get_current_brightness(cls):
        return Presenter._handle_get_log(2,True)
    
    @classmethod
    def handle_add_temp(cls,val: float):
        try:
            AdaAPI().publishData(val,'temperature')
        except Exception as e:
            print(f"Error: {e}")
        else: 
            result = MongoAPI.addTemp(val)
            if result is None:
                return False
            return True 
    
    @classmethod
    def handle_add_humid(cls,val: float):
        try:
            AdaAPI().publishData(val,'humidity')
        except Exception as e:
            print(f"Error: {e}")
        else: 
            result = MongoAPI.addHumid(val)
            if result is None:
                return False
            return True 
    @classmethod
    def createNewRoom(cls):
        if 'room_id' not in request.json:
            return jsonify({"msg": "Invalid create new room request - missing room_id field"}) , 400
        room_id = request.json.get('room_id',None)
        result = MongoAPI.createNewRoom(room_id)
        if result:
            return jsonify({"msg": f"Successful added room: {room_id}"}) , 200
        else :
            return jsonify({"msg": f"room_id: {room_id} already exist"}) , 400
        
    @classmethod
    def deleteRoom(cls):
        if 'room_id' not in request.json:
            return jsonify({"msg": "Invalid delte room request - missing room_id field"}) , 400
        room_id = request.json.get('room_id',None)
        result = MongoAPI.deleteRoom(room_id)
        if not (result is None):
            return jsonify({"msg": f"Successful deleted room: {room_id}"}) , 200
        else :
            return jsonify({"msg": f"room_id: {room_id} doesnt exist"}) , 400
    
    @classmethod
    def addAppliances(cls):
        for item in ['room_id','appliance_id','appliance_type']:
            if item not in request.json:
                return jsonify({"msg": f"Invalid add appliances request - missing {item} field"}) , 400
        room_id = request.json.get("room_id",None)
        app_id = request.json.get("appliance_id",None)
        app_type = request.json.get("appliance_type",None)
        result = MongoAPI.addAppliance(room_id=room_id,app_id=app_id,app_type=app_type)
        if type(result) is str:
            return jsonify({"msg": result}) , 400
        if result is None:
            return jsonify({"msg": f"Failed to add {app_id} to room_id: {room_id}"}) , 400
        return jsonify({"msg": f"Successful added {app_id} to room_id: {room_id}"}) , 200 
    
    @classmethod
    def deleteAppliances(cls):
        for item in ['room_id','appliance_id']:
            if item not in request.json:
                return jsonify({"msg": f"Invalid delete appliances request - missing {item} field"}) , 400
        room_id = request.json.get("room_id",None)
        app_id = request.json.get("appliance_id",None)
        result = MongoAPI.deleteAppliance(room_id=room_id,app_id=app_id)
        if type(result) is str:
            return jsonify({"msg": result}) , 400
        if not (result is None):
            return jsonify({"msg": f"Successful deleted appliance: {app_id} from room: {room_id}"}) , 200
        else :
            return jsonify({"msg": f"Failed to delete appliance: {app_id} from room: {room_id}"}) , 400
    
    @classmethod
    def _updateAppliances(cls,app_type:str,val):
        for item in ['room_id','appliance_id']:
            if item not in request.json:
                return jsonify({"msg": f"Invalid update appliances request - missing {item} field"}) , 400
        room_id = request.json.get("room_id",None)
        app_id = request.json.get("appliance_id",None)
        result = MongoAPI.updateAppliance(room_id=room_id,app_id=app_id,app_type=app_type,val=val)
        return result
        
        
    @classmethod
    def handle_update_fan(cls):
        for item in ['room_id','appliance_id']:
            if item not in request.json:
                return jsonify({"msg": f"Invalid update appliances request - missing {item} field"}) , 400
        if 'level' not in request.json:
            return jsonify({"msg": "Invalid update fan request - missing level field"}) , 400
        level = request.json.get('level',None)
        if level < 0 or level > 100:
            return jsonify({"msg": "Invalid level - out of range"}) , 400
        try:
            #AdaAPI().publishData(level,'fan')
            print("update fan")
        except Exception as e:
            print(f"Error: {e}")
        else: 
            result = Presenter._updateAppliances('fan',level)
            if type(result) is str:
                return jsonify({"msg": result}) , 400
            if result is None:
                return jsonify({"msg": "Failed to update fan"}) , 400
            return jsonify({"msg": "Successful"}) , 200 
    
    @classmethod
    def handle_update_light(cls):
        for item in ['room_id','appliance_id']:
            if item not in request.json:
                return jsonify({"msg": f"Invalid update appliances request - missing {item} field"}) , 400
        if 'color' not in request.json:
            return jsonify({"msg": "Invalid update request light - missing color field"}) , 400
        color = request.json.get('color',None)
        if color not in ['#000000','#111111','#c4e024']:
            return jsonify({"msg": f"Invalid color {color}, must be one of {['#000000','#111111','#c4e024']}"}) , 400
        try:
            #AdaAPI().publishData(color,'light')
            print("update light")
        except Exception as e:
            print(f"Error: {e}")
        else: 
            result = Presenter._updateAppliances('light',color)
            if type(result) is str:
                return jsonify({"msg": result}) , 400
            if result is None:
                return jsonify({"msg": "Failed to update light"}) , 400
            return jsonify({"msg": "Successful"}) , 200 
    
    @classmethod
    def getAllRoom(cls):
        records = MongoAPI.getAllRoom()
        room = {'rooms': []}
        
        for record in records:
            
            room['rooms'].append(dict(record))
        return jsonify(({"msg": "Successful", "rooms": room["rooms"]})) , 200
    
    @classmethod
    def getRoom(cls):
        if 'room_id' not in request.json:
            return jsonify({"msg": "Invalid get room request - missing room_id field"}) , 400
        room_id = request.json.get('room_id',None)
        result = MongoAPI.getRoom(room_id)
        if not (result is None):
            return jsonify(({"msg": f"Successful get room: {room_id}",'rooms': dict(result)})) , 200
        else :
            return jsonify({"msg": f"room_id: {room_id} doesnt exist"}) , 400