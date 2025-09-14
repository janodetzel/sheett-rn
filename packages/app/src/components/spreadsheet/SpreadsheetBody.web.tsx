import { flexRender } from "@tanstack/react-table";
import { SpreadsheetBodyProps } from "./SpreadsheetBody";

export function SpreadsheetBody(props: SpreadsheetBodyProps) {
  return (
    <tbody>
      {props.table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
