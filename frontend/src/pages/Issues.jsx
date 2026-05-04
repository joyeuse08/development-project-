import { useState, useEffect } from "react";

const STATUS_CONFIG = {
  open: { label: "Open", color: "#e74c3c", bg: "#fdf0ef", icon: "🔴" },
  in_progress: { label: "In Progress", color: "#f39c12", bg: "#fef9ec", icon: "🟡" },
  resolved: { label: "Resolved", color: "#27ae60", bg: "#edfaf3", icon: "🟢" },
  
};



//Skeleton loader card
function SkeletonCard() {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.skeleton, width: "60%", height: 18, marginBottom: 10 }} />
      <div style={{ ...styles.skeleton, width: "90%", height: 14, marginBottom: 6 }} />
      <div style={{ ...styles.skeleton, width: "70%", height: 14, marginBottom: 18 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ ...styles.skeleton, width: 70, height: 24, borderRadius: 20 }} />
        <div style={{ ...styles.skeleton, width: 70, height: 24, borderRadius: 20 }} />
      </div>
    </div>
  );
}

// Single issue card 
function IssueCard({ issue, onSelect }) {
  const status = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open;
 
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 30px rgba(0,0,0,0.12)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        borderLeft: `4px solid ${status.color}`,
      }}
      onClick={() => onSelect(issue)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>
          #{issue.id}
        </span>
        
      </div>

      {/* Title */}
      <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Playfair Display', Georgia, serif" }}>
        {issue.title}
      </h3>

      {/* Description preview */}
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "#666", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {issue.issue_type || "No description provided."}
      </p>

      {/* Footer row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        {/* Status badge */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: status.color,
            background: status.bg,
            padding: "3px 10px",
            borderRadius: 20,
          }}
        >
          {status.icon} {status.label}
        </span>

        {/* Meta */}
        <span style={{ fontSize: 11, color: "#aaa" }}>
          {issue.created_at
            ? new Date(issue.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : "—"}
        </span>
      </div>

      {/* Reported by */}
      {issue.reported_by_name && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#888" }}>
          🧑 Reported by <strong>{issue.reported_by_name}</strong>
        </div>
      )}
    </div>
  );
}

// Detail modal
function IssueModal({ issue, onClose }) {
  const status = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open;
  

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, color: status.color, background: status.bg }}>
            {status.icon} {status.label}
          </span>
          
        </div>

        <h2 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a2e", fontSize: 20 }}>
          {issue.title}
        </h2>
        <p style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>Issue #{issue.id}</p>

        <div style={styles.detailSection}>
          <strong>Description</strong>
          <p style={{ marginTop: 6, color: "#444", lineHeight: 1.7, fontSize: 14 }}>
           {issue.issue_type || "No description provided."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <div style={styles.detailSection}>
            <strong>Reported By</strong>
            <p style={styles.detailValue}>{issue.reported_by_name || "—"}</p>
          </div>
         
          <div style={styles.detailSection}>
            <strong>Created</strong>
            <p style={styles.detailValue}>
              {issue.created_at ? new Date(issue.created_at).toLocaleString() : "—"}
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// Main IssuesList component 
export default function IssuesList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/issues/", {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Token ${token}` }),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        setIssues(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter + search
  const filtered = issues.filter((issue) => {
    const matchStatus = filterStatus === "all" || issue.status === filterStatus;
    const matchSearch =
      !searchQuery ||
      issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.issue_type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, key) => {
    acc[key] = issues.filter((i) => i.status === key).length;
    return acc;
  }, {});

  return (
    <>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Issues</h1>
            <p style={styles.subtitle}>ILES — Internship Logging & Evaluation System</p>
          </div>
          <div style={styles.totalBadge}>{issues.length} total</div>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} style={{ ...styles.statCard, borderTop: `3px solid ${cfg.color}` }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: cfg.color }}>{counts[key] || 0}</span>
              <span style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="🔍  Search issues…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.filterRow}>
            {["all", ...Object.keys(STATUS_CONFIG)].map((key) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                style={{
                  ...styles.filterBtn,
                  background: filterStatus === key ? "#1a1a2e" : "#fff",
                  color: filterStatus === key ? "#fff" : "#555",
                  borderColor: filterStatus === key ? "#1a1a2e" : "#e0e0e0",
                }}
              >
                {key === "all" ? "All" : STATUS_CONFIG[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div style={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <span style={{ fontSize: 28 }}>⚠️</span>
            <strong>Could not load issues</strong>
            <p style={{ margin: 0, fontSize: 13, color: "#e74c3c" }}>{error}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>Make sure the Django server is running and /api/issues/ is accessible.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={styles.emptyBox}>
            <span style={{ fontSize: 40 }}>📋</span>
            <p style={{ margin: "8px 0 0", color: "#888" }}>No issues found.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={styles.grid}>
            {filtered.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onSelect={setSelectedIssue} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedIssue && (
        <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}
    </>
  );
}

// Styles
const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 20px",
    background: "#f8f9fb",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 700,
    fontFamily: "'Playfair Display', Georgia, serif",
    color: "#1a1a2e",
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "#888",
  },
  totalBadge: {
    background: "#1a1a2e",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    padding: "6px 14px",
    borderRadius: 20,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    background: "#fff",
    borderRadius: 10,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  controls: {
    marginBottom: 24,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  searchInput: {
    width: "100%",
    padding: "10px 16px",
    fontSize: 14,
    border: "1.5px solid #e0e0e0",
    borderRadius: 10,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "6px 14px",
    fontSize: 13,
    border: "1.5px solid",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "18px 20px",
    border: "1.5px solid #f0f0f0",
  },
  skeleton: {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    borderRadius: 6,
    display: "block",
  },
  errorBox: {
    background: "#fff5f5",
    border: "1.5px solid #fcc",
    borderRadius: 12,
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    textAlign: "center",
    color: "#333",
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#aaa",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px",
    maxWidth: 560,
    width: "100%",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "#f0f0f0",
    border: "none",
    borderRadius: "50%",
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
  },
  detailSection: {
    background: "#f8f9fb",
    borderRadius: 8,
    padding: "12px 14px",
    fontSize: 13,
  },
  detailValue: {
    margin: "4px 0 0",
    color: "#444",
    fontSize: 14,
  },
};
