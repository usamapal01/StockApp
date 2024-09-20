import { useState } from "react";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner"; // Import the spinner

import "./FileUpload.css";

function FileUpload(props) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    setLoading(true); // Set loading state
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
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="file-body">
      <input type="file" onChange={handleFileChange} />

      {/* Button that displays the spinner when loading */}
      <button
        className="button-41"
        onClick={handleFileUpload}
        disabled={loading}
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
    </div>
  );
}

export default FileUpload;
