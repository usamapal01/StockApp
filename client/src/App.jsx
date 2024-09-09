import { useEffect } from "react";
import "./App.css";
import ProcessedData from "./components/ProcessedData";
import DisplayItem from "./components/DisplayItem";
import StockRoomItem from "./components/StockRoomItem";

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
      <DisplayItem />
      <StockRoomItem />
      <ProcessedData />
    </>
  );
}

export default App;
