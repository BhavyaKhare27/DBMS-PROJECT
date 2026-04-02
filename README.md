# Scholarship Management Portal

## 📌 Description
The Scholarship Management Portal is a full-stack web application designed to manage scholarship applications efficiently. It allows students to browse scholarships, check eligibility, and apply, while administrators can review applications and manage approvals.

This project demonstrates core Database Management System (DBMS) concepts using a relational MySQL database.

---

## 🚀 Features
- Student scholarship browsing and application
- Eligibility checking using database logic
- Admin dashboard for managing applications
- Analytics and statistics
- Secure and efficient database operations

---

## 🧰 Tech Stack
- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MySQL
- Driver: mysql2

---

## 🗄️ Database Schema
The system consists of the following tables:
- Students
- Scholarships
- Applications
- CGPA_Details
- Income_Details

The database is normalized to **Third Normal Form (3NF)** and uses **Primary Keys** and **Foreign Keys**.

---

## ⚙️ Implementation Steps

 ### 1. Clone the Repository
 ```bash
 git clone <repository-url>
 cd DBMS-Project-4th-Sem
```
### 2. Install Dependencies
```bash
npm install

cd backend
npm install

cd ../frontend
npm install
```
### 3. Configure Environment Variables
```env
PORT=8000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=placement_db
JWT_SECRET=your_secret_key
```
### 4. Setup Database
```bash
mysql -u root -p < schema.sql
node import_data.js
```
### 5. Run the Project
```bash
npm run dev
```
Frontend: http://localhost:5173

Backend: http://localhost:8000
---

##ER Diagram
<img width="1435" height="860" alt="image" src="https://github.com/user-attachments/assets/64d684b8-099e-432c-8d55-0e777f18fd7e" />

---

## 📊 DBMS Concepts Used
- Normalization (3NF)
- ER Modeling
- SQL Joins
- Subqueries and Aggregations
- Stored Procedures
- Triggers
- Views
- Transactions

---

## 👥 Team Members
- **Prathyusha Reddy** – Designed the ER Diagram, implemented 3NF schema, and wrote SQL triggers  
- **Bhavya Khare** – Developed the Node.js API, managed database transactions, and optimized SQL joins  
- **Shreya Keshri** – Created the React interface, integrated Chart.js, and designed the admin dashboard  
- **Reena Akshaya** – Conducted literature survey, handled data migration (800+ records), and tested ACID compliance  
---

## 📌 Conclusion

This project demonstrates the effective use of relational databases for managing structured data, ensuring data integrity, and improving query efficiency.

