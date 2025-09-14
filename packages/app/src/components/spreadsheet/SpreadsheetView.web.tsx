import { Table } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { SpreadsheetBody } from "./SpreadsheetBody";
import { SpreadsheetHeader } from "./SpreadsheetHeader";

type CellCoords = { r: number; c: number };

type SpreadsheetViewProps = {
  table: Table<CellCoords>;
};

export function SpreadsheetView(props: SpreadsheetViewProps) {
  return (
    <div style={containerStyles}>
      <table style={tableStyles}>
        <SpreadsheetHeader table={props.table} />
        <SpreadsheetBody table={props.table} />
      </table>
    </div>
  );
}

const containerStyles: CSSProperties = {
  overflow: "auto",
  position: "relative",
  height: "100vh",
  width: "100%",
};

const tableStyles: CSSProperties = {
  borderCollapse: "collapse",
  width: "100%",
};
