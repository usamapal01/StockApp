import { useEffect } from "react";
import "./App.css";
import ProcessedData from "./components/ProcessedData";
import DisplayItem from "./components/DisplayItem";
import StockRoomItem from "./components/StockRoomItem";
import FileUpload from "./components/FileUpload";

function App() {
  // Confirmation prompt before page reload or close
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Triggers the confirmation dialog
    };

    // Add the event listener on component mount
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <FileUpload />
      <DisplayItem />
      <StockRoomItem />
      <ProcessedData />
    </>
  );
}

export default App;
