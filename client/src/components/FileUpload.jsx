import { useState } from "react";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner"; // Import the spinner

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
    <div>
      <input type="file" onChange={handleFileChange} />

      {/* Button that displays the spinner when loading */}
      <button onClick={handleFileUpload} disabled={loading}>
        {loading ? (
          <BallTriangle
            height={30}
            width={30}
            radius={5}
            color="#14d9cf"
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
