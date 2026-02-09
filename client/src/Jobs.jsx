import { useEffect, useState } from "react";
import { API_BASE_URL } from "./api";
import "./Jobs.css"; 

export default function Jobs() {
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/imports`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch imports");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched import logs:", data);
        setImports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading import history...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", width: "100%" }}>
      {/* Centered header */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <h1>Job Import History</h1>
      </div>

      {imports.length === 0 ? (
        <p style={{ textAlign: "center" }}>No imports found</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <thead style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 10 }}>Source URL</th>
              <th style={{ border: "1px solid #ccc", padding: 10 }}>Total</th>
              <th style={{ border: "1px solid #ccc", padding: 10 }}>New</th>
              <th style={{ border: "1px solid #ccc", padding: 10 }}>Updated</th>
              <th style={{ border: "1px solid #ccc", padding: 10 }}>Failed</th>
              <th style={{ border: "1px solid #ccc", padding: 10 }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {imports.map((item, idx) => (
              <tr key={item._id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff", transition: "background-color 0.3s" }}>
                <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "left" }}>{item.source || "N/A"}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.totalImported || 0}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.newJobs || 0}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.updatedJobs || 0}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {item.failedJobs && item.failedJobs.length > 0 ? (
                    <details>
                      <summary>{item.failedJobs.length}</summary>
                      <ul style={{ textAlign: "left", margin: 0, paddingLeft: 15 }}>
                        {item.failedJobs.map((f, i) => (
                          <li key={i}>{f.jobId || "N/A"} - {f.reason || "Unknown reason"}</li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    0
                  )}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{item.timestamp ? new Date(item.timestamp).toLocaleString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
