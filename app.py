from flask import Flask,flash, request
from flask import jsonify,send_from_directory
from werkzeug.utils import secure_filename
import os
import sqlite3


ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
UPLOAD_FOLDER = os.getcwd()
app = Flask(__name__)
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def conn():
    return sqlite3.connect("mylectures.db")

def insertintotable(sql,data):
    con = conn()
    cursor = con.cursor()
    cursor.execute(sql,data)
    con.commit()

def selectData(sql):
    cursor = conn().cursor()
    data = cursor.execute(sql)
    data = data.fetchall()
    return data

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploaddocument', methods=['POST'])
def upload_file():
    sql = "INSERT INTO notes(`unit_name`,`lecturer_name`,`doc_name`,`postdate`) VALUES(?,?,?,?)"
    lec_name = str(request.form.get("lecturer_name"))
    unit_name = str(request.form.get("unit_name"))
    postdate = str(request.form.get("post_date"))
    if request.method == 'POST':
    # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return jsonify({"response":"No file part"})
        file = request.files['file']
        if file.filename == '':
            flash('No file selected for uploading')
            return jsonify({"response":"Please Select a file"})
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            data = (unit_name,lec_name,filename,postdate)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            flash('File successfully uploaded')
            insertintotable(sql,data)
            return jsonify({"response":"Successfull"})
        else:
            flash('Allowed file types are txt, pdf, png, jpg, jpeg, gif')
            return jsonify({"response":"Failed"})

@app.route('/download/<path:filename>', methods=['GET', 'POST'])
def download(filename):
    uploads = os.path.join(current_app.root_path, app.config['UPLOAD_FOLDER'])
    return send_from_directory(directory=uploads, filename=filename)

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
    notes = """CREATE TABLE IF NOT EXISTS notes (
                      ID INTEGER PRIMARY KEY AUTOINCREMENT,
                      unit_name text,
                      lecturer_name text,
                      doc_name text,
                      postdate text  
                    );"""
    notices = """CREATE TABLE IF NOT EXISTS notices (
                      ID INTEGER PRIMARY KEY AUTOINCREMENT,
                      fromW text,
                      message text,
                      date text,
                      subject text  
                    );"""
    cursor.execute(notes)
    cursor.execute(notices)
    cursor.execute(lessons)
    conn.commit()


@app.route("/check_available",methods=["POST","GET"])
def check_available():
    return "true"

@app.route("/addlesson",methods=["POST","GET"])
def addLesson():
    sql = "INSERT INTO lessons(`day_of_week`,`str_time`,`st_time`,`subject`,`venue`,`lec_name`,`lec_tel`,`status`,`coodinates`) VALUES(?,?,?,?,?,?,?,?,?)"
    data = ("Monday","12:00","14:00","Design & Implementation","SCC 106","D. Waema","254724487464","cancelled","-1.675845,35.45435")
    insertintotable(sql,data)

    return jsonify({"response":"Lessons Added Successfully","code":200})

@app.route("/load_notes", methods = ["POST","GET"])
def load_notes():
    sql = "SELECT * FROM notes"
    notes = []
    data = selectData(sql)
    for item in data:
        notice = {}
        notice["unit_name"] = item[1]
        notice["lecturer_name"] = item[2]
        notice["doc_name"] = item[3]
        notice["postdate"] = item[4]
        notes.append(notice)
    return jsonify(notes)

@app.route("/load_notices", methods = ["POST","GET"])
def load_notices():
    sql = "SELECT * FROM notices"
    notices = []
    data = selectData(sql)
    for item in data:
        notice = {}
        notice["from"] = item[1]
        notice["message"] = item[2]
        notice["date"] = item[3]
        notice["subject"] = item[4]
        notices.append(notice)
    return jsonify(notices)

@app.route("/load_lessons",methods=["POST","GET"])
def load_lessons():
    sql = "SELECT * FROM lessons"
    data = selectData(sql)
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