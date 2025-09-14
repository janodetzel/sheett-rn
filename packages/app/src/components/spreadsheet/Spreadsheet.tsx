import { generateColumns, generateRowData } from "@/src/utils/spreadsheet";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { SpreadsheetCell } from "./SpreadsheetCell";
import { SpreadsheetView } from "./SpreadsheetView";

type SpreadsheetProps = {
  rows: number;
  cols: number;
  spreadsheetId: string;
};

export function Spreadsheet(props: SpreadsheetProps) {
  const table = useReactTable({
    data: generateRowData(props.rows),
    columns: generateColumns(props.cols, props.spreadsheetId, SpreadsheetCell),
    getCoreRowModel: getCoreRowModel(),
  });

  return <SpreadsheetView table={table} />;
}
