import { useState, useEffect } from "react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "#f39c12", bg: "#fef9ec" },
  active: { label: "Active", color: "#27ae60", bg: "#edfaf3" },
  completed: { label: "Completed", color: "#3498db", bg: "#eaf4fd" },
};

export default function InternshipPlacement() {
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch("/Internship_Placement/", {
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
        setPlacement(Array.isArray(data) ? data[0] : data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const status = placement ? STATUS_CONFIG[placement.status] || STATUS_CONFIG.pending : null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={styles.page}>
        <h1 style={styles.title}>My Internship Placement</h1>
        <p style={styles.subtitle}>ILES — Internship Logging & Evaluation System</p>

        {loading && <div style={styles.loader}>Loading placement details...</div>}

        {error && (
          <div style={styles.errorBox}>
            <span style={{ fontSize: 28 }}>⚠️</span>
            <strong>Could not load placement</strong>
            <p style={{ color: "#e74c3c", fontSize: 13 }}>{error}</p>
          </div>
        )}

        {!loading && !error && !placement && (
          <div style={styles.emptyBox}>
            <span style={{ fontSize: 40 }}>🏢</span>
            <p>No placement found. Contact your coordinator.</p>
          </div>
        )}

        {!loading && !error && placement && (
          <div style={styles.card}>
            <span style={{ ...styles.badge, color: status.color, background: status.bg }}>
              {status.label}
            </span>
            <h2 style={styles.companyName}>{placement.company_name}</h2>
            <div style={styles.grid}>
              <div style={styles.infoBox}>
                <span style={styles.label}>Start Date</span>
                <span style={styles.value}>
                  {placement.start_date ? new Date(placement.start_date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                </span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>End Date</span>
                <span style={styles.value}>
                  {placement.end_date ? new Date(placement.end_date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                </span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>Workplace Supervisor</span>
                <span style={styles.value}>{placement.workplace_supervisor_name || "Not assigned"}</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>Academic Supervisor</span>
                <span style={styles.value}>{placement.academic_supervisor_name || "Not assigned"}</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>Student</span>
                <span style={styles.value}>{placement.student_name || "—"}</span>
              </div>
              <div style={styles.infoBox}>
                <span style={styles.label}>Status</span>
                <span style={{ ...styles.value, color: status.color, fontWeight: 700 }}>{status.label}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: { fontFamily: "'DM Sans', sans-serif", maxWidth: 800, margin: "0 auto", padding: "32px 20px", background: "#f8f9fb", minHeight: "100vh" },
  title: { margin: "0 0 4px", fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a2e" },
  subtitle: { margin: "0 0 28px", fontSize: 13, color: "#888" },
  card: { background: "#fff", borderRadius: 16, padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid #f0f0f0" },
  badge: { display: "inline-block", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, marginBottom: 16 },
  companyName: { margin: "0 0 24px", fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a2e" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 },
  infoBox: { background: "#f8f9fb", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  value: { fontSize: 15, color: "#1a1a2e", fontWeight: 500 },
  loader: { textAlign: "center", padding: "60px 20px", color: "#888", fontSize: 14 },
  errorBox: { background: "#fff5f5", border: "1.5px solid #fcc", borderRadius: 12, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" },
  emptyBox: { textAlign: "center", padding: "60px 20px", color: "#aaa" },
};
