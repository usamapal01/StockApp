import { useParams } from "react-router-dom";
import DisplayItem from "../DisplayItem";
import FileUpload from "../FileUpload";
import StockRoomItem from "../StockRoomItem";
import ProcessedData from "../ProcessedData";
import AuditDisplayStock from "../AuditDisplayStock";
import SizeCheck from "../SizeCheck";

import "./StorePage.css";

function StorePage({ apiUrl }) {
  const { storeId: storeName } = useParams(); // Renaming storeId to storeName

  console.log("API URL:", apiUrl);
  console.log("Store Name:", storeName);

  return (
    <div className="block">
      {/* <p>{storeName}</p> */}
      <FileUpload apiUrl={apiUrl} storeName={storeName} />
      <SizeCheck apiUrl={apiUrl} storeName={storeName} />
      <DisplayItem apiUrl={apiUrl} storeName={storeName} />
      <AuditDisplayStock apiUrl={apiUrl} storeName={storeName} />
      <StockRoomItem apiUrl={apiUrl} storeName={storeName} />
      <ProcessedData apiUrl={apiUrl} storeName={storeName} />
    </div>
  );
}

export default StorePage;
