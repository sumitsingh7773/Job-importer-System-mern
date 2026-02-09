import { useEffect, useState } from "react";
import { API_BASE_URL } from "./api";

export default function ImportLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/import_logs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch import logs");
        return res.json();
      })
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading import history...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Job Import History</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ backgroundColor: "#4CAF50", color: "#fff" }}>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>Source URL</th>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>Total</th>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>New</th>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>Updated</th>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>Failed</th>
            <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "center" }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr
              key={log._id}
              style={{
                backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                transition: "background-color 0.3s",
              }}
            >
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                {log.fileName || log.source || "N/A"}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                {log.totalFetched || 0}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                {log.newJobs || 0}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                {log.updatedJobs || 0}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                {log.failedJobs && log.failedJobs.length > 0 ? (
                  <details>
                    <summary>{log.failedJobs.length}</summary>
                    <ul style={{ textAlign: "left", margin: 0, paddingLeft: "15px" }}>
                      {log.failedJobs.map((f, i) => (
                        <li key={i}>{f.jobId || "N/A"} - {f.reason || "Unknown"}</li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  0
                )}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
