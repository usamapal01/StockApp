import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/processed-data"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching the processed data:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      <h1>Processed Data</h1>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Item Id</th>
              <th>Item Name</th>
              <th>Color ID</th>
              <th>Size ID</th>
              <th>Barcode</th>
              <th>Retail Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item["Item Id"]}</td>
                <td>{item["Item Name"]}</td>
                <td>{item["Color ID"]}</td>
                <td>{item["Size ID"]}</td>
                <td>{item["Barcode"]}</td>
                <td>{item["Retail Rate"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
