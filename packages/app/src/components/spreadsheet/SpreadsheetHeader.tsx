import { Table } from "@tanstack/react-table";

type CellCoords = { r: number; c: number };

export type SpreadsheetHeaderProps = {
  table: Table<CellCoords>;
};

export function SpreadsheetHeader(props: SpreadsheetHeaderProps) {
  return null;
}
