
-- ✅ 데이터베이스 생성 및 사용
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- ✅ users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    student_id VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    user_type ENUM('student', 'professor') NOT NULL
);


-- ✅ professor_course 테이블 생성
CREATE TABLE IF NOT EXISTS professor_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ✅ professor_profiles 테이블 생성
CREATE TABLE IF NOT EXISTS professor_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    professor_number VARCHAR(30),
    is_admin TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ✅ schedules 테이블 생성
CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(10) NOT NULL,
    event VARCHAR(100) NOT NULL,
    time VARCHAR(30) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ✅ 과목명 테이블 생성
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- ✅ student_courses 테이블 생성
CREATE TABLE IF NOT EXISTS student_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);


-- ✅ 예시 관리자 계정 (비밀번호는 SHA256 해시로 변경 후 삽입해야 함)
-- INSERT INTO users (name, student_id, password, is_admin)
-- VALUES ('관리자이름', '99999999', '여기에_해시된_비밀번호_삽입', TRUE);
