import { useState, useEffect } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = () => {
    const token = localStorage.getItem("token");
    fetch("/api/notifications/", {
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
        setNotifications(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const markAsRead = async (id) => {
    const token = localStorage.getItem("access_token");
    try {
      await fetch(`/api/notifications/${id}/mark-read/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Token ${token}` }),
        },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Could not mark as read:", err);
    }
  };

  const markAllRead = () => {
    notifications.filter((n) => !n.is_read).forEach((n) => markAsRead(n.id));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Notifications
              {unreadCount > 0 && (
                <span style={styles.unreadBadge}>{unreadCount}</span>
              )}
            </h1>
            <p style={styles.subtitle}>ILES — Internship Logging & Evaluation System</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={styles.markAllBtn}>
              Mark all as read
            </button>
          )}
        </div>

        {loading && <div style={styles.loader}>Loading notifications...</div>}

        {error && (
          <div style={styles.errorBox}>
            <span>⚠️</span>
            <strong>Could not load notifications</strong>
            <p style={{ color: "#e74c3c", fontSize: 13 }}>{error}</p>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div style={styles.emptyBox}>
            <span style={{ fontSize: 40 }}>🔔</span>
            <p>No notifications yet.</p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div style={styles.list}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  ...styles.notifCard,
                  background: notif.is_read ? "#fff" : "#f0f4ff",
                  borderLeft: notif.is_read ? "4px solid #e0e0e0" : "4px solid #3498db",
                }}
                onClick={() => !notif.is_read && markAsRead(notif.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <p style={styles.verb}>
                      {!notif.is_read && <span style={styles.unreadDot} />}
                      {notif.verb}
                    </p>
                    <p style={styles.meta}>
                      From: <strong>{notif.actor_name || "System"}</strong>
                      {notif.target_type && ` · ${notif.target_type}`}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={styles.time}>
                      {notif.created_at
                        ? new Date(notif.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                        : "—"}
                    </span>
                    {!notif.is_read && (
                      <span style={styles.unreadLabel}>Unread</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: { fontFamily: "'DM Sans', sans-serif", maxWidth: 800, margin: "0 auto", padding: "32px 20px", background: "#f8f9fb", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  title: { margin: "0 0 4px", fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a2e", display: "flex", alignItems: "center", gap: 10 },
  unreadBadge: { background: "#e74c3c", color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 20, fontFamily: "'DM Sans', sans-serif" },
  subtitle: { margin: 0, fontSize: 13, color: "#888" },
  markAllBtn: { background: "#fff", color: "#3498db", border: "1.5px solid #3498db", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  list: { display: "flex", flexDirection: "column", gap: 10 },
  notifCard: { borderRadius: 12, padding: "16px 20px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  verb: { margin: "0 0 4px", fontSize: 14, color: "#1a1a2e", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 },
  unreadDot: { width: 8, height: 8, borderRadius: "50%", background: "#3498db", display: "inline-block", flexShrink: 0 },
  meta: { margin: 0, fontSize: 12, color: "#888" },
  time: { fontSize: 11, color: "#aaa" },
  unreadLabel: { fontSize: 11, fontWeight: 600, color: "#3498db", background: "#eaf4fd", padding: "2px 8px", borderRadius: 10 },
  loader: { textAlign: "center", padding: "60px 20px", color: "#888", fontSize: 14 },
  errorBox: { background: "#fff5f5", border: "1.5px solid #fcc", borderRadius: 12, padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" },
  emptyBox: { textAlign: "center", padding: "60px 20px", color: "#aaa" },
};
