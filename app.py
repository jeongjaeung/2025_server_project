from flask import Flask, request, jsonify, render_template, redirect, session
from db_config import get_connection
import hashlib
import pymysql.cursors
import json

app = Flask(__name__)
app.secret_key = 'project1234!!'

@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect('/login')

    if session.get('user_type') == 'professor':
        return redirect('/professor/dashboard')
    else:
        return redirect('/student/dashboard')

# ✅ 학생 대시보드
@app.route('/student/dashboard')
def student_dashboard():
    if 'user_id' not in session or session.get('user_type') != 'student':
        return redirect('/login')
    return render_template('student_main.html',
                           name=session['name'],
                           student_id=session['student_id'],
                           is_admin=session.get('is_admin', False))

# ✅ 교수 대시보드
@app.route('/professor/dashboard')
def professor_dashboard():
    if 'user_id' not in session or session.get('user_type') != 'professor':
        return redirect('/login')
    return render_template('professor_main.html',
                           name=session['name'],
                           professor_id=session['student_id'],
                           is_admin=session.get('is_admin', False))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name') or ''
        student_id = request.form['student_id']
        password = request.form['password']
        user_type = request.form.get('userType', 'student')
        courses = request.form.get('courses')  # 쉼표 구분 입력값

# 아래처럼 professor_code를 다양한 방식으로 받아보세요
        professor_code = request.form.get('professor_code') or \
                         request.values.get('professor_code') or \
                         request.data or \
                         request.args.get('professor_code')

        print('professor_code >>>', professor_code)
        if user_type == 'professor':
            professor_code = request.form.get('professor_code', '')
            if professor_code != 'rytn2025':
                return "교수 인증 코드가 올바르지 않습니다.", 400

        hashed_pw = hashlib.sha256(password.encode()).hexdigest()

        try:
            conn = get_connection()
            cursor = conn.cursor(pymysql.cursors.DictCursor)

            # 1. 사용자 등록
            sql = "INSERT INTO users (name, student_id, password, user_type) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (name, student_id, hashed_pw, user_type))
            user_id = cursor.lastrowid

           # 2. 교수라면 professor_profiles 등록 (관리자 권한 포함)
            if user_type == 'professor':
                 cursor.execute(
                     "INSERT INTO professor_profiles (user_id, professor_number, is_admin) VALUES (%s, %s, %s)", 
                     (user_id, student_id, 1)
                 )

            # 3. 과목 처리
            course_names = []
            if courses:
                try:
                    parsed = json.loads(courses)
                    if isinstance(parsed, list):
                        course_names = [str(c).strip() for c in parsed if str(c).strip()]
                    elif isinstance(parsed, str):
                        course_names = [c.strip() for c in parsed.split(',') if c.strip()]
                    else:
                        course_names = []
                except Exception:
                    course_names = [c.strip() for c in str(courses).split(',') if c.strip()]
            else:
                course_names = []

            for course_name in course_names:
                if not course_name:
                    continue

                # 존재 여부 확인
                cursor.execute("SELECT id FROM courses WHERE name = %s", (course_name,))
                course = cursor.fetchone()

                if course:
                    course_id = course['id']
                else:
                    cursor.execute("INSERT INTO courses (name) VALUES (%s)", (course_name,))
                    course_id = cursor.lastrowid

                # 관계 테이블에 저장
                if user_type == 'student':
                    cursor.execute("INSERT INTO student_courses (student_id, course_id) VALUES (%s, %s)", 
                                   (user_id, course_id))
                elif user_type == 'professor':
                    cursor.execute("INSERT INTO professor_courses (professor_id, course_id) VALUES (%s, %s)", 
                                   (user_id, course_id))


            conn.commit()
            conn.close()
            return redirect('/thanks')

        except Exception as e:
            return f"에러 발생: {str(e)}"

    # GET 요청 시는 단순히 register.html 렌더링 (직접 입력이라 과목 넘길 필요 없음)
    return render_template('register.html')


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

        if user:
            session['user_id'] = user['id']
            session['name'] = user['name']
            session['student_id'] = user['student_id']
            session['user_type'] = user['user_type']

            # 교수 여부 체크 (관리자 권한)
            if user['user_type'] == 'professor':
                cursor.execute("SELECT is_admin FROM professor_profiles WHERE user_id = %s", (user['id'],))
                prof_info = cursor.fetchone()
                session['is_admin'] = prof_info['is_admin'] if prof_info else False
            else:
                session['is_admin'] = False

            # 👉 과목 정보 저장
            if user['user_type'] == 'student':
                cursor.execute("""
                    SELECT c.id, c.name FROM student_courses sc
                    JOIN courses c ON sc.course_id = c.id
                    WHERE sc.student_id = %s
                """, (user['id'],))
                student_courses = cursor.fetchall()
                session['courses'] = student_courses  # [{id: 1, name: '과목명'}, ...]
            elif user['user_type'] == 'professor':
                cursor.execute("""
                    SELECT c.id, c.name FROM professor_courses pc
                    JOIN courses c ON pc.course_id = c.id
                    WHERE pc.professor_id = %s
                """, (user['id'],))
                professor_courses = cursor.fetchall()
                session['courses'] = professor_courses  # [{id: 1, name: '과목명'}, ...]

            conn.close()

            if user['user_type'] == 'professor':
                return redirect('/professor/dashboard')
            else:
                return redirect('/student/dashboard')
        else:
            conn.close()
            return render_template('login.html', error='학번 또는 비밀번호가 틀렸습니다.')

    return render_template('login.html')


# ✅ 로그아웃
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

# ✅ 일정 추가 (POST)
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

# ✅ 로그인한 사용자의 일정만 조회
@app.route('/api/schedules', methods=['GET'])
def get_user_schedules():
    if 'user_id' not in session:
        return jsonify([])

    conn = get_connection()
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        sql = "SELECT * FROM schedules WHERE user_id = %s"
        cursor.execute(sql, (session['user_id'],))
        result = cursor.fetchall()
    conn.close()
    return jsonify(result)

# ✅ 관리자: 전체 일정 조회
@app.route('/api/schedules/all', methods=['GET'])
def get_all_schedules():
    if not session.get('is_admin'):
        return jsonify({'status': 'forbidden'}), 403

    conn = get_connection()
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("""
            SELECT s.date, s.time, s.event, u.student_id 
            FROM schedules s
            JOIN users u ON s.user_id = u.id
        """)
        result = cursor.fetchall()
    conn.close()
    return jsonify(result)

# ✅ 일정 수정
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

# ✅ 일정 삭제
@app.route('/api/schedules/<int:schedule_id>', methods=['DELETE'])
def delete_schedule(schedule_id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM schedules WHERE id=%s", (schedule_id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'deleted'})

# ✅ 일정 추가/수정 화면
@app.route('/student_add.html')
def student_add():
    if 'user_id' not in session:
        return redirect('/login')
    return render_template('student_add.html')

# ✅ 캘린더 화면
@app.route('/calendar')
def calendar():
    if not session.get('user_id'):
        return redirect('/login')
    return render_template('calendar.html', is_admin=session.get('is_admin', False))

# ✅ 회원가입 후 안내 페이지
@app.route('/thanks')
def thanks():
    return render_template('thanks.html')

# ✅ 관리자 페이지
@app.route('/admin')
def admin_page():
    if not session.get('is_admin'):
        return redirect('/login')

    conn = get_connection()
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("SELECT * FROM schedules")
        schedules = cursor.fetchall()
    conn.close()
    return render_template('admin.html', schedules=schedules)

# 교수 과목을 반환하는 API
@app.route('/api/professor/courses')
def get_professor_courses():
    if 'user_id' not in session or session.get('user_type') != 'professor':
        return jsonify({'status': 'unauthorized'}), 401

    conn = get_connection()
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("""
            SELECT c.id, c.name AS subject
            FROM professor_courses pc
            JOIN courses c ON pc.course_id = c.id
            WHERE pc.professor_id = %s
        """, (session['user_id'],))
        courses = cursor.fetchall()
    conn.close()
    return jsonify(courses)


@app.route('/api/schedules/by-course')
def get_schedule_by_course():
    if not session.get('is_admin'):
        return jsonify({'status': 'forbidden'}), 403

    course_id = request.args.get('course_id')
    if not course_id:
        return jsonify({'status': 'missing course_id'}), 400

    try:
        course_id = int(course_id)
    except ValueError:
        return jsonify({'status': 'invalid course_id'}), 400

    conn = get_connection()
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        # 이 과목을 듣는 학생들
        cursor.execute("""
            SELECT sc.student_id
            FROM student_courses sc
            WHERE sc.course_id = %s
        """, (course_id,))
        student_ids = [row['student_id'] for row in cursor.fetchall()]

        print('[디버그] 전달받은 course_id:', course_id)
        print('[디버그] student_ids:', student_ids)

        if not student_ids:
            return jsonify([])

        placeholders = ','.join(['%s'] * len(student_ids))
        sql = f"""
            SELECT s.date, s.time, s.event, u.name
            FROM schedules s
            JOIN users u ON s.user_id = u.id
            WHERE s.user_id IN ({placeholders})
        """
        cursor.execute(sql, student_ids)
        result = cursor.fetchall()

        print('[디버그] 최종 일정:', result)
    
    conn.close()
    return jsonify(result)



# ✅ 앱 실행
if __name__ == '__main__':
    app.run(debug=True)
