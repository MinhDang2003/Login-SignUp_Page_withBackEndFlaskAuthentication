from flask import Flask,jsonify,request,make_response
import json

from flask_jwt_extended import create_access_token, JWTManager,unset_jwt_cookies, jwt_required, get_jwt,get_jwt_identity
from flask_cors import CORS, cross_origin

from Backend.Model.Database.MongoSetup import MongoAPI

from datetime import datetime, timedelta, timezone


import uuid

app = Flask(__name__)
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# app.config['SESSION_USE_SIGNER'] = True
# app.config['SESSION_REDIS'] = redis.from_url("redis://127.0.0.1:6379")
# server_session = Session(app)
app.config["SECRET_KEY"] = b'6hc/_gsh,./;2ZZx3c6_s,1//'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=2)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)



app.config["JWT_SECRET_KEY"] = b"6hc/_gsh,./;2ZZx3c6_s,1//"

jwt = JWTManager(app)

@app.route('/users/refresh',methods=['GET'])
@jwt_required(refresh=True)
def refresh_expiring_jwts():
    try:
        
        
        new_access_token = create_access_token(identity=get_jwt_identity())
        response = jsonify({"msg": "Successfully retrieve new token","token":new_access_token}) , 200
        return response 
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        response = jsonify({"msg": "Not valid JWT"}) , 403
        return response
@app.route('/users/signin',methods=['POST'])
def signin():
    
    returnVal = MongoAPI().signIn()
    
    return returnVal
@app.route('/users/signup',methods=['POST'])
def signup():
    
    returnVal = MongoAPI().signUp()
    
    return returnVal
@app.route("/users/checkEmail",methods=['Post'])
def checkEmailAvailable():
    if 'email' in request.json:
        return jsonify({"msg": not (MongoAPI.checkUser(request.json["email"]))}) , 200
    return jsonify({"msg": "Email doesnt exisit"}) ,400
    
@app.route("/users/logout", methods=["POST"])
@jwt_required() 
def logout():
    response = (jsonify({"msg": "logout successful"}) , 200)
    unset_jwt_cookies(response[0])
    return response

@app.route('/users/profile',methods = ["GET"])
@jwt_required()
def my_profile():
    
    getData = MongoAPI.getUserInfo(get_jwt_identity())
    
    response_body = {
        "name": getData["name"],
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }

    return jsonify({"msg":"Successful get user info","user": response_body}), 200



@app.route("/api/temperature",methods=['GET'])
def temperature():
    return jsonify({
        "temp": [1,23,4]
    })



if __name__ == "__main__":
    # model = Model()
    # view = View()   
    # presenter = Presenter(model,view)
    app.run(debug=True,port=8090)
    
    