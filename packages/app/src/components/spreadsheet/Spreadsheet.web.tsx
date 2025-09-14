import { SpreadsheetCell } from "@/src/utils/store/spreadsheet";
import { Table } from "@tanstack/react-table";
import { CSSProperties } from "react";
import { SpreadsheetHeader } from "./SpreadsheetHeader";
import { SpreadsheetBody } from "./SpreadsheetBody";

type SpreadsheetProps = {
  table: Table<SpreadsheetCell>;
};

export function Spreadsheet(props: SpreadsheetProps) {
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
};

const tableStyles: CSSProperties = {
  display: "grid",
  flex: 1,
};
