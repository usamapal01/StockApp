import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserMultiFormatReader } from "@zxing/library";
import { FaCamera } from "react-icons/fa"; // Import the camera icon
import "./SizeCheck.css";

export default function SizeCheck(props) {
  const [barcode, setBarcode] = useState(""); // State to hold barcode input
  const [sizeData, setSizeData] = useState(null); // State to hold the returned size data
  const [loading, setLoading] = useState(false); // State to show loading spinner
  const [error, setError] = useState(null); // State to handle errors
  const [scanning, setScanning] = useState(false); // State to toggle barcode scanner
  const videoRef = useRef(null); // Reference to video element
  const codeReaderRef = useRef(null); // Reference to store the ZXing codeReader instance

  // Handle submit event
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent the default form submission behavior if called manually
    setLoading(true);
    setError(null);

    console.log("Size Check:", props.storeName);

    try {
      const response = await axios.get(
        `${props.apiUrl}/api/size-check?store=${props.storeName}`,
        {
          params: { barcode },
        }
      );
      setSizeData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch size data. Please try again.");
      setLoading(false);
    }
  };

  // Clear barcode, size data, and UI elements
  const clearAll = () => {
    setBarcode(""); // Clear barcode input
    setSizeData(null); // Clear the size data table
    setError(null); // Clear any error messages
  };

  // Start scanning using ZXing
  const startScanning = () => {
    setScanning(true);
    clearAll(); // Clear previous size data and inputs when scanning starts

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader; // Store the codeReader instance to reference later

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        // Select the back camera, usually containing "back" or "rear" in the label
        const backCamera = videoInputDevices.find((device) =>
          device.label.toLowerCase().includes("back")
        );

        const selectedDeviceId = backCamera
          ? backCamera.deviceId
          : videoInputDevices[0].deviceId; // Default to first device if back camera is not found

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              setBarcode(result.getText()); // Set the barcode when successfully scanned
              setScanning(false);
              stopScanning(); // Stop the scanner after successful scan

              // Delay the submission to ensure the state is updated
              setTimeout(() => {
                handleSubmit(); // Automatically trigger the submit after scanning
              }, 100); // Adjust the delay as needed (100ms is usually sufficient)
            }
            if (err) {
              console.warn(err); // Log errors if necessary
            }
          }
        );
      })
      .catch((err) => {
        setError("Camera error. Please try again.");
      });
  };

  // Stop scanning and reset the camera
  const stopScanning = () => {
    setScanning(false);
    if (codeReaderRef.current) {
      codeReaderRef.current.reset(); // Reset the codeReader to stop the camera
    }
  };

  // Cleanup the scanner when component unmounts
  useEffect(() => {
    return () => {
      stopScanning(); // Ensure camera stops on unmount
    };
  }, []);

  return (
    <div className="body-size">
      <h3>Size Check</h3>
      <p>Scan the barcode or enter manually</p>

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            className="text-area"
            type="text"
            placeholder="Enter Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            required
          />
          {barcode && (
            <button type="button" className="clear-btn" onClick={clearAll}>
              Clear
            </button>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>

      <button
        onClick={scanning ? stopScanning : startScanning}
        className="scan-button"
      >
        <FaCamera /> {/* Use the camera icon */}
      </button>

      {scanning && (
        <div id="scanner-container">
          <video ref={videoRef} style={{ width: "300px", height: "250px" }} />
        </div>
      )}

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
