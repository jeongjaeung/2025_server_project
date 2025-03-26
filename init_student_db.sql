
-- ✅ 데이터베이스 생성 및 사용
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- ✅ users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    student_id VARCHAR(20) UNIQUE,
    password VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE
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

-- ✅ 예시 관리자 계정 (비밀번호는 SHA256 해시로 변경 후 삽입해야 함)
-- INSERT INTO users (name, student_id, password, is_admin)
-- VALUES ('관리자이름', '99999999', '여기에_해시된_비밀번호_삽입', TRUE);
