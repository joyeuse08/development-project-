import { useState, useEffect } from "react";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "#7f8c8d", bg: "#f4f4f4" },
  submitted: { label: "Submitted", color: "#3498db", bg: "#eaf4fd" },
  reviewed: { label: "Reviewed", color: "#f39c12", bg: "#fef9ec" },
  approved: { label: "Approved", color: "#27ae60", bg: "#edfaf3" },
  rejected: { label: "Rejected", color: "#e74c3c", bg: "#fdf0ef" },
};

function LogCard({ log, onView }) {
  const status = STATUS_CONFIG[log.status] || STATUS_CONFIG.draft;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...styles.card, transform: hovered ? "translateY(-3px)" : "translateY(0)", boxShadow: hovered ? "0 8px 30px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer", borderLeft: `4px solid ${status.color}` }}
      onClick={() => onView(log)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h3 style={styles.weekTitle}>Week {log.week_number}</h3>
        <span style={{ ...styles.badge, color: status.color, background: status.bg }}>{status.label}</span>
      </div>
      <p style={styles.preview}>{log.activities || "No activities recorded."}</p>
      <p style={styles.date}>Submitted: {log.submitted_at ? new Date(log.submitted_at).toLocaleDateString("en-GB") : "Not yet"}</p>
    </div>
  );
}

function LogModal({ log, onClose }) {
  const status = STATUS_CONFIG[log.status] || STATUS_CONFIG.draft;
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        <span style={{ ...styles.badge, color: status.color, background: status.bg, marginBottom: 12, display: "inline-block" }}>{status.label}</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a2e", margin: "0 0 20px" }}>Week {log.week_number} Log</h2>
        {[{ label: "Activities", value: log.activities }, { label: "Challenges", value: log.challenges }, { label: "Learnings", value: log.learnings }, { label: "Feedback", value: log.feedback }].map(({ label, value }) => (
          <div key={label} style={styles.detailSection}>
            <strong style={{ fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</strong>
            <p style={{ margin: "6px 0 0", color: "#444", lineHeight: 1.7, fontSize: 14 }}>{value || "—"}</p>
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
          <div style={styles.detailSection}>
            <strong style={{ fontSize: 12, color: "#aaa", textTransform: "uppercase" }}>Hours</strong>
            <p style={{ margin: "6px 0 0", color: "#1a1a2e", fontWeight: 600 }}>{log.hours || "—"}</p>
          </div>
          <div style={styles.detailSection}>
            <strong style={{ fontSize: 12, color: "#aaa", textTransform: "uppercase" }}>Submitted</strong>
            <p style={{ margin: "6px 0 0", color: "#444", fontSize: 13 }}>{log.submitted_at ? new Date(log.submitted_at).toLocaleString() : "Not yet"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitLogForm({ onSuccess }) {
  const [form, setForm] = useState({ week_number: "", activities: "", challenges: "", learnings: "", hours: "", status: "draft" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage(null);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("/Weekly_Log/", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Token ${token}` }) },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit log");
      setMessage({ type: "success", text: "Log submitted successfully!" });
      setForm({ week_number: "", activities: "", challenges: "", learnings: "", hours: "", status: "draft" });
      onSuccess();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ ...styles.card, marginBottom: 28 }}>
      <h3 style={{ margin: "0 0 20px", fontFamily: "'Playfair Display', serif", color: "#1a1a2e" }}>Submit New Weekly Log</h3>
      {message && (
        <div style={{ padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13, background: message.type === "success" ? "#edfaf3" : "#fdf0ef", color: message.type === "success" ? "#27ae60" : "#e74c3c" }}>
          {message.text}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Week Number</label>
          <input name="week_number" type="number" value={form.week_number} onChange={handleChange} style={styles.input} placeholder="e.g. 1" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Hours Worked</label>
          <input name="hours" type="number" value={form.hours} onChange={handleChange} style={styles.input} placeholder="e.g. 40" />
        </div>
      </div>
      {[{ name: "activities", label: "Activities" }, { name: "challenges", label: "Challenges" }, { name: "learnings", label: "Learnings" }].map(({ name, label }) => (
        <div key={name} style={{ ...styles.formGroup, marginBottom: 14 }}>
          <label style={styles.formLabel}>{label}</label>
          <textarea name={name} value={form[name]} onChange={handleChange} style={styles.textarea} placeholder={`Describe your ${label.toLowerCase()}...`} />
        </div>
      ))}
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Status</label>
        <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
          <option value="draft">Save as Draft</option>
          <option value="submitted">Submit</option>
        </select>
      </div>
      <button onClick={handleSubmit} disabled={submitting} style={styles.submitBtn}>{submitting ? "Submitting..." : "Submit Log"}</button>
    </div>
  );
}

export default function WeeklyLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchLogs = () => {
    const token = localStorage.getItem("access_token");
    fetch("/Weekly_Log/", {
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Token ${token}` }) },
    })
      .then((res) => { if (!res.ok) throw new Error(`Error ${res.status}`); return res.json(); })
      .then((data) => { setLogs(Array.isArray(data) ? data : data.results || []); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Weekly Logs</h1>
            <p style={styles.subtitle}>ILES — Internship Logging & Evaluation System</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={styles.newBtn}>{showForm ? "Cancel" : "+ New Log"}</button>
        </div>
        {showForm && <SubmitLogForm onSuccess={() => { fetchLogs(); setShowForm(false); }} />}
        {loading && <div style={styles.loader}>Loading logs...</div>}
        {error && <div style={styles.errorBox}><span>⚠️</span><strong>Could not load logs</strong><p style={{ color: "#e74c3c", fontSize: 13 }}>{error}</p></div>}
        {!loading && !error && logs.length === 0 && <div style={styles.emptyBox}><span style={{ fontSize: 40 }}>📋</span><p>No weekly logs yet. Submit your first log!</p></div>}
        {!loading && !error && logs.length > 0 && (
          <div style={styles.grid}>{logs.map((log) => <LogCard key={log.id} log={log} onView={setSelectedLog} />)}</div>
        )}
      </div>
      {selectedLog && <LogModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </>
  );
}

const styles = {
  page: { fontFamily: "'DM Sans', sans-serif", maxWidth: 1100, margin: "0 auto", padding: "32px 20px", background: "#f8f9fb", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  title: { margin: "0 0 4px", fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a2e" },
  subtitle: { margin: 0, fontSize: 13, color: "#888" },
  newBtn: { background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  card: { background: "#fff", borderRadius: 12, padding: "20px", border: "1.5px solid #f0f0f0", transition: "all 0.2s ease" },
  weekTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" },
  badge: { fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 },
  preview: { margin: "0 0 10px", fontSize: 13, color: "#666", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  date: { margin: 0, fontSize: 12, color: "#aaa" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#fff", borderRadius: 16, padding: "28px", maxWidth: 560, width: "100%", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  closeBtn: { position: "absolute", top: 16, right: 16, background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 14 },
  detailSection: { background: "#f8f9fb", borderRadius: 8, padding: "12px 14px", marginBottom: 10 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  formLabel: { fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { padding: "10px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" },
  textarea: { padding: "10px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", minHeight: 90, resize: "vertical" },
  submitBtn: { background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8, fontFamily: "'DM Sans', sans-serif" },
  loader: { textAlign: "center", padding: "60px 20px", color: "#888", fontSize: 14 },
  errorBox: { background: "#fff5f5", border: "1.5px solid #fcc", borderRadius: 12, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" },
  emptyBox: { textAlign: "center", padding: "60px 20px", color: "#aaa" },
};
