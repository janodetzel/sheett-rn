import { SpreadsheetCellProps } from "@/src/components/spreadsheet/SpreadsheetCell";
import { createColumnHelper } from "@tanstack/react-table";
import { ComponentType } from "react";

type CellCoords = { r: number; c: number };

export const generateRowData = (rows: number) => {
  return Array.from({ length: rows }, (_, r) => ({
    r,
    c: 0, // Placeholder, actual column data is handled by generating columns
  }));
};

const columnHelper = createColumnHelper<CellCoords>();

/**
 * Convert a column index to a column label (A, B, C, ...)
 * @param index - The column index
 * @returns The column label
 */
const getColumnLabel = (index: number): string => {
  let n = index;
  let label = "";
  while (n >= 0) {
    label = String.fromCharCode((n % 26) + 65) + label;
    n = Math.floor(n / 26) - 1;
  }
  return label;
};

export const generateColumns = (
  cols: number,
  spreadsheetId: string,
  CellComponent: ComponentType<SpreadsheetCellProps>
) => {
  return Array.from({ length: cols }, (_, colIndex) =>
    columnHelper.accessor((row) => row, {
      id: `col-${colIndex}`,
      header: getColumnLabel(colIndex),
      cell: ({ row }) => (
        <CellComponent
          spreadsheetId={spreadsheetId}
          rowId={row.original.r}
          colId={colIndex}
        />
      ),
      size: 100,
    })
  );
};
