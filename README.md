# 📘 2025 시험 일정 관리 웹 서비스

대학생들이 **시험 일정을 등록하고 확인**할 수 있는 간단한 웹 서비스입니다.  
Flask로 백엔드를 구성하고, MySQL로 데이터를 관리합니다.

> 프로젝트 목적: 학생 간 시험 일정 공유와 중복 피하기!

---

## 🛠️ 사용 기술 (Tech Stack)

- **Python 3.10+**
- **Flask** - 백엔드 웹 프레임워크
- **MySQL** - 데이터베이스
- **HTML / CSS / JS** - 프론트엔드 기본

---

## 📂 프로젝트 구조
📁 project/ ├── app.py # Flask 메인 서버 파일 ├── db_config.py # DB 연결 설정 ├── init_student_db.sql # DB 및 테이블 초기화 스크립트 ├── requirements.txt # 필요 패키지 목록 ├── templates/ # HTML 템플릿 │ ├── login.html │ ├── register.html │ ├── student_main.html │ ├── student_add.html │ └── calendar.html ├── static/ # CSS, JS 파일 │ ├── student_main.css │ ├── student_main.js │ └── ...
