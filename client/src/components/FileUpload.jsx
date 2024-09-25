import { useState } from "react";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner"; // Import the spinner
import "./FileUpload.css";

function FileUpload(props) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); // New state for upload status

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(""); // Reset status when a new file is selected
  };

  const handleFileUpload = async () => {
    setLoading(true); // Set loading state
    setUploadStatus(""); // Reset status before new upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${props.apiUrl}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data); // Handle response from server
      setUploadStatus("File Uploaded Successfully!!"); // Set success message
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file"); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="file-body">
      <h2>Upload "Stock on hand" file below</h2>
      <br />
      <p className="text-upload">
        For better results upload the most recent file.
      </p>
      <input type="file" onChange={handleFileChange} />

      {/* Button that displays the spinner when loading */}
      <button
        className="button-41"
        onClick={handleFileUpload}
        disabled={loading || !file} // Disable button when no file selected
      >
        {loading ? (
          <BallTriangle
            height={30}
            width={80}
            radius={5}
            color="#000000"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        ) : (
          "Upload"
        )}
      </button>

      {/* Conditionally render the upload status */}
      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
    </div>
  );
}

export default FileUpload;
