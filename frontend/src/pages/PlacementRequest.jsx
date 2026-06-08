import { useState } from "react";
import api from "../axiosConfig";

export default function PlacementRequest() {
  const [formData, setFormData] = useState({
    company_name: "",
    workplace_supervisor_name: "",
    start_date: "",
    end_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/api/Internship_Placement/",
        formData
      );

      alert("Placement submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Company Name"
        value={formData.company_name}
        onChange={(e) =>
          setFormData({
            ...formData,
            company_name: e.target.value
          })
        }
      />

      <input
        placeholder="Supervisor Name"
        value={formData.workplace_supervisor_name}
        onChange={(e) =>
          setFormData({
            ...formData,
            workplace_supervisor_name: e.target.value
          })
        }
      />

      <input
        type="date"
        value={formData.start_date}
        onChange={(e) =>
          setFormData({
            ...formData,
            start_date: e.target.value
          })
        }
      />

      <input
        type="date"
        value={formData.end_date}
        onChange={(e) =>
          setFormData({
            ...formData,
            end_date: e.target.value
          })
        }
      />

      <button type="submit">
        Submit Placement Request
      </button>
    </form>
  );
}