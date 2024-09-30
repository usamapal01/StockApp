import React, { useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { FiPieChart } from "react-icons/fi"; // Import an icon for the button
import "./AuditDisplayStock.css";

export default function AuditDisplayStock(props) {
  const [sizeIdCount, setSizeIdCount] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(false); // Toggle for showing the chart

  // Fetch size ID counts from backend
  const fetchSizeIdCount = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${props.apiUrl}/api/size-id-count`);
      const data = response.data;

      // Transform the response into an array with label, count, and percentage
      const total = Object.values(data).reduce((acc, count) => acc + count, 0);
      // console.log(total);

      const transformedData = Object.entries(data).map(([sizeId, count]) => ({
        name: sizeId,
        value: count,
        percentage: ((count / total) * 100).toFixed(0), // Calculate percentage
      }));

      // console.log(transformedData);

      setSizeIdCount(transformedData);
    } catch (error) {
      setError("Error fetching the Size ID count.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChart = () => {
    setShowChart(!showChart); // Toggle the display of the chart
    if (!showChart) {
      fetchSizeIdCount(); // Fetch data when chart is first displayed
    }
  };

  const COLORS = [
    "#8884d8", // Purple
    "#8dd1e1", // Light Blue
    "#82ca9d", // Green
    "#ffc658", // Yellow
    "#ff8042", // Orange
    "#d0ed57", // Light Yellow-Green
  ];

  return (
    <div className="body-audit">
      <h3>Display Stock Sizes</h3>
      {/* <p>Click the icon below</p> */}
      {/* Small button or icon to toggle chart */}
      <button className="icon-button" onClick={handleToggleChart}>
        <FiPieChart size={20} /> {/* Using an icon to save space */}
      </button>

      {loading && <p>Fetching...</p>}
      {error && <p>{error}</p>}

      {/* Conditionally render Pie Chart */}
      {showChart && sizeIdCount.length > 0 && (
        <div className="chart-container">
          <PieChart width={400} height={200}>
            <Pie
              data={sizeIdCount}
              dataKey="value"
              nameKey="name"
              // labelLine={false}
              cx="50%" // Center horizontally
              cy="34%" // Center vertically
              outerRadius={50}
              fill="#8884d8"
              label={({ name, value, percentage }) =>
                `${name}: ${value} (${percentage}%)`
              }
            >
              {sizeIdCount.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            {/* <Tooltip /> */}
            {/* <Legend /> */}
          </PieChart>
        </div>
      )}
    </div>
  );
}
