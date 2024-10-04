import React, { useState, useEffect } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import "./SizeCheck.css";

export default function SizeCheck(props) {
  const [barcode, setBarcode] = useState(""); // State to hold barcode input
  const [sizeData, setSizeData] = useState(null); // State to hold the returned size data
  const [loading, setLoading] = useState(false); // State to show loading spinner
  const [error, setError] = useState(null); // State to handle errors
  const [scanning, setScanning] = useState(false); // State to toggle barcode scanner

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${props.apiUrl}/api/size-check`, {
        params: { barcode },
      });
      setSizeData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch size data. Please try again.");
      setLoading(false);
    }
  };

  const startScanning = () => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    const qrCodeSuccessCallback = (decodedText) => {
      setBarcode(decodedText); // Set the barcode when successfully scanned
      setScanning(false); // Stop scanning
      html5QrCode.stop(); // Stop the scanner
    };
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode
      .start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
      .catch((err) => {
        setError("Camera error. Please try again.");
      });
  };

  useEffect(() => {
    if (scanning) {
      startScanning();
    }
    return () => {
      if (scanning) {
        Html5Qrcode.getCameras()
          .then((cameras) => {
            if (cameras.length === 0) setError("No camera found");
          })
          .catch(() => setError("Error getting cameras."));
      }
    };
  }, [scanning]);

  return (
    <div className="body-size">
      <h3>Size Check</h3>
      <p>Scan the barcode or enter manually</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <button onClick={() => setScanning(!scanning)}>
        {scanning ? "Stop Scanning" : "Scan with Camera"}
      </button>

      {scanning && <div id="qr-reader" style={{ width: "300px" }}></div>}

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      {sizeData && (
        <div className="size-table">
          <p>Size Data for Barcode: {barcode}</p>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Qty</th>
                <th>Retail Rate</th>
              </tr>
            </thead>
            <tbody>
              {sizeData.map((data, index) => (
                <tr key={index}>
                  <td>{data["Size"]}</td>
                  <td>{data["Physical Qty"]}</td>
                  <td>{data["Retail Rate"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
