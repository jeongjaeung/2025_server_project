
-- ✅ 데이터베이스 생성 및 사용
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- ✅ users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    student_id VARCHAR(20) UNIQUE,
    password VARCHAR(100) NOT NULL,
    user_type ENUM('student', 'professor') NOT NULL,
    is_admin TINYINT(1) DEFAULT 0
);

-- ✅ professor_course 테이블 생성
CREATE TABLE IF NOT EXISTS professor_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- ✅ professor_profiles 테이블 생성
CREATE TABLE IF NOT EXISTS professor_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    professor_number VARCHAR(20) UNIQUE,
    is_admin TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- ✅ schedules 테이블 생성
CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date VARCHAR(10),
    event VARCHAR(100),
    time VARCHAR(50),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ✅ schedules 테이블 생성
CREATE TABLE IF NOT EXISTS student_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    UNIQUE (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- ✅ schedules 테이블 생성
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    professor_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES users(id)
);


-- ✅ 예시 관리자 계정 (비밀번호는 SHA256 해시로 변경 후 삽입해야 함)
-- INSERT INTO users (name, student_id, password, is_admin)
-- VALUES ('관리자이름', '99999999', '여기에_해시된_비밀번호_삽입', TRUE);
