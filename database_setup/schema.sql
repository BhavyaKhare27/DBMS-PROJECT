CREATE DATABASE IF NOT EXISTS scholarship_db;
USE scholarship_db;

-- 1. Create Student Table
CREATE TABLE student (
  student_id INT PRIMARY KEY,
  name VARCHAR(100),
  gender VARCHAR(10),
  dob DATE,
  category VARCHAR(20),
  college VARCHAR(100),
  branch VARCHAR(50),
  year_of_study INT,
  email VARCHAR(100)
);

-- 2. Create Income Details Table
CREATE TABLE income_details (
  income_id INT PRIMARY KEY,
  student_id INT,
  annual_income INT,
  income_category VARCHAR(50),
  income_certificate_no VARCHAR(255),
  FOREIGN KEY (student_id) REFERENCES student(student_id)
);

-- 3. Create Academic Record Table
CREATE TABLE academic_record (
  record_id INT PRIMARY KEY,
  student_id INT,
  semester INT,
  cgpa FLOAT,
  backlog_count INT,
  attendance_percentage FLOAT,
  sem_1_cgpa FLOAT,
  sem_2_cgpa FLOAT,
  sem_3_cgpa FLOAT,
  sem_4_cgpa FLOAT,
  sem_5_cgpa FLOAT,
  sem_6_cgpa FLOAT,
  sem_7_cgpa FLOAT,
  sem_8_cgpa FLOAT,
  sem_1_attendance FLOAT,
  sem_2_attendance FLOAT,
  sem_3_attendance FLOAT,
  sem_4_attendance FLOAT,
  sem_5_attendance FLOAT,
  sem_6_attendance FLOAT,
  sem_7_attendance FLOAT,
  sem_8_attendance FLOAT,
  FOREIGN KEY (student_id) REFERENCES student(student_id)
);

-- 4. Create Scholarship Details Table
CREATE TABLE scholarship (
  scholarship_id INT PRIMARY KEY,
  name VARCHAR(255),
  provider VARCHAR(255),
  amount INT,
  type VARCHAR(50),
  max_income_limit INT,
  min_cgpa FLOAT,
  category_applicable VARCHAR(255),
  total_slots INT
);

-- 5. Create Applications Table
CREATE TABLE applications (
  application_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  scholarship_id INT,
  applied_date DATE,
  status VARCHAR(50),
  FOREIGN KEY (student_id) REFERENCES student(student_id),
  FOREIGN KEY (scholarship_id) REFERENCES scholarship(scholarship_id)
);
