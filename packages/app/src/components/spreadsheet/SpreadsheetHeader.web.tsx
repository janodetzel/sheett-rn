import { CSSProperties } from "react";
import { flexRender } from "@tanstack/react-table";
import { SpreadsheetHeaderProps } from "./SpreadsheetHeader";

export function SpreadsheetHeader(props: SpreadsheetHeaderProps) {
  return (
    <thead>
      {props.table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} style={headerCellStyles}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

const headerCellStyles: CSSProperties = {
  backgroundColor: "#f9fafb",
  border: "1px solid #d1d5db",
  padding: "8px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "12px",
  minWidth: "100px",
};
