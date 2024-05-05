from flask import Flask , jsonify, request

from flask_jwt_extended import jwt_required , JWTManager

from flask_cors import CORS, cross_origin


from datetime import  timedelta 

 
from presenter import Presenter
import uuid

app = Flask(__name__)
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# app.config['SESSION_USE_SIGNER'] = True
# app.config['SESSION_REDIS'] = redis.from_url("redis://127.0.0.1:6379")
# server_session = Session(app)
app.config["SECRET_KEY"] = b'6hc/_gsh,./;2ZZx3c6_s,1//'
#app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=2)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(seconds=480)
app.config['SESSION_COOKIE_HTTPONLY'] = True
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)



app.config["JWT_SECRET_KEY"] = b"6hc/_gsh,./;2ZZx3c6_s,1//"

jwt = JWTManager(app)

@app.route('/users/refresh',methods=['GET'])
@jwt_required(optional=True,verify_type=True)
def refresh_expiring_jwts():    
    return Presenter.handleRefresh()

@app.route('/users/signin',methods=['POST'])
def signin():
    return Presenter.handleSignIn()

@app.route('/users/signup',methods=['POST'])
def signup():
    return Presenter.handleSignUp()

@app.route("/users/checkEmail",methods=['POST'])
def checkEmailAvailable():
    return Presenter.handleCheckEmail()
    
@app.route("/users/logout", methods=["POST"])
def logout():
    return Presenter.handleLogOut()
    
@app.route('/users/profile',methods = ["GET"])
@jwt_required()
def my_profile():
    return Presenter.handleProfile()

@app.route("/api/temperature",methods=['POST'])
def temperature():
    return Presenter.handle_get_temp()

@app.route("/api/humidity",methods=['POST'])
def humidity():
    return Presenter.handle_get_humid()

@app.route("/api/fan",methods=['POST'])
def fan():
    return Presenter.handle_update_fan()

@app.route("/api/light",methods=['POST'])
def light():
    return Presenter.handle_update_light()

if __name__ == "__main__":
    app.run(debug=True,port=8090)
    
    