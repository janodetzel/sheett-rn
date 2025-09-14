import { flexRender } from "@tanstack/react-table";
import { SpreadsheetHeaderProps } from "./SpreadsheetHeader";

export function SpreadsheetHeader(props: SpreadsheetHeaderProps) {
  return (
    <thead>
      {props.table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id}>
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
