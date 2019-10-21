from flask import Flask
from flask import jsonify

app = Flask(__name__)

@app.route("/check_available",methods=["POST","GET"])
def check_available():
    return "true"

if __name__ == "__main__":
    app.run(debug=True,port=3000,host="0.0.0.0")