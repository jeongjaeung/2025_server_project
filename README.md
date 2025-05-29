## 📘 2025 시험 일정 관리 웹 서비스

- 프로젝트 목적: 학생 간 시험 일정 공유와 중복 피하기!
- 대학에서 **시험 일정을 등록하고 확인**할 수 있는 간단한 웹 서비스.  
- Flask로 백엔드를 구성하고, MySQL로 데이터를 관리.
  
---

## ✅ 설치 (Installation)

### 1️⃣ 필수 패키지 설치

```bash
pip install -r requirements.txt
```

### 2️⃣ MySQL에 데이터베이스 및 테이블 생성

- MySQL이 실행 중이어야 하며, 본인의 MySQL 환경에 맞는 비밀번호를 입력:

```bash
mysql -u root -p < init_student_db.sql
```

- 관리자 권한을 가진 유저를 추가하고 싶다면, 아래 명령어로 접근 후 수동 삽입 가능:
```ruby
mysql -u root -p
USE student_db;
SELECT * FROM users;
UPDATE users SET is_admin = TRUE WHERE student_id = '관리자_학번';
```

### 3️⃣ 서버 실행

```bash
python app.py
```

---

## 🛠️ 사용 기술 (Tech Stack)

- **Python 3.10+**
- **Flask** - 백엔드 웹 프레임워크
- **MySQL** - 데이터베이스
- **HTML / CSS / JS** - 프론트엔드 기본

---

## ✅ 필수기능:
- 신규 일정 추가 (Create) 
- 일정 수정 (Update) 
- 일정 삭제 (Delete) 
- 전체 일정 조회 (Read) 
- Redirect와 JSON 사용 

---
 
## 📁 파일구조
```
  2025_server_project
  ├── app.py 
  ├── db_config.py 
  ├── init_student_db.sql 
  ├── requirements.txt 
  │
  ├── static/
  │   ├── images/
  │   ├── calendar.css
  │   ├── calendar.js
  │   ├── login.css
  │   ├── login.js
  │   ├── professor_main.css
  │   ├── professor_main.js
  │   ├── student_add.css 
  │   ├── student_add.js 
  │   ├── student_main.css 
  │   └── student_main.js 
  │
  ├── templates/ 
  │   ├── admin.html 
  │   ├── calendar.html 
  │   ├── login.html 
  │   ├── professor_main.html
  │   ├── student_add.html 
  │   └── student_main.html                                  
  │ 
  ├── .gitignore
  │ 
  └── README.md 
```
