import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Pages/HomePage/Home";
import Footer from "./components/Footer/Footer";
import Navigationbar from "./components/Navbar/Navigationbar";
import StorePage from "./components/Pages/StorePage";

function App() {
  const apiUrl = import.meta.env.VITE_API_URL; // For Vite
  // const apiUrl = "https://stockcheck-c4wj.onrender.com";

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
    <Router>
      <Navigationbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Dynamic route for store pages */}
        <Route path="/store/:storeId" element={<StorePage apiUrl={apiUrl} />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
