import { useState, useEffect } from "react";

function ScoreCard({ score, onView }) {
  const [hovered, setHovered] = useState(false);
  const finalScore = score.final_score ?? null;
  const scoreColor = finalScore >= 70 ? "#27ae60" : finalScore >= 50 ? "#f39c12" : "#e74c3c";

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 30px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)",
        cursor: "pointer",
        borderLeft: `4px solid ${scoreColor}`,
      }}
      onClick={() => onView(score)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={styles.cardTitle}>{score.student_name || "Student"}</h3>
        <span style={{ fontSize: 28, fontWeight: 800, color: scoreColor }}>
          {finalScore !== null ? finalScore.toFixed(1) : "—"}
        </span>
      </div>
      <p style={styles.company}>{score.company_name || "—"}</p>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <span style={styles.miniStat}>
          Supervisor: <strong>{score.supervisor_score ?? "—"}</strong>
        </span>
        <span style={styles.miniStat}>
          Academic: <strong>{score.academic_score ?? "—"}</strong>
        </span>
      </div>
    </div>
  );
}

function ScoreModal({ score, onClose }) {
  const finalScore = score.final_score ?? null;
  const scoreColor = finalScore >= 70 ? "#27ae60" : finalScore >= 50 ? "#f39c12" : "#e74c3c";

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a2e", margin: "0 0 6px" }}>
          Weighted Score
        </h2>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: "#888" }}>{score.student_name} — {score.company_name}</p>

        {/* Big score display */}
        <div style={{ textAlign: "center", marginBottom: 24, padding: "24px", background: "#f8f9fb", borderRadius: 12 }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: scoreColor, fontFamily: "'Playfair Display', serif" }}>
            {finalScore !== null ? finalScore.toFixed(1) : "—"}
          </div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Final Score</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={styles.detailSection}>
            <strong style={styles.detailLabel}>Supervisor Score (60%)</strong>
            <p style={{ ...styles.detailValue, fontSize: 20, fontWeight: 700, color: "#f39c12" }}>
              {score.supervisor_score ?? "—"}
            </p>
          </div>
          <div style={styles.detailSection}>
            <strong style={styles.detailLabel}>Academic Score (40%)</strong>
            <p style={{ ...styles.detailValue, fontSize: 20, fontWeight: 700, color: "#8e44ad" }}>
              {score.academic_score ?? "—"}
            </p>
          </div>
        </div>

        <div style={{ ...styles.detailSection, marginTop: 12 }}>
          <strong style={styles.detailLabel}>Calculated At</strong>
          <p style={styles.detailValue}>
            {score.calculated_at ? new Date(score.calculated_at).toLocaleString() : "—"}
          </p>
        </div>

        <div style={{ marginTop: 16, padding: "12px 16px", background: "#f8f9fb", borderRadius: 8, fontSize: 12, color: "#888" }}>
          Formula: Final Score = (Supervisor Score × 0.6) + (Academic Score × 0.4)
        </div>
      </div>
    </div>
  );
}

export default function WeightedScore() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/weighted-scores/", {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setScores(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const avg = scores.length
    ? (scores.reduce((sum, s) => sum + (s.final_score || 0), 0) / scores.length).toFixed(1)
    : null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Weighted Scores</h1>
            <p style={styles.subtitle}>ILES — Internship Logging & Evaluation System</p>
          </div>
          {avg && (
            <div style={styles.avgBox}>
              <span style={{ fontSize: 11, color: "#888" }}>Class Average</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e" }}>{avg}</span>
            </div>
          )}
        </div>

        {loading && <div style={styles.loader}>Loading scores...</div>}
        {error && (
          <div style={styles.errorBox}>
            <span>⚠️</span>
            <strong>Could not load scores</strong>
            <p style={{ color: "#e74c3c", fontSize: 13 }}>{error}</p>
          </div>
        )}
        {!loading && !error && scores.length === 0 && (
          <div style={styles.emptyBox}>
            <span style={{ fontSize: 40 }}>📊</span>
            <p>No scores available yet.</p>
          </div>
        )}
        {!loading && !error && scores.length > 0 && (
          <div style={styles.grid}>
            {scores.map((s) => <ScoreCard key={s.id} score={s} onView={setSelected} />)}
          </div>
        )}
      </div>
      {selected && <ScoreModal score={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

const styles = {
  page: { fontFamily: "'DM Sans', sans-serif", maxWidth: 1100, margin: "0 auto", padding: "32px 20px", background: "#f8f9fb", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  title: { margin: "0 0 4px", fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a2e" },
  subtitle: { margin: 0, fontSize: 13, color: "#888" },
  avgBox: { background: "#fff", borderRadius: 12, padding: "12px 20px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid #f0f0f0" },
  card: { background: "#fff", borderRadius: 12, padding: "20px", border: "1.5px solid #f0f0f0", transition: "all 0.2s ease" },
  cardTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Playfair Display', serif" },
  company: { margin: 0, fontSize: 13, color: "#888" },
  miniStat: { fontSize: 12, color: "#666", background: "#f8f9fb", padding: "4px 10px", borderRadius: 8 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#fff", borderRadius: 16, padding: "28px", maxWidth: 480, width: "100%", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  closeBtn: { position: "absolute", top: 16, right: 16, background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 14 },
  detailSection: { background: "#f8f9fb", borderRadius: 8, padding: "12px 14px", marginBottom: 10 },
  detailLabel: { fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" },
  detailValue: { margin: "6px 0 0", color: "#444", lineHeight: 1.7, fontSize: 14 },
  loader: { textAlign: "center", padding: "60px 20px", color: "#888", fontSize: 14 },
  errorBox: { background: "#fff5f5", border: "1.5px solid #fcc", borderRadius: 12, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" },
  emptyBox: { textAlign: "center", padding: "60px 20px", color: "#aaa" },
};
