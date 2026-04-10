# Scholarship Management Portal

## 📌 Description
The Scholarship Management Portal is a full-stack web application designed to manage scholarship applications efficiently. It allows students to browse scholarships, check eligibility, and apply, while administrators can review applications and manage approvals.

This project demonstrates core Database Management System (DBMS) concepts using a relational MySQL database.

---

## ✨ Key Features

- **Student Portal**: Browse available scholarships, check personalized eligibility, and submit applications
- **Eligibility Engine**: Automated eligibility checking based on CGPA, income, and other criteria
- **Admin Dashboard**: Review applications, update status, manage scholarships, and view analytics
- **Analytics & Reports**: Insights using charts (Chart.js) – approval rates, scholarship distribution, etc.
- **Secure Operations**: Proper authentication, data validation, and ACID-compliant transactions

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| **Frontend**    | React.js, Chart.js                  |
| **Backend**     | Node.js, Express.js                 |
| **Database**    | MySQL                               |
| **Driver**  | mysql2                              |

---
## 📁 Project Structure

```bash
Scholarship-Management-Portal/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── data/                          # Raw CSV datasets (800+ student records)
│   ├── applications_status.csv
│   ├── cgpa.csv
│   ├── income_details_iiit_dharwad.csv
│   ├── scholarship_details.csv
│   └── student_800_iiit_dharwad.csv
│
├── database_setup/                # Database initialization scripts
│   ├── schema.sql                 # Table creation with constraints (3NF)
│   └── import_cgpa.js             # Script to import CSV data into MySQL
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── .gitignore
│   ├── index.html
│   ├── logo.png
│   └── src/                       # React source code
│
├── ER_Diagram.png                 # Entity-Relationship Diagram
├── README.md
```
---

## 🗄️ Database Design

The database is carefully designed and **normalized up to 3NF** to eliminate redundancy while maintaining data integrity.

### Main Tables
- `Students`
- `Scholarships`
- `Applications`
- `CGPA_Details`
- `Income_Details`

**Key DBMS Concepts Implemented:**
- Entity-Relationship (ER) Modeling
- Normalization (3NF)
- Primary Keys, Foreign Keys & Constraints
- SQL Joins & Subqueries
- Aggregations and Views
- Stored Procedures
- Triggers (e.g., for automatic status updates or eligibility checks)
- Transactions (ACID compliance)
  
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

## 📊 DBMS Concepts Demonstrated

- **Normalization**: Reduced redundancy while preserving relationships
- **Advanced SQL**: Complex JOINs, subqueries, window functions (if used)
- **Procedural SQL**: Stored Procedures & Triggers for business logic
- **Data Integrity**: Foreign keys, CHECK constraints, transactions
- **Performance**: Proper indexing and efficient query design

---

## 👥 Team Members
- **Prathyusha Reddy** – Designed the ER Diagram, implemented 3NF schema, and wrote SQL triggers  
- **Bhavya Khare** – Developed the Node.js API, managed database transactions, and optimized SQL joins  
- **Shreya Keshri** – Created the React interface, integrated Chart.js, and designed the admin dashboard  
- **Reena Akshaya** – Conducted literature survey, handled data migration (800+ records), and tested ACID compliance  
---

## 📌 Conclusion

This project successfully integrates a robust relational database with a modern full-stack application to solve a real-world problem — efficient scholarship management.

