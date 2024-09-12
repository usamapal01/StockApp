import { useState } from "react";
import axios from "axios";
import "./DisplayItem.css";

const DisplayItem = () => {
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
        "https://stockcheck-c4wj.onrender.com/api/update-display-items",
        { skus }
      );

      // Handle response from backend
      setItems(response.data);
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  return (
    <div className="display">
      <h3 className="display-title">Scan Display Items</h3>
      <form onSubmit={handleSubmit} className="display-form">
        <textarea
          className="display-textarea"
          value={skuInput}
          onChange={handleChange}
          placeholder="Enter or scan display items, one per line"
        />
        <br />
        <button type="submit" className="display-button">
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

export default DisplayItem;
