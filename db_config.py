import pymysql

def get_connection():
    return pymysql.connect(
        host='localhost',
        user='root',              # 사용자 이름 (설치 시 기본값 root)
        password='project1234!!',  # 비밀번호 
        db='student_db',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
