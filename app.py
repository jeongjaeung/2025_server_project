from flask import Flask, request, jsonify, render_template, redirect, session, url_for
from db_config import get_connection
import hashlib  # 비밀번호 암호화를 위한 모듈
import pymysql.cursors 
import pymysql

app = Flask(__name__)

app.secret_key = 'project1234!!'  # 세션을 위한 키! 아무 문자열로

@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect('/login')  # 로그인 안 되어 있으면 로그인 페이지로 이동

    return render_template(
        'student_main.html',
        name=session['name'],
        student_id=session['student_id'],
        is_admin=session.get('is_admin', False)
    )

# 일정 추가
@app.route('/api/schedules', methods=['POST'])
def add_schedule():
    if 'user_id' not in session:
        return jsonify({'status': 'unauthorized'}), 401

    data = request.get_json()
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = "INSERT INTO schedules (date, event, time, user_id) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (data['date'], data['event'], data['time'], session['user_id']))
    conn.commit()
    conn.close()
    return jsonify({'status': 'created'})

# 일정 수정
@app.route('/api/schedules/<int:schedule_id>', methods=['PUT'])
def update_schedule(schedule_id):
    data = request.get_json()
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = "UPDATE schedules SET date=%s, event=%s, time=%s WHERE id=%s"
        cursor.execute(sql, (data['date'], data['event'], data['time'], schedule_id))
    conn.commit()
    conn.close()
    return jsonify({'status': 'updated'})

# 일정 삭제
@app.route('/api/schedules/<int:schedule_id>', methods=['DELETE'])
def delete_schedule(schedule_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM schedules WHERE id=%s", (schedule_id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'deleted'})

# ✅ 로그인 한 사람만 접근 가능한 일정 추가 페이지
@app.route('/student_add.html')
def student_add():
    if 'user_id' not in session:
        return redirect('/login')
    return render_template('student_add.html')


# 회원가입 완료 후 이동 페이지
@app.route('/thanks')
def thanks():
    return render_template('thanks.html')

# 관리자용 전체 결과 확인 페이지
@app.route('/admin')
def admin_page():
    if not session.get('is_admin'):
        return redirect('/login')  # 또는 403 페이지

    conn = get_connection()
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("SELECT * FROM schedules")
        schedules = cursor.fetchall()
    conn.close()
    return render_template('admin.html', schedules=schedules)

# 회원가입
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        student_id = request.form['student_id']
        password = request.form['password']

        hashed_pw = hashlib.sha256(password.encode()).hexdigest()

        try:
            conn = get_connection()
            cursor = conn.cursor()
            sql = "INSERT INTO users (name, student_id, password) VALUES (%s, %s, %s)"
            cursor.execute(sql, (name, student_id, hashed_pw))
            conn.commit()
            conn.close()
            return redirect('/thanks')
        except Exception as e:
            return f"에러 발생: {str(e)}"

    return render_template('register.html')

# 로그인
import pymysql.cursors  # 추가해줘야 함

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        student_id = request.form['student_id']
        password = request.form['password']
        hashed_pw = hashlib.sha256(password.encode()).hexdigest()

        conn = get_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        sql = "SELECT * FROM users WHERE student_id = %s AND password = %s"
        cursor.execute(sql, (student_id, hashed_pw))
        user = cursor.fetchone()
        conn.close()

        if user:
            session['user_id'] = user['id']
            session['name'] = user['name']
            session['student_id'] = user['student_id']  
            session['is_admin'] = user['is_admin']  # ✅ 관리자 여부 저장
            return redirect('/')
        else:
            return render_template('login.html', error='학번 또는 비밀번호가 틀렸습니다.')

    return render_template('login.html')

# 로그아웃
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

@app.route('/calendar')
def calendar():
    if not session.get('is_admin'):
        return redirect('/login')  # 또는 403 페이지
    return render_template('calendar.html')

@app.route('/api/schedules', methods=['GET'])
def get_user_schedules():
    if 'user_id' not in session:
        return jsonify([])  # 비로그인 상태이면 빈 배열

    conn = get_connection()
    with conn.cursor() as cursor:
        sql = "SELECT * FROM schedules WHERE user_id = %s"
        cursor.execute(sql, (session['user_id'],))
        result = cursor.fetchall()
    conn.close()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

