from flask import Flask
from flask import jsonify
import sqlite3

app = Flask(__name__)
def conn():
    return sqlite3.connect("mylectures.db")

def createTable(conn):
    cursor = conn.cursor()
    #create lectures table
    lessons = """ CREATE TABLE IF NOT EXISTS lessons (
                        ID INTEGER PRIMARY KEY AUTOINCREMENT,
                        day_of_week text NOT NULL,
                        str_time text,
                        st_time text,
                        subject text,
                        venue text,
                        lec_name text,
                        lec_tel text,
                        status text,
                        coodinates text
                        ); """
    cursor.execute(lessons)
    conn.commit()

@app.route("/check_available",methods=["POST","GET"])
def check_available():
    return "true"

@app.route("/addlesson",methods=["POST","GET"])
def addLesson():
    sql = "INSERT INTO lessons(`day_of_week`,`str_time`,`st_time`,`subject`,`venue`,`lec_name`,`lec_tel`,`status`,`coodinates`) VALUES(?,?,?,?,?,?,?,?,?)"
    data = ("Monday","12:00","14:00","Design & Implementation","SCC 106","D. Waema","254724487464","cancelled","-1.675845,35.45435")
    con = conn()
    cursor = con.cursor()
    cursor.execute(sql,data)
    con.commit()

    return jsonify({"response":"Lessons Added Successfully","code":200})


@app.route("/load_lessons",methods=["POST","GET"])
def load_lessons():
    cursor = conn().cursor()
    sql = "SELECT * FROM lessons"
    data = cursor.execute(sql)
    data = data.fetchall()
    lessons = []
    for dt in data:
        lesson = {}
        lesson["day_of_week"] = dt[1]
        lesson["str_time"] = dt[2]
        lesson["st_time"] = dt[3]
        lesson["subject"] = dt[4]
        lesson["venue"] = dt[5]
        lesson["lec_name"] = dt[6]
        lesson["lec_tel"] = dt[7]
        lesson["status"] = dt[8]
        lesson["coodinates"] = dt[9]
        lessons.append(lesson)

    return jsonify(lessons)

if __name__ == "__main__":
    createTable(conn())
    app.run(debug=True,port=3000,host="0.0.0.0")