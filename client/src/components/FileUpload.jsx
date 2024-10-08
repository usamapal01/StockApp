import { useState } from "react";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner"; // Import the spinner
import "./FileUpload.css";

function FileUpload(props) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); // New state for upload status
  console.log("File Upload:", props.storeName, "and", props.apiUrl);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(""); // Reset status when a new file is selected
  };

  const handleFileUpload = async () => {
    setLoading(true);
    setUploadStatus(""); // Reset status before new upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${props.apiUrl}/api/upload/${props.storeName}`, // Ensure the storeName is passed after /api/upload
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      setUploadStatus("File Uploaded Successfully!!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body-file">
      <h3>Upload "xlsx" file</h3>
      <p>
        Upload the "Stock on hand" file which could be retrieved from UIGMTS
        portal
      </p>
      <p className="text-upload">
        For better results upload the most recent file
      </p>
      <input type="file" onChange={handleFileChange} />

      {/* Button that displays the spinner when loading */}
      <button
        className="button-41"
        onClick={handleFileUpload}
        disabled={loading || !file} // Disable button when no file is selected
      >
        {loading ? (
          <div className="spinner-container">
            <BallTriangle
              height={30}
              width={30}
              radius={5}
              color="#000000"
              ariaLabel="ball-triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
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
