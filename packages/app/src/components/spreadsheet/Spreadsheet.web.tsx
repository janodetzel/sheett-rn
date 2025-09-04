import { SpreadsheetCell } from "@/src/utils/store/spreadsheet";
import { Table } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CSSProperties, useRef } from "react";
import { SpreadsheetHeader } from "./SpreadsheetHeader";

type SpreadsheetProps = {
  table: Table<SpreadsheetCell>;
};

export function Spreadsheet(props: SpreadsheetProps) {
  const visibleColumns = props.table.getVisibleLeafColumns();

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columnVirtualizer = useVirtualizer<
    HTMLDivElement,
    HTMLTableCellElement
  >({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3,
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();

  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return (
    <div ref={tableContainerRef} style={containerStyles}>
      <table style={tableStyles}>
        <SpreadsheetHeader
          table={props.table}
          columnVirtualizer={columnVirtualizer}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
        />
        <SpreadsheetBody
          tableContainerRef={
            tableContainerRef as React.RefObject<HTMLDivElement>
          }
          table={props.table}
          columnVirtualizer={columnVirtualizer}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
        />
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
