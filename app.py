from flask import Flask


app = Flask(__name__)

@app.route("/check_available",methods=["POST","GET"])
def check_available():
    return "true"