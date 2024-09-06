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
        {data.map((item, index) => (
          <div key={index}>
            <span>{item["Item Id"]}</span> - <span>{item["Item Name"]}</span>
            <span>{item["Color ID"]}</span> - <span>{item["Size ID"]}</span>
            <span>{item["Barcode"]}</span> - <span>{item["Retail Rate"]}</span>
            <br />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
