import { Table } from "@tanstack/react-table";

type CellCoords = { r: number; c: number };

type SpreadsheetViewProps = {
  table: Table<CellCoords>;
};

export function SpreadsheetView(props: SpreadsheetViewProps) {
  return null;
}
