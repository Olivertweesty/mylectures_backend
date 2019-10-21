from flask import Flask
from flask import jsonify

app = Flask(__name__)

@app.route("/check_available",methods=["POST","GET"])
def check_available():
    return "true"