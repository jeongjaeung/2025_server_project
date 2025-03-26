# 📘 2025 시험 일정 관리 웹 서비스

대학에서 **시험 일정을 등록하고 확인**할 수 있는 간단한 웹 서비스입니다.  
Flask로 백엔드를 구성하고, MySQL로 데이터를 관리합니다.

> 프로젝트 목적: 학생 간 시험 일정 공유와 중복 피하기!

---

## 🛠️ 사용 기술 (Tech Stack)

- **Python 3.10+**
- **Flask** - 백엔드 웹 프레임워크
- **MySQL** - 데이터베이스
- **HTML / CSS / JS** - 프론트엔드 기본

---

```
  2025_server_project
  ├── app.py # Flask 메인 서버 실행 파일 
  ├── db_config.py # MySQL 연결 정보 함수 
  ├── init_student_db.sql # 데이터베이스 및 테이블 초기화 SQL 스크립트 
  ├── requirements.txt # 필요한 패키지 목록
  
  
  ├── static/ # 정적 파일 (CSS / JS) 
  │ ├── form.css # 로그인/회원가입 화면 스타일 
  │ ├── student_add.css # 일정 추가 페이지 스타일 
  │ ├── student_add.js # 일정 추가 페이지 스크립트 
  │ ├── student_main.css # 메인(일정 목록) 페이지 스타일 
  │ └── student_main.js # 메인(일정 목록) 페이지 스크립트
  
  
  ├── templates/ # HTML 템플릿 (Flask 렌더링용)   
  │ ├── admin.html # 관리자용 전체 일정 조회 페이지 
  │ ├── calendar.html # 풀캘린더 UI 페이지 
  │ ├── login.html # 로그인 페이지 
  │ ├── register.html # 회원가입 페이지 
  │ ├── student_add.html # 시험 일정 추가 화면 
  │ ├── student_main.html # 학생 메인 페이지 (일정 목록) 
  │ └── thanks.html # 회원가입 완료 안내 페이지

```

---
