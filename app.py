from flask import Flask
from flask import jsonify
import sqlite3

app = Flask(__name__)
conn = sqlite3.connect("mylectures.db")

def createTable(cursor):
    #create lectures table
    cursor.execute()

@app.route("/check_available",methods=["POST","GET"])
def check_available():
    return "true"

@app.route("/load_lessons",methods=["POST","GET"])
def load_lessons():
    data = [
        {"day_of_week":"Monday",
            "str_time":"12:00",
            "st_time":"14:00",
            "subject":"Design & Implementation",
            "venue":"SCC 106",
            "lec_name":"D. Waema",
            "lec_tel":"254724487464",
            "status":"cancelled",
            "coodinates":"-1.675845,35.45435"}
        ]
    return jsonify(data)

if __name__ == "__main__":

    app.run(debug=True,port=3000,host="0.0.0.0")