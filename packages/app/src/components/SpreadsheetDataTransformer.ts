import { Store } from "tinybase/with-schemas";
import { SpreadsheetTables } from "@/src/utils/store/spreadsheet";

export interface XSpreadsheetData {
  name: string;
  rows: {
    [rowIndex: string]: {
      cells: {
        [colIndex: string]: {
          text: string;
          style?: {
            bgcolor?: string;
            color?: string;
            align?: "left" | "center" | "right";
            valign?: "top" | "middle" | "bottom";
            font?: {
              size?: number;
              bold?: boolean;
              italic?: boolean;
            };
          };
        };
      };
    };
  };
}

export interface CellData {
  rowId: string;
  columnId: string;
  value: string;
  lockedBy?: string;
  lockedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

/**
 * Transforms TinyBase store data to x-spreadsheet format
 */
export const transformStoreToXSpreadsheet = (
  store: Store<SpreadsheetTables, any>,
  spreadsheetId: string
): XSpreadsheetData => {
  const xsData: XSpreadsheetData = {
    name: "Sheet1",
    rows: {},
  };

  // Get all cells from the store
  const cellsTable = store.getTable("cells");

  Object.entries(cellsTable).forEach(([cellId, cellData]) => {
    const cell = cellData as CellData;
    const rowIndex = cell.rowId;
    const colIndex = cell.columnId;

    // Convert row and column IDs to numeric indices if they're not already
    const rowIdx = isNaN(Number(rowIndex))
      ? parseRowId(rowIndex)
      : Number(rowIndex);
    const colIdx = isNaN(Number(colIndex))
      ? parseColumnId(colIndex)
      : Number(colIndex);

    // Initialize row if it doesn't exist
    if (!xsData.rows[rowIdx]) {
      xsData.rows[rowIdx] = { cells: {} };
    }

    // Add cell data
    xsData.rows[rowIdx].cells[colIdx] = {
      text: cell.value || "",
      style: {
        // Add basic styling - you can enhance this based on your needs
        align: "left",
        valign: "middle",
        ...(cell.lockedBy && {
          bgcolor: "#ffebee", // Light red background for locked cells
          color: "#c62828",
        }),
      },
    };
  });

  return xsData;
};

/**
 * Transforms x-spreadsheet data back to TinyBase store format
 */
export const transformXSpreadsheetToStore = (
  xsData: XSpreadsheetData,
  currentUserId: string
): Record<string, CellData> => {
  const storeData: Record<string, CellData> = {};

  Object.entries(xsData.rows).forEach(([rowIndex, row]) => {
    Object.entries(row.cells).forEach(([colIndex, cell]) => {
      const cellId = `${rowIndex}_${colIndex}`;
      const now = new Date().toISOString();

      storeData[cellId] = {
        rowId: rowIndex,
        columnId: colIndex,
        value: cell.text,
        createdBy: currentUserId,
        createdAt: now,
        updatedAt: now,
      };
    });
  });

  return storeData;
};

/**
 * Helper to parse row ID (e.g., "row_5" -> 5, "5" -> 5)
 */
const parseRowId = (rowId: string): number => {
  if (typeof rowId === "string" && rowId.startsWith("row_")) {
    return parseInt(rowId.replace("row_", ""), 10);
  }
  const parsed = parseInt(rowId, 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Helper to parse column ID (e.g., "col_A" -> 0, "A" -> 0, "B" -> 1)
 */
const parseColumnId = (columnId: string): number => {
  if (typeof columnId === "string") {
    // Handle "col_A" format
    if (columnId.startsWith("col_")) {
      const letter = columnId.replace("col_", "");
      return columnLetterToNumber(letter);
    }

    // Handle direct letter format "A", "B", etc.
    if (/^[A-Z]+$/.test(columnId)) {
      return columnLetterToNumber(columnId);
    }
  }

  const parsed = parseInt(columnId, 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Convert column letter(s) to number (A=0, B=1, ..., AA=26, etc.)
 */
const columnLetterToNumber = (letters: string): number => {
  let result = 0;
  for (let i = 0; i < letters.length; i++) {
    result = result * 26 + (letters.charCodeAt(i) - 64);
  }
  return result - 1; // Convert to 0-based index
};

/**
 * Convert number to column letter(s) (0=A, 1=B, ..., 26=AA, etc.)
 */
export const numberToColumnLetter = (num: number): string => {
  let result = "";
  let n = num + 1; // Convert to 1-based

  while (n > 0) {
    n--;
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26);
  }

  return result;
};

/**
 * Create cell ID from row and column indices
 */
export const createCellId = (rowIndex: number, colIndex: number): string => {
  return `${rowIndex}_${colIndex}`;
};

/**
 * Parse cell ID to get row and column indices
 */
export const parseCellId = (
  cellId: string
): { rowIndex: number; colIndex: number } => {
  const [rowStr, colStr] = cellId.split("_");
  return {
    rowIndex: parseInt(rowStr, 10),
    colIndex: parseInt(colStr, 10),
  };
};
