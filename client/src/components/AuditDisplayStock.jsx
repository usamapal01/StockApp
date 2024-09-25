import React, { useState } from "react";
import axios from "axios";

import "./AuditDisplayStock.css";

export default function AuditDisplayStock(props) {
  const [sizeIdCount, setSizeIdCount] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSizeIdCount = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await axios.get(`${props.apiUrl}/api/size-id-count`); // Replace with your backend URL
      setSizeIdCount(response.data);
    } catch (error) {
      setError("Error fetching the Size ID count.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="display-sizes">
      <h2>Check Display Stock Sizes</h2>
      <button onClick={fetchSizeIdCount} disabled={loading}>
        {loading ? "Fetching..." : "Display Sizes"}
      </button>

      {error && <p>{error}</p>}

      {/* Display the Size ID counts */}
      {Object.keys(sizeIdCount).length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Size</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(sizeIdCount).map(([sizeId, count], index) => (
              <tr key={index}>
                <td>{sizeId}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
