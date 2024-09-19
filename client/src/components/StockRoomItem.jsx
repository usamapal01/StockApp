import { useState } from "react";
import axios from "axios";
import "./StockRoomItem.css";

const StockRoomItem = (props) => {
  const [skuInput, setSkuInput] = useState("");
  const [items, setItems] = useState([]);

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
      setItems(response.data);
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  return (
    <div className="stock">
      <h3 className="stock-title">Scan Stockroom Items</h3>
      <form onSubmit={handleSubmit} className="stock-form">
        <textarea
          className="stock-textarea"
          value={skuInput}
          onChange={handleChange}
          placeholder="Enter or scan stock items, one per line"
        />
        <br />
        <button type="submit" className="stock-button">
          Upload
        </button>
      </form>
      <div>
        {/* Display the fetched items or other relevant information */}
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </div>
    </div>
  );
};

export default StockRoomItem;
