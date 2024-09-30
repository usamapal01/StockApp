import React from "react";
import DisplayItem from "../DisplayItem";
import FileUpload from "../FileUpload";
import StockRoomItem from "../StockRoomItem";
import ProcessedData from "../ProcessedData";

import "./LosAngeles.css";
import AuditDisplayStock from "../AuditDisplayStock";

function LosAngeles({ apiUrl }) {
  return (
    <div className="block">
      <FileUpload apiUrl={apiUrl} />
      <DisplayItem apiUrl={apiUrl} />
      <AuditDisplayStock apiUrl={apiUrl} />
      <StockRoomItem apiUrl={apiUrl} />
      <ProcessedData apiUrl={apiUrl} />
    </div>
  );
}

export default LosAngeles;
