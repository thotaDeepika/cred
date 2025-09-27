import React, { useState } from "react";

function App() {
  const [form, setForm] = useState({
    location: "",
    description: "",
    hazard_type: "",
    datetime: "",
    has_photo: false,
    nearby_reports: 0,
    user_trust: "low",
    inc_data_confirmed: false,
    ai_media_verification: false,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/calculate_score/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Helper function for status color
  const getStatusColor = (status) => {
    if (status === "High") return "green";
    if (status === "Moderate") return "orange";
    return "red";
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#0055aa" }}>
        🌊 Hazard Confidence Engine Prototype
      </h1>

      {/* Input Form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          name="hazard_type"
          placeholder="Hazard Type (Flood, Cyclone, etc.)"
          value={form.hazard_type}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="datetime-local"
          name="datetime"
          value={form.datetime}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <label>
          <input
            type="checkbox"
            name="has_photo"
            checked={form.has_photo}
            onChange={handleChange}
          />
          {" "}Has Photo
        </label>
        <br />

        <label>
          Nearby Reports:{" "}
          <input
            type="number"
            name="nearby_reports"
            value={form.nearby_reports}
            onChange={handleChange}
            style={{ width: "100px", marginLeft: "10px" }}
          />
        </label>
        <br />

        <label>
          User Trust:{" "}
          <select
            name="user_trust"
            value={form.user_trust}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            name="inc_data_confirmed"
            checked={form.inc_data_confirmed}
            onChange={handleChange}
          />
          {" "}INCOIS Data Confirmed
        </label>
        <br />

        <label>
          <input
            type="checkbox"
            name="ai_media_verification"
            checked={form.ai_media_verification}
            onChange={handleChange}
          />
          {" "}AI Media Verification
        </label>
        <br />

        <button
          onClick={handleSubmit}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            backgroundColor: "#0077cc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Calculate Confidence
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            background: "#f9f9f9",
          }}
        >
          <h2>Result</h2>

          {/* Score Bar */}
          <div style={{ marginBottom: "10px" }}>
            <b>Score:</b> {result.confidence_score}% 
            <div
              style={{
                height: "15px",
                background: "#ddd",
                borderRadius: "10px",
                marginTop: "5px",
              }}
            >
              <div
                style={{
                  width: `${result.confidence_score}%`,
                  height: "100%",
                  background: getStatusColor(result.status),
                  borderRadius: "10px",
                }}
              ></div>
            </div>
          </div>

          {/* Status with color */}
          <p>
            <b>Status:</b>{" "}
            <span style={{ color: getStatusColor(result.status), fontWeight: "bold" }}>
              {result.status}
            </span>
          </p>

          {/* Extra details */}
          <p><b>Hazard Type:</b> {form.hazard_type || "N/A"}</p>
          <p><b>Reported At:</b> {form.datetime || "N/A"}</p>
          <p><b>Location:</b> {form.location}</p>
          <p><b>Description:</b> {form.description}</p>

          {/* Calculation Steps */}
          <h3 style={{ marginTop: "15px" }}>Calculation Steps</h3>
          <ul>
            {result.calculation_steps.map((step, idx) => (
              <li key={idx}>{step[0]} → +{step[1]}%</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
