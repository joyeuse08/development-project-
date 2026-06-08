import { useState } from "react";
import api from "../axiosConfig";

export default function PlacementRequest() {
  const [formData, setFormData] = useState({
    student_name: "",
    company_name: "",
    workplace_supervisor_name: "",
    start_date: "",
    end_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/Internship_Placement/", formData);
      alert("Placement submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Internship Placement Request</h1>
        <p style={styles.subtitle}>
          Submit your placement details for approval.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Company Name</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company_name: e.target.value,
                })
              }
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Supervisor Name</label>
            <input
              type="text"
              value={formData.workplace_supervisor_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  workplace_supervisor_name: e.target.value,
                })
              }
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Student Name</label>
            <input
              type="text"
              value={formData.student_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  student_name: e.target.value,
                })
              }
              style={styles.input}
            />
          </div>

          <div style={styles.dateRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    start_date: e.target.value,
                  })
                }
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    end_date: e.target.value,
                  })
                }
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Submit Placement Request
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fb",
    padding: "30px",
  },

  card: {
    width: "850px",
    maxWidth: "95%",
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  },

  title: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "30px",
    fontWeight: "700",
    color: "#1e3a5f",
  },

  subtitle: {
    marginBottom: "30px",
    color: "#666",
  },

  formGroup: {
    marginBottom: "20px",
    flex: 1,
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#444",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  dateRow: {
    display: "flex",
    gap: "20px",
  },

  button: {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    background: "#1e3a5f",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
};