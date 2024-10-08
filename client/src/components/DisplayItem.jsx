import { useState } from "react";
import axios from "axios";
import "./DisplayItem.css";

const DisplayItem = (props) => {
  const [skuInput, setSkuInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState(""); // State for success message

  const handleChange = (e) => {
    setSkuInput(e.target.value);
    setUploadStatus(""); // Reset status when input changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skus = skuInput
        .split("\n")
        .map((sku) => sku.trim())
        .filter((sku) => sku.length > 0); // Remove empty SKUs if any

      const response = await axios.post(
        `${props.apiUrl}/api/update-display-items?store=${props.storeName}`,
        {
          skus,
        }
      );

      setUploadStatus("Upload Successful!"); // Show success message
    } catch (error) {
      console.error("Error sending data to server:", error);
      setUploadStatus("Error uploading items. Please try again."); // Show error message
    }
  };

  return (
    <div className="display">
      <h3>Scan Display Items</h3>
      <p>Scan all the display items in the text area below</p>
      <form onSubmit={handleSubmit} className="display-form">
        <textarea
          className="display-textarea"
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
    </div>
  );
};

export default DisplayItem;
