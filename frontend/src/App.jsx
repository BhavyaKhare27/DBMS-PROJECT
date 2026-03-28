import React, { useState, useEffect, useRef } from "react";
import { Chart, ArcElement, DoughnutController, BarElement, BarController, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, DoughnutController, BarElement, BarController, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);
const IIIT_LOGO ="/logo.png";




// ─── Theme ────────────────────────────────────────────────────────────────────
const G = {
  blue: "#1a56b0", blueDark: "#0d2a6e", blueLight: "#e8f0fc", blueMid: "#3b82f6",
  bg: "#f0f4fb", surface: "#ffffff", surfaceHover: "#f5f8ff",
  border: "#d1ddf5", borderBlue: "#1a6fd422",
  text: "#0f172a", muted: "#64748b", accent: "#0ea5e9",
  navBg: "#0d1f4e",
};

const css = {
  app: { minHeight: "100vh", background: G.bg, color: G.text, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" },
  nav: {
    background: G.navBg, borderBottom: `1px solid #0f3f8a`, padding: "0 32px",
    display: "flex", alignItems: "center", justifyContent: "space-between", height: 62,
    position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px #1453a833",
  },
  logoMark: { width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff", border: "1px solid rgba(255,255,255,0.3)" },
  page: { maxWidth: 1100, margin: "0 auto", padding: "32px 24px" },
  heading: { fontSize: 26, fontWeight: 700, color: G.text, margin: 0 },
  sub: { fontSize: 14, color: G.muted, marginTop: 4 },
  card: { background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: "0 1px 4px #1a6fd411" },
  cardTitle: { fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: G.blue, marginBottom: 16, fontFamily: "system-ui", fontWeight: 700 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  grid4: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 },
  statCard: { background: G.surface, border: `1px solid ${G.border}`, borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 6, boxShadow: "0 1px 4px #1a6fd411" },
  statNum: { fontSize: 32, fontWeight: 800, color: G.blue, lineHeight: 1 },
  statLabel: { fontSize: 11, color: G.muted, textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "system-ui" },
  kv: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${G.border}` },
  kvLabel: { fontSize: 13, color: G.muted, fontFamily: "system-ui" },
  kvValue: { fontSize: 14, fontWeight: 600, color: G.text },
  btn: { padding: "10px 22px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${G.blue}, ${G.blueDark})`, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "system-ui", boxShadow: "0 2px 8px #1a6fd433" },
  btnSm: { padding: "5px 12px", borderRadius: 6, border: "none", background: `linear-gradient(135deg, ${G.blue}, ${G.blueDark})`, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 11, fontFamily: "system-ui" },
  btnOutline: { padding: "9px 20px", borderRadius: 8, border: `1px solid ${G.border}`, background: "transparent", color: G.text, cursor: "pointer", fontSize: 13, fontFamily: "system-ui" },
  btnDanger: { padding: "5px 12px", fontSize: 11, borderRadius: 6, border: "1px solid #ff4d6d44", background: "#ff4d6d0d", color: "#e0284a", cursor: "pointer", fontFamily: "system-ui" },
  btnGhost: { padding: "5px 12px", fontSize: 11, borderRadius: 6, border: `1px solid ${G.border}`, background: "transparent", color: G.muted, cursor: "pointer", fontFamily: "system-ui" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 14px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: G.muted, borderBottom: `1px solid ${G.border}`, fontFamily: "system-ui", background: "#f8faff" },
  td: { padding: "13px 14px", fontSize: 14, borderBottom: `1px solid ${G.border}`, color: G.text },
  bar: { height: 6, borderRadius: 3, background: G.border, overflow: "hidden", marginTop: 6 },
  input: { width: "100%", padding: "10px 13px", borderRadius: 8, border: `1px solid ${G.border}`, background: "#fff", color: G.text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "system-ui", marginTop: 6 },
  label: { fontSize: 11, color: G.muted, textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const isEligible = (s, st) => st.cgpa >= s.minCgpa && st.annualIncome <= s.maxIncome;

const StatusBadge = ({ status }) => {
  const colors = { Approved: "#00c896", Pending: "#f5a623", Rejected: "#ff4d6d" };
  const c = colors[status] || "#888";
  return <span style={{ background: c + "22", color: c, border: `1px solid ${c}55`, padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, fontFamily: "system-ui" }}>{status}</span>;
};

const Bar = ({ pct, color }) => (
  <div style={css.bar}><div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 1s" }} /></div>
);

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color }) => {
  if (!data || data.length === 0) return <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 13, fontFamily: "system-ui" }}>No Data</div>;
  
  const validData = data.filter(d => typeof d === 'number' && !isNaN(d));
  if (validData.length === 0) return <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: "#ff4d6d", fontSize: 13, fontFamily: "system-ui" }}>Invalid CGPA Data</div>;

  const w = 300, h = 80, pad = 10;
  
  // Handle single data point case gracefully
  if (validData.length === 1) {
    const y = h / 2;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "80px", display: "block" }}>
        <line x1={pad} y1={y} x2={w - pad} y2={y} stroke={color} strokeWidth="2.5" strokeDasharray="4 4" />
        <circle cx={w / 2} cy={y} r={5} fill={color} />
        <text x={w / 2} y={y - 12} textAnchor="middle" fill={color} fontSize="11" fontWeight="bold" fontFamily="system-ui">{validData[0].toFixed(2)}</text>
      </svg>
    );
  }

  const min = Math.min(...validData) - 0.5, max = Math.max(...validData) + 0.2;
  const pts = validData.map((v, i) => [pad + (i / (validData.length - 1)) * (w - pad * 2), h - pad - ((v - min) / (max - min)) * (h - pad * 2)]);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ");
  const fill = path + ` L ${pts[pts.length - 1][0]},${h} L ${pts[0][0]},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "80px", display: "block" }}>
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={fill} fill="url(#sg)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill={color} />)}
    </svg>
  );
};

// ─── Chart Components (Chart.js via window.Chart) ────────────────────────────
const DonutChart = ({ pending, approved, rejected }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Pending", "Approved", "Rejected"],
        datasets: [{ data: [pending, approved, rejected],
          backgroundColor: ["#f5a62344","#00c89644","#ff4d6d44"],
          borderColor: ["#f5a623","#00c896","#ff4d6d"], borderWidth: 2, hoverOffset: 6 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "65%",
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 12, family: "system-ui" }, color: "#64748b", padding: 14 } },
          tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.parsed}` } },
        },
      },
    });
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [pending, approved, rejected]);

  const total = pending + approved + rejected;
  if (total === 0) return <div style={{ height: 220, display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa", fontSize:14 }}>No applications yet</div>;
  return (
    <div style={{ position:"relative", height:220 }}>
      <canvas ref={canvasRef} />
      <div style={{ position:"absolute", top:"38%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center", pointerEvents:"none" }}>
        <div style={{ fontSize:26, fontWeight:800, color:G.blue }}>{total}</div>
        <div style={{ fontSize:10, color:G.muted, textTransform:"uppercase", letterSpacing:1 }}>Total</div>
      </div>
    </div>
  );
};

const BarChart = ({ scholarships, apps }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !scholarships.length) return;
    if (false) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

    const labels = scholarships.map(s => s.name.length > 22 ? s.name.slice(0,20)+"\u2026" : s.name);
    const appCounts = scholarships.map(s => apps.filter(a => a.scholarship === s.name).length);
    const approvedCounts = scholarships.map(s => apps.filter(a => a.scholarship === s.name && a.status === "Approved").length);

    const ctx = canvasRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Applied", data: appCounts, backgroundColor: "#1a56b033", borderColor: "#1a56b0", borderWidth: 2, borderRadius: 4 },
          { label: "Approved", data: approvedCounts, backgroundColor: "#00c89633", borderColor: "#00c896", borderWidth: 2, borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: "top", labels: { font: { size: 11, family: "system-ui" }, color: "#64748b" } } },
        scales: {
          x: { grid: { display:false }, ticks: { font: { size:10, family:"system-ui" }, color:"#64748b", maxRotation:35 } },
          y: { beginAtZero:true, grid: { color:"#e2e8f0" }, ticks: { font: { size:11, family:"system-ui" }, color:"#64748b", stepSize:1 } },
        },
      },
    });
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, [scholarships, apps]);

  if (!scholarships.length) return <div style={{ height:220, display:"flex", alignItems:"center", justifyContent:"center", color:"#aaa", fontSize:14 }}>No scholarship data yet</div>;
  return <div style={{ height:220 }}><canvas ref={canvasRef} /></div>;
};

// ─── Landing Page ─────────────────────────────────────────────────────────────
const LandingPage = ({ onLogin }) => {
  const [mode, setMode] = useState(null);
  const [id, setId] = useState(""); const [pass, setPass] = useState("");

  const handleLogin = async () => {
    if (mode === "admin") {
      if (id === "admin" && pass === "admin123") { onLogin("admin", null); }
      else alert("Wrong credentials.\nUsername: admin  |  Password: admin123");
      return;
    }
    if (mode === "student") { 
      try {
        const res = await fetch("http://127.0.0.1:5000/api/students/" + id);
        if (!res.ok) throw new Error("Student not found");
        const studentData = await res.json();
        onLogin("student", studentData);
      } catch (err) {
        alert("Student ID not found in database. (Try 2001)");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0d1f4e 0%, #1a56b0 50%, #e8f0fc 100%)" }}>
      <div style={{ textAlign: "center", padding: "60px 24px 32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <img src={IIIT_LOGO} alt="IIIT Dharwad" style={{ height: 80, width: 80, objectFit: "contain", background:"white", borderRadius: 8, padding: 3}} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>IIIT Dharwad</div>
            <div style={{ fontSize: 11, color: G.muted, letterSpacing: 2, textTransform: "uppercase" }}>Scholarship Portal</div>
          </div>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#fff", margin: "0 0 12px", lineHeight: 1.1 }}>
          Merit & Need-Based<br /><span style={{ color: "#bfd9ff" }}>Scholarship System</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, maxWidth: 440, margin: "0 auto 40px" }}>
          Automated eligibility filtering based on your CGPA and financial background.
        </p>
        <div style={{ display: "inline-flex", gap: 32, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 16, padding: "20px 40px", marginBottom: 44, backdropFilter: "blur(8px)" }}>
          {[["800", "Students"], ["5", "Scholarships"], ["₹50K+", "Max Award"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{n}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1.5 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {!mode ? (
        <div style={{ display: "flex", gap: 20, justifyContent: "center", padding: "0 24px 60px" }}>
          {[["👩‍🎓", "Student Login", "Apply and track scholarships", "student"],
            ["🧑‍💼", "Admin Login", "Review and manage applications", "admin"]].map(([icon, title, desc, m]) => (
            <div key={m} onClick={() => setMode(m)} style={{
              background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: 16, padding: "32px 36px",
              cursor: "pointer", textAlign: "center", width: 240, transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G.blue; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{desc}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ maxWidth: 400, margin: "0 auto 60px", background: "rgba(255,255,255,0.97)", border: "1px solid rgba(26,111,212,0.2)", borderRadius: 16, padding: 36 }}>
          <button onClick={() => setMode(null)} style={{ ...css.btnOutline, marginBottom: 20, fontSize: 12, padding: "6px 14px" }}>← Back</button>
          <div style={{ fontSize: 18, fontWeight: 700, color: G.text, marginBottom: 4 }}>
            {mode === "student" ? "👩‍🎓 Student Login" : "🧑‍💼 Admin Login"}
          </div>
          <div style={{ fontSize: 12, color: G.muted, marginBottom: 24 }}>
            {mode === "admin" ? "Credentials: admin / admin123" : "Enter any credentials to demo"}
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={css.label}>{mode === "student" ? "Student ID" : "Username"}</div>
            <input style={css.input} value={id} onChange={e => setId(e.target.value)} placeholder={mode === "student" ? "e.g. 2001" : "admin"} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <div style={css.label}>Password</div>
            <input style={css.input} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <button style={{ ...css.btn, width: "100%" }} onClick={handleLogin}>Login →</button>
        </div>
      )}
    </div>
  );
};

// ─── Student Dashboard ────────────────────────────────────────────────────────
const StudentDashboard = ({ student, onNav }) => {
  const [scholarships, setScholarships] = useState([]);
  useEffect(() => { fetch("http://127.0.0.1:5000/api/scholarships").then(r => r.json()).then(setScholarships).catch(console.error); }, []);
  const eligible = scholarships.filter(s => isEligible(s, student));
  return (
    <div style={css.page}>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={css.heading}>Welcome back, {student.name.split(" ")[0]} 👋</div>
          <div style={css.sub}>ID: {student.id} · {student.branch} · Year {student.year} · {student.category}</div>
        </div>
        <img src={IIIT_LOGO} alt="IIIT Logo" style={{ height: 60, width: "auto", objectFit: "contain", background: "white", borderRadius: 8, padding: 3 }} />
      </div>
      <div style={{ ...css.grid3, marginBottom: 20 }}>
        {[["CGPA", student.cgpa, G.blue], ["Attendance", student.attendance + "%", G.accent], ["Backlogs", student.backlogs, "#00c896"]].map(([l, v, c]) => (
          <div key={l} style={css.statCard}>
            <div style={css.statLabel}>{l}</div>
            <div style={{ ...css.statNum, color: c }}>{v}</div>
            {l === "Attendance" && <Bar pct={student.attendance} color={c} />}
          </div>
        ))}
      </div>
      <div style={css.grid2}>
        <div style={css.card}>
          <div style={css.cardTitle}>Profile Details</div>
          {[["Branch", student.branch], ["Year", `Year ${student.year}`], ["Category", student.category], ["Annual Income", fmt(student.annualIncome)]].map(([l, v]) => (
            <div key={l} style={css.kv}><span style={css.kvLabel}>{l}</span><span style={css.kvValue}>{v}</span></div>
          ))}
        </div>
        <div style={css.card}>
          <div style={css.cardTitle}>✅ You're Eligible For ({eligible.length})</div>
          {eligible.length === 0 && <div style={{ color: G.muted, fontSize: 14 }}>No eligible scholarships found.</div>}
          {eligible.map(s => (
            <div key={s.id} style={{ padding: "12px 0", borderBottom: `1px solid ${G.border}22`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: G.blue, marginTop: 2 }}>{fmt(s.amount)}</div>
              </div>
              <button style={css.btnSm} onClick={() => onNav("scholarships")}>Apply</button>
            </div>
          ))}
        </div>
      </div>
      <div style={css.card}>
        <div style={css.cardTitle}>📈 CGPA Progression</div>
        <Sparkline data={(student.semesters || []).map(s => s.cgpa)} color={G.blue} /> 
         <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8 }}>
          {(student.semesters || []).map(s => (
            <div key={s.sem} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, color: G.muted }}>Sem {s.sem}</div>
              <div style={{ fontWeight: 700, color: G.blue }}>{s.cgpa}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button style={css.btn} onClick={() => onNav("records")}>📚 Academic Records</button>
        <button style={css.btnOutline} onClick={() => onNav("rankings")}>🏆 Student Rankings</button>
        <button style={css.btnOutline} onClick={() => onNav("applications")}>📝 My Applications</button>
        <button style={css.btnOutline} onClick={() => onNav("scholarships")}>🎓 All Scholarships</button>
      </div>
    </div>
  );
};

// ─── Academic Records ─────────────────────────────────────────────────────────
const AcademicRecords = ({ student, onNav }) => (
  <div style={css.page}>
    <button style={{ ...css.btnOutline, marginBottom: 24, padding: "7px 16px", fontSize: 13 }} onClick={() => onNav("dashboard")}>← Dashboard</button>
    <div style={{ ...css.heading, marginBottom: 4 }}>📚 Academic Records</div>
    <div style={{ ...css.sub, marginBottom: 24 }}>{student.name} · ID: {student.id}</div>
    <div style={css.card}>
      <table style={css.table}>
        <thead><tr>{["Semester", "CGPA", "Backlogs", "Attendance", "Progress"].map(h => <th key={h} style={css.th}>{h}</th>)}</tr></thead>
        <tbody>
          {(student.semesters || []).map(s => (
            <tr key={s.sem} onMouseEnter={e => e.currentTarget.style.background = G.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <td style={{ ...css.td, fontWeight: 700 }}>Semester {s.sem}</td>
              <td style={{ ...css.td, color: G.blue, fontWeight: 700 }}>{s.cgpa}</td>
              <td style={{ ...css.td, color: s.backlogs === 0 ? "#00c896" : "#ff4d6d" }}>{s.backlogs}</td>
              <td style={css.td}>{s.attendance}%</td>
              <td style={{ ...css.td, width: 160 }}><Bar pct={(s.cgpa / 10) * 100} color={G.blue} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={css.card}>
      <div style={css.cardTitle}>📊 Attendance Trend</div>
      <Sparkline data={(student.semesters || []).map(s => s.attendance)} color={G.accent} />
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8 }}>
        {(student.semesters || []).map(s => (
          <div key={s.sem} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, color: G.muted }}>Sem {s.sem}</div>
            <div style={{ fontWeight: 700, color: s.attendance >= 75 ? G.accent : "#ff4d6d" }}>{s.attendance}%</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Student Rankings ─────────────────────────────────────────────────────────
const StudentRankings = ({ student, onNav }) => {
  const [rankings, setRankings] = useState([]);
  const [filterBranch, setFilterBranch] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/rankings")
      .then(r => r.json())
      .then(data => { setRankings(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const branches = ["All", ...new Set(rankings.map(r => r.branch).filter(Boolean))];
  const filtered = filterBranch === "All" ? rankings : rankings.filter(r => r.branch === filterBranch);

  const medal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div style={css.page}>
      <button style={{ ...css.btnOutline, marginBottom: 24, padding: "7px 16px", fontSize: 13 }} onClick={() => onNav("dashboard")}>← Dashboard</button>
      <div style={{ ...css.heading, marginBottom: 4 }}>🏆 Student Rankings</div>
      <div style={{ ...css.sub, marginBottom: 24 }}>Top performers ranked by latest semester CGPA</div>

      {/* Top 3 Podium */}
      {filtered.length >= 3 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 28 }}>
          {[filtered[1], filtered[0], filtered[2]].map((r, i) => {
            const order = [2, 1, 3][i];
            const heights = { 1: 140, 2: 110, 3: 90 };
            const colors = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
            return (
              <div key={r.studentId} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{medal(order)}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.text, marginBottom: 2 }}>{r.name.split(" ").slice(0,2).join(" ")}</div>
                <div style={{ fontSize: 11, color: G.muted, marginBottom: 8 }}>{r.branch}</div>
                <div style={{
                  width: 80, height: heights[order], borderRadius: "10px 10px 0 0",
                  background: `linear-gradient(180deg, ${colors[order]}44, ${colors[order]}22)`,
                  border: `2px solid ${colors[order]}`, display: "flex", alignItems: "center", justifyContent: "center",
                  flexDirection: "column", gap: 4
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: G.blue }}>{r.cgpa}</div>
                  <div style={{ fontSize: 9, color: G.muted, textTransform: "uppercase", letterSpacing: 1 }}>CGPA</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter */}
      <div style={{ ...css.card, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 11, color: G.muted, textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" }}>Filter by Branch:</span>
        <select
          value={filterBranch}
          onChange={e => setFilterBranch(e.target.value)}
          style={{ padding: "7px 10px", borderRadius: 8, border: `1px solid ${filterBranch !== "All" ? G.blue : G.border}`, background: filterBranch !== "All" ? G.blueLight : "#fff", color: filterBranch !== "All" ? G.blue : G.text, fontSize: 13, fontFamily: "system-ui", cursor: "pointer", outline: "none" }}
        >
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <span style={{ marginLeft: "auto", fontSize: 12, color: G.muted }}>Showing <b style={{ color: G.text }}>{filtered.length}</b> students</span>
        {student && (() => {
          const myRank = filtered.findIndex(r => r.studentId === student.id) + 1;
          return myRank > 0 ? <span style={{ fontSize: 13, fontWeight: 700, color: G.blue }}>Your Rank: {medal(myRank)}</span> : null;
        })()}
      </div>

      {/* Table */}
      <div style={css.card}>
        {loading ? <div style={{ textAlign: "center", padding: 40, color: G.muted }}>Loading rankings...</div> : (
          <table style={css.table}>
            <thead>
              <tr>
                {["Rank", "Student ID", "Name", "Branch", "Year", "CGPA", "Attendance", "Backlogs"].map(h => (
                  <th key={h} style={css.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const isMe = student && r.studentId === student.id;
                return (
                  <tr key={r.studentId}
                    style={{ background: isMe ? G.blueLight : "transparent" }}
                    onMouseEnter={e => { if (!isMe) e.currentTarget.style.background = G.surfaceHover; }}
                    onMouseLeave={e => { if (!isMe) e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ ...css.td, fontWeight: 800, fontSize: 15 }}>{medal(idx + 1)}</td>
                    <td style={{ ...css.td, color: G.muted }}>{r.studentId}</td>
                    <td style={{ ...css.td, fontWeight: 600 }}>{r.name} {isMe ? <span style={{ fontSize: 10, color: G.blue, fontWeight: 700 }}>(You)</span> : ""}</td>
                    <td style={{ ...css.td, fontSize: 12, color: G.muted }}>{r.branch}</td>
                    <td style={css.td}>{r.year}</td>
                    <td style={{ ...css.td, color: G.blue, fontWeight: 700 }}>{r.cgpa}</td>
                    <td style={css.td}>{r.attendance}%</td>
                    <td style={{ ...css.td, color: r.backlogs === 0 ? "#00c896" : "#ff4d6d" }}>{r.backlogs}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ─── Scholarship Listing ──────────────────────────────────────────────────────
const ScholarshipListing = ({ student, onNav }) => {
  const [scholarships, setScholarships] = useState([]);
  const [appliedScholarshipIds, setAppliedScholarshipIds] = useState([]);
  
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/scholarships").then(r => r.json()).then(setScholarships).catch(console.error);
    // Load already-applied scholarship IDs from the DB
    fetch(`http://127.0.0.1:5000/api/applications/student/${student.id}`)
      .then(r => r.json())
      .then(apps => {
        // We need scholarship IDs, but the endpoint returns names.
        // We'll match by name after scholarships load. For now store names.
        setAppliedScholarshipIds(apps.map(a => a.name));
      })
      .catch(console.error);
  }, [student.id]);

  const handleApply = async (s) => {
    if (!isEligible(s, student)) { alert("You don't meet the eligibility criteria for this scholarship."); return; }
    try {
      const res = await fetch("http://127.0.0.1:5000/api/applications", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student, scholarship: s })
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error applying");
        return;
      }
      setAppliedScholarshipIds(p => [...p, s.name]);
      alert(`✅ Applied for "${s.name}" successfully!`);
    } catch(err) {
      alert("Error applying");
    }
  };
  return (
    <div style={css.page}>
      <button style={{ ...css.btnOutline, marginBottom: 24, padding: "7px 16px" }} onClick={() => onNav("dashboard")}>← Dashboard</button>
      <div style={{ ...css.heading, marginBottom: 4 }}>🎓 Available Scholarships</div>
      <div style={{ ...css.sub, marginBottom: 28 }}>Your CGPA: {student.cgpa} · Income: {fmt(student.annualIncome)}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {scholarships.map(s => {
          const elig = isEligible(s, student); 
          const done = appliedScholarshipIds.includes(s.name);
          return (
            <div key={s.id} style={{ background: G.surface, border: `1px solid ${elig ? G.blueDark : G.border}`, borderRadius: 12, padding: 24, position: "relative" }}>
              {elig && <span style={{ position: "absolute", top: 16, right: 16, background: "#00c89622", color: "#00c896", border: "1px solid #00c89655", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, fontFamily: "system-ui" }}>✓ Eligible</span>}
              <div style={{ fontSize: 17, fontWeight: 700, color: G.text, marginBottom: 6, paddingRight: 80 }}>{s.name}</div>
              <div style={{ fontSize: 13, color: G.muted, marginBottom: 16 }}>{s.description}</div>
              <div style={{ display: "flex", gap: 28, marginBottom: 18 }}>
                {[["Amount", fmt(s.amount)], ["Min CGPA", s.minCgpa], ["Max Income", fmt(s.maxIncome)], ["Slots", s.slots]].map(([l, v]) => (
                  <div key={l}><div style={css.statLabel}>{l}</div><div style={{ fontSize: 15, fontWeight: 700, color: G.blue }}>{v}</div></div>
                ))}
              </div>
              {done ? <span style={{ color: "#00c896", fontWeight: 600, fontSize: 14 }}>✓ Applied</span>
                : <button style={elig ? css.btn : { ...css.btnOutline, opacity: 0.45, cursor: "not-allowed" }} onClick={() => elig && handleApply(s)}>{elig ? "Apply Now →" : "Not Eligible"}</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Application Status ───────────────────────────────────────────────────────
const ApplicationStatus = ({ student, onNav }) => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/applications/student/${student.id}`)
      .then(r => r.json())
      .then(data => { setApps(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [student.id]);

  return (
  <div style={css.page}>
    <button style={{ ...css.btnOutline, marginBottom: 24, padding: "7px 16px" }} onClick={() => onNav("dashboard")}>← Dashboard</button>
    <div style={{ ...css.heading, marginBottom: 4 }}>📝 My Applications</div>
    <div style={{ ...css.sub, marginBottom: 28 }}>Track your scholarship application statuses</div>
    <div style={css.card}>
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: G.muted }}>Loading applications...</div>
      ) : apps.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ color: G.muted, fontSize: 14, marginBottom: 16 }}>You haven't applied to any scholarships yet.</div>
          <button style={css.btn} onClick={() => onNav("scholarships")}>Browse Scholarships →</button>
        </div>
      ) : (
        <table style={css.table}>
          <thead><tr>{["Scholarship", "Amount", "Applied On", "Status"].map(h => <th key={h} style={css.th}>{h}</th>)}</tr></thead>
          <tbody>
            {apps.map(a => (
              <tr key={a.id} onMouseEnter={e => e.currentTarget.style.background = G.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ ...css.td, fontWeight: 600 }}>{a.name}</td>
                <td style={{ ...css.td, color: G.blue, fontWeight: 700 }}>{fmt(a.amount)}</td>
                <td style={{ ...css.td, color: G.muted }}>{a.date}</td>
                <td style={css.td}><StatusBadge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    <div style={{ ...css.card, background: "#00c89608", borderColor: "#00c89633" }}>
      <div style={{ color: "#00c896", fontWeight: 600, marginBottom: 6 }}>💡 Application Tips</div>
      <div style={{ color: G.muted, fontSize: 13, lineHeight: 1.7 }}>Applications are reviewed within 7–10 working days. When admin approves or rejects your application, the updated status will appear here automatically.</div>
    </div>
  </div>
  );
};

// ─── Add Scholarship Modal ────────────────────────────────────────────────────
const AddScholarshipModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ name: "", amount: "", minCgpa: "", maxIncome: "", slots: "", description: "" });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = () => {
    if (!form.name || !form.amount || !form.minCgpa || !form.maxIncome || !form.slots) { alert("Please fill all required fields."); return; }
    onAdd({ id: Date.now(), ...form, amount: Number(form.amount), minCgpa: Number(form.minCgpa), maxIncome: Number(form.maxIncome), slots: Number(form.slots) });
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "rgba(255,255,255,0.97)", border: "1px solid rgba(26,111,212,0.2)", borderRadius: 16, padding: 36, width: 460, maxWidth: "90vw" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: G.text, marginBottom: 4 }}>➕ Add New Scholarship</div>
        <div style={{ fontSize: 13, color: G.muted, marginBottom: 24 }}>Fill in the details below</div>
        {[["name", "Scholarship Name *", "text"], ["amount", "Amount (₹) *", "number"], ["minCgpa", "Minimum CGPA *", "number"], ["maxIncome", "Max Annual Income (₹) *", "number"], ["slots", "Available Slots *", "number"], ["description", "Description", "text"]].map(([k, label, type]) => (
          <div key={k} style={{ marginBottom: 14 }}>
            <div style={css.label}>{label}</div>
            <input style={css.input} type={type} value={form[k]} onChange={set(k)} placeholder={label.replace(" *", "")} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button style={css.btn} onClick={submit}>Add Scholarship</button>
          <button style={css.btnOutline} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
// Drop-in replacement for the AdminDashboard component in your App.jsx
// Changes: Added filter bar with Status, Category, Branch, and CGPA range dropdowns

const AdminDashboard = () => {
  const [apps, setApps] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [tab, setTab] = useState("applications");
  const [showModal, setShowModal] = useState(false);

  // ── Filter state ──────────────────────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterCgpa, setFilterCgpa] = useState("All");
  const [filterScholarship, setFilterScholarship] = useState("All");
  const [searchName, setSearchName] = useState("");
  const [searchStudentId, setSearchStudentId] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/applications").then(r => r.json()).then(setApps).catch(console.error);
    fetch("http://127.0.0.1:5000/api/scholarships").then(r => r.json()).then(setScholarships).catch(console.error);
  }, []);

  const handleAction = async (idx, action) => {
    const app = apps[idx];
    await fetch(`http://127.0.0.1:5000/api/applications/${app.id}/status`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action })
    });
    setApps(prev => prev.map((a, i) => i === idx ? { ...a, status: action } : a));
  };

  const addScholarship = async (s) => {
    const res = await fetch("http://127.0.0.1:5000/api/scholarships", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s)
    });
    const saved = await res.json();
    setScholarships(prev => [...prev, saved]);
  };

  const deleteScholarship = async (id) => {
    if (window.confirm("Delete this scholarship?")) {
      await fetch(`http://127.0.0.1:5000/api/scholarships/${id}`, { method: "DELETE" });
      setScholarships(prev => prev.filter(s => s.id !== id));
    }
  };

  // ── Derived counts ────────────────────────────────────────────────────────
  const pending  = apps.filter(a => a.status === "Pending").length;
  const approved = apps.filter(a => a.status === "Approved").length;
  const rejected = apps.filter(a => a.status === "Rejected").length;

  // ── Unique filter options (derived from data) ─────────────────────────────
  const categories   = ["All", ...new Set(apps.map(a => a.category).filter(Boolean))];
  const branches     = ["All", ...new Set(apps.map(a => a.branch).filter(Boolean))];
  const schNames     = ["All", ...new Set(apps.map(a => a.scholarship).filter(Boolean))];
  const cgpaRanges   = ["All", "9 – 10", "8 – 9", "7 – 8", "6 – 7", "Below 6"];

  const cgpaInRange = (cgpa, range) => {
    if (range === "All") return true;
    if (range === "9 – 10")  return cgpa >= 9;
    if (range === "8 – 9")   return cgpa >= 8 && cgpa < 9;
    if (range === "7 – 8")   return cgpa >= 7 && cgpa < 8;
    if (range === "6 – 7")   return cgpa >= 6 && cgpa < 7;
    if (range === "Below 6") return cgpa < 6;
    return true;
  };

  // ── Filtered result ───────────────────────────────────────────────────────
  const filtered = apps.filter(a => {
    if (filterStatus !== "All" && a.status !== filterStatus) return false;
    if (filterCategory !== "All" && a.category !== filterCategory) return false;
    if (filterBranch !== "All" && a.branch !== filterBranch) return false;
    if (filterScholarship !== "All" && a.scholarship !== filterScholarship) return false;
    if (!cgpaInRange(Number(a.cgpa), filterCgpa)) return false;
    if (searchName && !a.name?.toLowerCase().includes(searchName.toLowerCase())) return false;
    if (searchStudentId && !String(a.studentId).includes(searchStudentId)) return false;
    return true;
  });

  const activeFilterCount = [
    filterStatus !== "All",
    filterCategory !== "All",
    filterBranch !== "All",
    filterScholarship !== "All",
    filterCgpa !== "All",
    searchName !== "",
    searchStudentId !== "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilterStatus("All");
    setFilterCategory("All");
    setFilterBranch("All");
    setFilterScholarship("All");
    setFilterCgpa("All");
    setSearchName("");
    setSearchStudentId("");
  };

  // ── Select style helper ───────────────────────────────────────────────────
  const selectStyle = (active) => ({
    padding: "7px 10px",
    borderRadius: 8,
    border: `1px solid ${active ? G.blue : G.border}`,
    background: active ? G.blueLight : "#fff",
    color: active ? G.blue : G.text,
    fontSize: 13,
    fontFamily: "system-ui",
    cursor: "pointer",
    outline: "none",
    fontWeight: active ? 600 : 400,
    minWidth: 120,
  });

  return (
    <div style={css.page}>
      {showModal && <AddScholarshipModal onClose={() => setShowModal(false)} onAdd={addScholarship} />}

      <div style={{ ...css.heading, marginBottom: 4 }}>🧑‍💼 Admin Panel</div>
      <div style={{ ...css.sub, marginBottom: 28 }}>IIIT Dharwad — Scholarship Management</div>

      {/* Live Stats */}
      <div style={{ ...css.grid4, marginBottom: 24 }}>
        {[["Total Students", 800, G.blue], ["Applications", apps.length, G.accent], ["Pending", pending, "#f5a623"], ["Approved", approved, "#00c896"]].map(([l, v, c]) => (
          <div key={l} style={css.statCard}>
            <div style={css.statLabel}>{l}</div>
            <div style={{ ...css.statNum, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ ...css.grid2, marginBottom: 24 }}>
        <div style={css.card}>
          <div style={css.cardTitle}>📊 Application Status</div>
          <DonutChart pending={pending} approved={approved} rejected={rejected} />
        </div>
        <div style={css.card}>
          <div style={css.cardTitle}>🎓 Applications per Scholarship</div>
          <BarChart scholarships={scholarships} apps={apps} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: `1px solid ${G.border}` }}>
        {[["applications", "📋 Applications"], ["scholarships", "🎓 Scholarships"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 22px", border: "none",
            borderBottom: tab === t ? `2px solid ${G.blue}` : "2px solid transparent",
            background: "transparent", color: tab === t ? G.blue : G.muted,
            cursor: "pointer", fontSize: 14, fontWeight: tab === t ? 700 : 400,
            marginBottom: -1, fontFamily: "system-ui",
          }}>{label}</button>
        ))}
      </div>

      {/* ── Applications Tab ── */}
      {tab === "applications" && (
        <div style={css.card}>

          {/* ── Filter Bar ── */}
          <div style={{ marginBottom: 18 }}>

            {/* Row 1: search + reset */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
              <input
                style={{ ...css.input, marginTop: 0, maxWidth: 180, fontSize: 13 }}
                placeholder="🔍 Search by name..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
              <input
                style={{ ...css.input, marginTop: 0, maxWidth: 160, fontSize: 13 }}
                placeholder="🔍 Student ID..."
                value={searchStudentId}
                onChange={e => setSearchStudentId(e.target.value)}
              />
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  style={{
                    padding: "7px 14px", borderRadius: 8, border: `1px solid #ff4d6d44`,
                    background: "#ff4d6d0d", color: "#e0284a", cursor: "pointer",
                    fontSize: 12, fontFamily: "system-ui", fontWeight: 600,
                  }}
                >
                  ✕ Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
                </button>
              )}
              <span style={{ marginLeft: "auto", fontSize: 12, color: G.muted, fontFamily: "system-ui" }}>
                Showing <b style={{ color: G.text }}>{filtered.length}</b> of {apps.length} applications
              </span>
            </div>

            {/* Row 2: dropdowns */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>

              {/* Status */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" }}>Status</span>
                <select
                  style={selectStyle(filterStatus !== "All")}
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  {["All", "Pending", "Approved", "Rejected"].map(s => (
                    <option key={s} value={s}>
                      {s === "All" ? `All (${apps.length})` : `${s} (${apps.filter(a => a.status === s).length})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" }}>Category</span>
                <select
                  style={selectStyle(filterCategory !== "All")}
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Branch */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" }}>Branch</span>
                <select
                  style={selectStyle(filterBranch !== "All")}
                  value={filterBranch}
                  onChange={e => setFilterBranch(e.target.value)}
                >
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* CGPA Range */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" }}>CGPA</span>
                <select
                  style={selectStyle(filterCgpa !== "All")}
                  value={filterCgpa}
                  onChange={e => setFilterCgpa(e.target.value)}
                >
                  {cgpaRanges.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Scholarship */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" }}>Scholarship</span>
                <select
                  style={{ ...selectStyle(filterScholarship !== "All"), maxWidth: 200 }}
                  value={filterScholarship}
                  onChange={e => setFilterScholarship(e.target.value)}
                >
                  {schNames.map(s => (
                    <option key={s} value={s} title={s}>
                      {s.length > 26 ? s.slice(0, 24) + "…" : s}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* ── Table ── */}
          <table style={css.table}>
            <thead>
              <tr>
                {["Student ID", "Name", "CGPA", "Income", "Category", "Branch", "Scholarship", "Status", "Actions"].map(h => (
                  <th key={h} style={css.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ ...css.td, textAlign: "center", color: G.muted, padding: 40 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                    No applications match the selected filters.
                    <div style={{ marginTop: 10 }}>
                      <button onClick={resetFilters} style={{ ...css.btnOutline, fontSize: 12, padding: "6px 14px" }}>
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((a) => {
                const realIdx = apps.indexOf(a);
                return (
                  <tr
                    key={a.id}
                    onMouseEnter={e => e.currentTarget.style.background = G.surfaceHover}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...css.td, color: G.muted }}>{a.studentId || a.id}</td>
                    <td style={{ ...css.td, fontWeight: 600 }}>{a.name}</td>
                    <td style={{ ...css.td, color: G.blue, fontWeight: 700 }}>{a.cgpa}</td>
                    <td style={css.td}>{a.income}</td>
                    <td style={css.td}>
                      <span style={{ background: G.border, padding: "2px 10px", borderRadius: 20, fontSize: 12 }}>
                        {a.category}
                      </span>
                    </td>
                    <td style={{ ...css.td, fontSize: 12, color: G.muted }}>{a.branch || "—"}</td>
                    <td style={{ ...css.td, fontSize: 12 }}>{a.scholarship}</td>
                    <td style={css.td}><StatusBadge status={a.status} /></td>
                    <td style={css.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {a.status === "Pending" ? (
                          <>
                            <button style={css.btnSm} onClick={() => handleAction(realIdx, "Approved")}>✓ Approve</button>
                            <button style={css.btnDanger} onClick={() => handleAction(realIdx, "Rejected")}>✗ Reject</button>
                          </>
                        ) : (
                          <button style={css.btnGhost} onClick={() => handleAction(realIdx, "Pending")}>↩ Reset</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Scholarships Tab ── */}
      {tab === "scholarships" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button style={css.btn} onClick={() => setShowModal(true)}>+ Add Scholarship</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {scholarships.map(s => (
              <div key={s.id} style={{ ...css.card, marginBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: G.text, marginBottom: 10 }}>{s.name}</div>
                  <div style={{ display: "flex", gap: 28 }}>
                    {[["Amount", fmt(s.amount)], ["Min CGPA", s.minCgpa], ["Max Income", fmt(s.maxIncome)], ["Slots", s.slots]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ ...css.statLabel, fontSize: 10 }}>{l}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: G.blue }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button style={css.btnDanger} onClick={() => deleteScholarship(s.id)}>🗑 Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null);
  const [student, setStudent] = useState(null);
  const [page, setPage] = useState("dashboard");

  const handleLogin = (r, s) => { setRole(r); setStudent(s); setPage("dashboard"); };
  const handleLogout = () => { setRole(null); setStudent(null); setPage("dashboard"); };

  if (!role) return <LandingPage onLogin={handleLogin} />;

  const navItems = role === "student"
    ? [["dashboard", "Dashboard"], ["records", "Academic Records"], ["rankings", "🏆 Rankings"], ["scholarships", "Scholarships"], ["applications", "My Applications"]]
    : [["dashboard", "Admin Panel"]];

  return (
    <div style={css.app}>
      <nav style={css.nav}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={IIIT_LOGO} alt="IIIT Dharwad" style={{ height: 44, width: 44, objectFit: "contain", background: "white", borderRadius: 8, padding: 3}} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>IIIT Dharwad</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase" }}>Scholarship Portal</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map(([p, label]) => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: "7px 16px", borderRadius: 6,
              border: `1px solid ${page === p ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)"}`,
              background: page === p ? "rgba(255,255,255,0.18)" : "transparent",
              color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "system-ui",
            }}>{label}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{role === "admin" ? "Admin" : student?.name}</span>
          <button onClick={handleLogout} style={{ padding: "7px 16px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "system-ui" }}>Logout</button>
        </div>
      </nav>

      {role === "student" && (
        <>
          {page === "dashboard" && <StudentDashboard student={student} onNav={setPage} />}
          {page === "records" && <AcademicRecords student={student} onNav={setPage} />}
          {page === "rankings" && <StudentRankings student={student} onNav={setPage} />}
          {page === "scholarships" && <ScholarshipListing student={student} onNav={setPage} />}
          {page === "applications" && <ApplicationStatus student={student} onNav={setPage} />}
        </>
      )}
      {role === "admin" && page === "dashboard" && <AdminDashboard />}
    </div>
  );
}
