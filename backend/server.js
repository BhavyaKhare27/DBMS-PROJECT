const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


// 🔌 MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "***REMOVED***",
  database: "scholarship_db"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL");
});


// ─────────────────────────────────────────────
// 🎓 GET STUDENT DETAILS
// ─────────────────────────────────────────────
app.get("/api/students/:id", (req, res) => {
  const id = req.params.id;

  // 1️⃣ Get student + income
  const studentQuery = `
    SELECT s.*, i.annual_income
    FROM student s
    LEFT JOIN income_details i ON s.student_id = i.student_id
    WHERE s.student_id = ?
  `;

  db.query(studentQuery, [id], (err, studentResult) => {
    if (err) return res.status(500).json(err);
    if (studentResult.length === 0)
      return res.status(404).json({ message: "Student not found" });

    const student = studentResult[0];

    // 2️⃣ Get the academic record
    const academicQuery = `
      SELECT * FROM academic_record
      WHERE student_id = ?
    `;

    db.query(academicQuery, [id], (err, academics) => {
      if (err) return res.status(500).json(err);

      const record = academics.length > 0 ? academics[0] : {};
      const semesters = [];

      // ✅ Build semesters array from sem_1_cgpa, sem_2_cgpa...
      if (record && record.semester) {
        for (let i = 1; i <= record.semester; i++) {
          const key = `sem_${i}_cgpa`;
          const attKey = `sem_${i}_attendance`;
          if (record[key] !== undefined && record[key] !== null) {
            semesters.push({
              sem: i,
              cgpa: record[key],
              backlogs: i === record.semester ? (record.backlog_count || 0) : 0,
              attendance: record[attKey] ? Math.round(record[attKey]) : (i === record.semester ? Math.round(record.attendance_percentage || 0) : 0)
            });
          }
        }
      }

      res.json({
        id: student.student_id,
        name: student.name,
        branch: student.branch,
        year: student.year_of_study,
        category: student.category,
        cgpa: record.cgpa || 0,
        attendance: record.attendance_percentage ? Math.round(record.attendance_percentage) : 0,
        backlogs: record.backlog_count || 0,
        annualIncome: student.annual_income || 0,
        semesters: semesters   // 🔥 Fixed: Correctly builds array from MySQL row columns
      });
    });
  });
});
// ─────────────────────────────────────────────
// 🏆 GET SCHOLARSHIPS
// ─────────────────────────────────────────────
app.get("/api/scholarships", (req, res) => {
  db.query("SELECT * FROM scholarship", (err, results) => {
    if (err) return res.status(500).json(err);

    const formatted = results.map(s => ({
      id: s.scholarship_id,
      name: s.name,
      amount: s.amount,
      minCgpa: s.min_cgpa,
      maxIncome: s.max_income_limit,
      slots: s.total_slots,
      description: (s.type || "") + " Scholarship by " + (s.provider || "")
    }));

    res.json(formatted);
  });
});


// ─────────────────────────────────────────────
// 📄 GET APPLICATIONS (ADMIN)
// ─────────────────────────────────────────────
app.get("/api/applications", (req, res) => {
  const query = `
    SELECT 
      a.application_id,
      s.student_id,
      s.name,
      s.branch,
      s.category,
      ar.cgpa,
      i.annual_income,
      sc.name AS scholarship,
      a.status
    FROM applications a
    JOIN student s ON a.student_id = s.student_id

    JOIN (
        SELECT student_id, cgpa
        FROM academic_record
        WHERE (student_id, semester) IN (
            SELECT student_id, MAX(semester)
            FROM academic_record
            GROUP BY student_id
        )
    ) ar ON s.student_id = ar.student_id

    JOIN income_details i ON s.student_id = i.student_id
    JOIN scholarship sc ON a.scholarship_id = sc.scholarship_id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    const formatted = results.map(r => ({
      id: r.application_id,
      studentId: r.student_id,
      name: r.name,
      cgpa: r.cgpa || 0,
      income: r.annual_income ? (r.annual_income / 100000).toFixed(1) + "L" : "0L",
      category: r.category,
      branch: r.branch,
      scholarship: r.scholarship,
      status: r.status
    }));

    res.json(formatted);
  });
});


// ─────────────────────────────────────────────
// 📝 APPLY FOR SCHOLARSHIP
// ─────────────────────────────────────────────
app.post("/api/applications", (req, res) => {
  const { student, scholarship } = req.body;

  const query = `
    INSERT INTO applications (student_id, scholarship_id, applied_date, status)
    VALUES (?, ?, NOW(), 'Pending')
  `;

  db.query(query, [student.id, scholarship.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});


// ─────────────────────────────────────────────
// 🔄 UPDATE APPLICATION STATUS (ADMIN)
// ─────────────────────────────────────────────
app.post("/api/applications/:id/status", (req, res) => {
  const { status } = req.body;

  const query = `
    UPDATE applications 
    SET status = ? 
    WHERE application_id = ?
  `;

  db.query(query, [status, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});


// ─────────────────────────────────────────────
// 🏆 GET STUDENT RANKINGS
// ─────────────────────────────────────────────
app.get("/api/rankings", (req, res) => {
  const query = `
    SELECT 
      s.student_id,
      s.name,
      s.branch,
      s.year_of_study,
      ar.cgpa,
      ar.attendance_percentage,
      ar.backlog_count
    FROM student s
    JOIN academic_record ar ON s.student_id = ar.student_id
    ORDER BY ar.cgpa DESC, ar.attendance_percentage DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    const formatted = results.map(r => ({
      studentId: r.student_id,
      name: r.name,
      branch: r.branch,
      year: r.year_of_study,
      cgpa: r.cgpa || 0,
      attendance: r.attendance_percentage ? Math.round(r.attendance_percentage) : 0,
      backlogs: r.backlog_count || 0
    }));

    res.json(formatted);
  });
});


// ─────────────────────────────────────────────
// 🚀 START SERVER
// ─────────────────────────────────────────────
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});