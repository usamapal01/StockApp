import { useState } from "react";
import axios from "axios";
import "./StockRoomItem.css";

const StockRoomItem = (props) => {
  const [skuInput, setSkuInput] = useState("");
  // const [items, setItems] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(""); // State for success message

  const handleChange = (e) => {
    setSkuInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Split the input by newlines and trim whitespace
      const skus = skuInput
        .split("\n")
        .map((sku) => sku.trim())
        .filter((sku) => sku.length > 0); // Remove empty SKUs if any

      // Send SKU data to server
      const response = await axios.post(
        `${props.apiUrl}/api/update-stock-items`,
        { skus }
      );

      // Handle response from backend
      // setItems(response.data);
      setUploadStatus("Upload Successful!"); // Show success message
    } catch (error) {
      console.error("Error sending data to server:", error);
      setUploadStatus("Error uploading items. Please try again."); // Show error message
    }
  };

  return (
    <div className="stock-body">
      <h3>Scan Stockroom Items</h3>
      <p>Scan Stock Room items in the text area below</p>
      <form onSubmit={handleSubmit} className="stock-form">
        <textarea
          className="stock-textarea"
          value={skuInput}
          onChange={handleChange}
          placeholder="Enter Barcode one per line"
        />
        <div className="button-container">
          <button type="submit" className="display-button">
            Upload
          </button>
          {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </div>
      </form>
      {/* Display the fetched items or other relevant information */}
      {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
    </div>
  );
};

export default StockRoomItem;
