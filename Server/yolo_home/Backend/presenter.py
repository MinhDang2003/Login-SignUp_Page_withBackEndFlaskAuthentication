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
    def handle_get_temp(cls):
        
        if not ('option' in request.json):
            
            return jsonify({"msg": "Invalid get temp request - missing option field"}) , 400
        
        option = request.json.get('option',None)
        if option not in [0,1,2]:
            return jsonify({"msg": f"Invalid option value {option}"}) , 400
        
        if option == 0:
            
            start = datetime.combine(datetime.today(), time.min) - timedelta(days=1)
            end = datetime.combine(datetime.today(), time.min)
            returnAr = Presenter.get_temp_option(0,start,end)
            returnAr = list(map(lambda x : {'value': mean(x['value']),'hour': x['hour'].strftime("%H:%M %d/%m")} if x['value'] != [] else {'value': 0,'hour': x['hour'].strftime("%H:%M %d/%m")},returnAr ))
            
            return jsonify({"temp": returnAr}) , 200
        elif option == 2:
            start = datetime.combine(datetime.today(), time.min) - timedelta(days=30)
            end = datetime.combine(datetime.today(), time.min)
            returnAr = Presenter.get_temp_option(2,start,end)
            
            return jsonify({"temp": returnAr}) , 200
        start = datetime.combine(datetime.today(), time.min) - timedelta(days=7)
        end = datetime.combine(datetime.today(), time.min)
        returnAr = Presenter.get_temp_option(1,start,end)
        
        return jsonify({"temp": returnAr}) , 200
        
        
        
    @classmethod
    def get_temp_option(cls,option: int,startdate:datetime|None = None,enddate:datetime|None = None):
        if option == 0:
            res =  MongoAPI.getTempHumid(2,startdate,enddate)
            
            arr = []
            for i in res:
                arr =   arr + i['temperature']  
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
            
        res =  MongoAPI.getTempHumid(limit,startdate,enddate)
        arr = []
        _date = startdate
        for i in res:
            while i['date'] != _date:    
                arr = arr + [{'value': 0 ,'date': _date.strftime("%d/%m")}]
                _date = _date + timedelta(days = 1)
                
            value = Presenter.processLst(i['temperature'])
            arr = arr + [{'value': value ,'date': _date.strftime("%d/%m")}]
            _date = _date + timedelta(days = 1)
        return arr
    
    @classmethod
    def get_humid_option(cls,option: int,startdate:datetime|None = None,enddate:datetime|None = None):
        if option == 0:
            res =  MongoAPI.getTempHumid(2,startdate,enddate)
            
            arr = []
            for i in res:
                arr =   arr + i['humidity']  
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
            
        res =  MongoAPI.getTempHumid(limit,startdate,enddate)
        arr = []
        _date = startdate
        for i in res:
            while i['date'] != _date:    
                arr = arr + [{'value': 0 ,'date': _date.strftime("%d/%m")}]
                _date = _date + timedelta(days = 1)
                
            value = Presenter.processLst(i['humidity'])
            arr = arr + [{'value': value ,'date': _date.strftime("%d/%m")}]
            _date = _date + timedelta(days = 1)
        return arr
    
    
    @classmethod
    def handle_get_humid(cls):
        if 'option' not in request.json:
            return jsonify({"msg": "Invalid get humid request - missing option field"}) , 400
        option = request.json.get('option',None)
        if option not in [0,1,2]:
            return jsonify({"msg": f"Invalid option value {option}"}) , 400
        option = request.json.get("option",None)
        
        if option == 0:
            start = datetime.combine(datetime.today(), time.min) - timedelta(days=1)
            end = datetime.combine(datetime.today(), time.min)
            returnAr = Presenter.get_humid_option(0,start,end)
            returnAr = list(map(lambda x : {'value': mean(x['value']),'hour': x['hour'].strftime("%H:%M %d/%m")} if x['value'] != [] else {'value': 0,'hour': x['hour'].strftime("%H:%M %d/%m")},returnAr ))
            return returnAr
        elif option == 2:
            start = datetime.combine(datetime.today(), time.min) - timedelta(days=30)
            end = datetime.combine(datetime.today(), time.min)
            returnAr = Presenter.get_humid_option(2,start,end)
            return returnAr
        start = datetime.combine(datetime.today(), time.min) - timedelta(days=7)
        end = datetime.combine(datetime.today(), time.min)
        returnAr = Presenter.get_humid_option(1,start,end)
        return returnAr
    
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
    def handle_update_fan(cls):
        if 'level' not in request.json:
            return jsonify({"msg": "Invalid update fan request - missing level field"}) , 400
        level = request.json.get('level',None)
        if level < 0 or level > 100:
            return jsonify({"msg": "Invalid level - out of range"}) , 400
        try:
            #AdaAPI().publishData(level,'fan')
            print("update light")
        except Exception as e:
            print(f"Error: {e}")
        else: 
            result = MongoAPI.updateFan(level)
            if result is None:
                return jsonify({"msg": "Failed to update fan"}) , 400
            return jsonify({"msg": "Successful"}) , 200 
    
    @classmethod
    def handle_update_light(cls):
        if 'color' not in request.json:
            return jsonify({"msg": "Invalid update request light - missing color field"}) , 400
        color = request.json.get('color',None)
        if color not in ['#000000','#111111','#c4e024']:
            return jsonify({"msg": "Invalid color"}) , 400
        try:
            #AdaAPI().publishData(color,'light')
            print("update light")
        except Exception as e:
            print(f"Error: {e}")
        else: 
            result = MongoAPI.updateLight(color)
            if result is None:
                return jsonify({"msg": "Failed to update light"}) , 400
            return jsonify({"msg": "Successful"}) , 200 
        