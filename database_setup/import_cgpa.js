const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Configure these connection details based on your MySQL setup
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: '***REMOVED***',    // Ensure this matches your local MySQL password
  database: 'scholarship_db'
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");

  // Dynamically resolve the path assuming cgpa.csv is in the parent 'data' folder
  const csvPath = path.join(__dirname, '../data/cgpa.csv');
  
  if (!fs.existsSync(csvPath)) {
      console.error(`❌ Could not find CSV file at ${csvPath}`);
      process.exit();
  }

  const data = fs.readFileSync(csvPath, 'utf8').trim().split('\n');
  const rows = data.slice(1); // skip header
  console.log(`Found ${rows.length} rows in cgpa.csv file`);

  // Clear out the current records before importing
  db.query('DELETE FROM academic_record', (err) => {
    if (err) { console.error("❌ Error deleting old records:", err); process.exit(); }
    
    let inserted = 0;
    const query = `
      INSERT INTO academic_record 
      (record_id, student_id, semester, cgpa, backlog_count, attendance_percentage, 
       sem_1_cgpa, sem_2_cgpa, sem_3_cgpa, sem_4_cgpa, sem_5_cgpa, sem_6_cgpa, sem_7_cgpa, sem_8_cgpa,
       sem_1_attendance, sem_2_attendance, sem_3_attendance, sem_4_attendance, sem_5_attendance, sem_6_attendance, sem_7_attendance, sem_8_attendance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    rows.forEach((line, idx) => {
      const cols = line.split(',');
      if (cols.length < 22) return;
      
      const values = cols.map(c => {
         const v = c.trim();
         return v === '' ? null : parseFloat(v);
      });
      
      db.query(query, values, (e) => {
         if (e) {
            console.error(`Error on row ${idx}:`, e);
         }
         inserted++;
         if (inserted === rows.length) {
            console.log(`🎉 Successfully imported all ${inserted} academic records!`);
            process.exit();
         }
      });
    });
  });
});
