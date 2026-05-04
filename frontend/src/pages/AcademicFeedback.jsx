import { useState, useEffect } from "react";

function FeedbackCard({ feedback, onView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...styles.card, transform: hovered ? "translateY(-3px)" : "translateY(0)", boxShadow: hovered ? "0 8px 30px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer", borderLeft: "4px solid #8e44ad" }}
      onClick={() => onView(feedback)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <h3 style={styles.cardTitle}>Academic Feedback</h3>
        <span style={styles.scoreBadge}>Score: {feedback.academic_score ?? "—"}</span>
      </div>
      <p style={styles.preview}>{feedback.comments || "No comments provided."}</p>
      <p style={styles.date}>{feedback.evaluated_at ? new Date(feedback.evaluated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</p>
    </div>
  );
}

function FeedbackModal({ feedback, onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a2e", margin: "0 0 20px" }}>Academic Supervisor Feedback</h2>
        <div style={styles.detailSection}>
          <strong style={styles.detailLabel}>Comments</strong>
          <p style={styles.detailValue}>{feedback.comments || "—"}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
          <div style={styles.detailSection}>
            <strong style={styles.detailLabel}>Score</strong>
            <p style={{ ...styles.detailValue, fontSize: 24, fontWeight: 800, color: "#8e44ad" }}>{feedback.academic_score ?? "—"}</p>
          </div>
          <div style={styles.detailSection}>
            <strong style={styles.detailLabel}>Evaluated At</strong>
            <p style={styles.detailValue}>{feedback.evaluated_at ? new Date(feedback.evaluated_at).toLocaleString() : "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmitFeedbackForm({ onSuccess }) {
  const [form, setForm] = useState({ placement: "", comments: "", academic_score: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage(null);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("/Academic_Supervisor_Feedback/", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Token ${token}` }) },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      setMessage({ type: "success", text: "Academic feedback submitted!" });
      setForm({ placement: "", comments: "", academic_score: "" });
      onSuccess();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ ...styles.card, marginBottom: 28 }}>
      <h3 style={{ margin: "0 0 20px", fontFamily: "'Playfair Display', serif", color: "#1a1a2e" }}>Submit Academic Feedback</h3>
      {message && (
        <div style={{ padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 13, background: message.type === "success" ? "#edfaf3" : "#fdf0ef", color: message.type === "success" ? "#27ae60" : "#e74c3c" }}>
          {message.text}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Placement ID</label>
          <input name="placement" type="number" value={form.placement} onChange={handleChange} style={styles.input} placeholder="Placement ID" />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Score (0-100)</label>
          <input name="academic_score" type="number" value={form.academic_score} onChange={handleChange} style={styles.input} placeholder="e.g. 80" min="0" max="100" />
        </div>
      </div>
      <div style={{ ...styles.formGroup, marginBottom: 16 }}>
        <label style={styles.formLabel}>Comments</label>
        <textarea name="comments" value={form.comments} onChange={handleChange} style={styles.textarea} placeholder="Write your academic feedback..." />
      </div>
      <button onClick={handleSubmit} disabled={submitting} style={styles.submitBtn}>{submitting ? "Submitting..." : "Submit Feedback"}</button>
    </div>
  );
}

export default function AcademicFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFeedbacks = () => {
    const token = localStorage.getItem("access_token");
    fetch("/Academic_Supervisor_Feedback/", {
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Token ${token}` }) },
    })
      .then((res) => { if (!res.ok) throw new Error(`Error ${res.status}`); return res.json(); })
      .then((data) => { setFeedbacks(Array.isArray(data) ? data : data.results || []); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Academic Supervisor Feedback</h1>
            <p style={styles.subtitle}>ILES — Internship Logging & Evaluation System</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={styles.newBtn}>{showForm ? "Cancel" : "+ Give Feedback"}</button>
        </div>
        {showForm && <SubmitFeedbackForm onSuccess={() => { fetchFeedbacks(); setShowForm(false); }} />}
        {loading && <div style={styles.loader}>Loading feedback...</div>}
        {error && <div style={styles.errorBox}><span>⚠️</span><strong>Could not load feedback</strong><p style={{ color: "#e74c3c", fontSize: 13 }}>{error}</p></div>}
        {!loading && !error && feedbacks.length === 0 && <div style={styles.emptyBox}><span style={{ fontSize: 40 }}>🎓</span><p>No academic feedback yet.</p></div>}
        {!loading && !error && feedbacks.length > 0 && (
          <div style={styles.grid}>{feedbacks.map((fb) => <FeedbackCard key={fb.id} feedback={fb} onView={setSelected} />)}</div>
        )}
      </div>
      {selected && <FeedbackModal feedback={selected} onClose={() => setSelected(null)} />}
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
  cardTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" },
  scoreBadge: { fontSize: 13, fontWeight: 700, color: "#8e44ad", background: "#f5eef8", padding: "3px 12px", borderRadius: 20 },
  preview: { margin: "0 0 10px", fontSize: 13, color: "#666", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  date: { margin: 0, fontSize: 12, color: "#aaa" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#fff", borderRadius: 16, padding: "28px", maxWidth: 520, width: "100%", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  closeBtn: { position: "absolute", top: 16, right: 16, background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 14 },
  detailSection: { background: "#f8f9fb", borderRadius: 8, padding: "12px 14px", marginBottom: 10 },
  detailLabel: { fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" },
  detailValue: { margin: "6px 0 0", color: "#444", lineHeight: 1.7, fontSize: 14 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  formLabel: { fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { padding: "10px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" },
  textarea: { padding: "10px 12px", border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", minHeight: 100, resize: "vertical" },
  submitBtn: { background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  loader: { textAlign: "center", padding: "60px 20px", color: "#888", fontSize: 14 },
  errorBox: { background: "#fff5f5", border: "1.5px solid #fcc", borderRadius: 12, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" },
  emptyBox: { textAlign: "center", padding: "60px 20px", color: "#aaa" },
};
