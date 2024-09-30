import { useState } from "react";
import axios from "axios";
import { MagnifyingGlass } from "react-loader-spinner";

import "./ProcessedData.css";

const ProcessedData = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data related to processed items
  const fetchAPI = async () => {
    setLoading(true); // Set loading state
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(`${props.apiUrl}/api/processed-data`);
      setArticles(response.data);
    } catch (error) {
      setError("Error fetching the processed data");
      console.error("Error fetching the processed data:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="body-processed">
      <h3>Processed Data</h3>
      <button onClick={fetchAPI} disabled={loading}>
        {loading ? (
          <MagnifyingGlass
            visible={true}
            height="50"
            width="50"
            ariaLabel="magnifying-glass-loading"
            wrapperStyle={{}}
            wrapperClass="magnifying-glass-wrapper"
            glassColor="#c0efff"
            color="#e15b64"
          />
        ) : (
          "Get Data"
        )}
      </button>
      {error && <p>{error}</p>}
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
          {articles.map((item, index) => (
            <tr key={index}>
              <td>{item["Item Id"]}</td>
              <td>{item["Item Name"]}</td>
              <td>{item["Color ID"]}</td>
              <td>{item["Size ID"]}</td>
              <td>{item["Barcode"]}</td>
              <td>${item["Retail Rate"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessedData;
