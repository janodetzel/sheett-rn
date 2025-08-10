import * as React from "react";

import { ExpoSpreadsheetViewProps } from "./ExpoSpreadsheet.types";

export default function ExpoSpreadsheetView(props: ExpoSpreadsheetViewProps) {
  const {
    rows,
    columns,
    cellWidth,
    cellHeight,
    value,
    onCellEdited,
    showHeaders,
  } = props;

  const initialMap = React.useMemo(() => {
    const m = new Map<string, string>();
    for (const cell of value ?? []) {
      const id = `${cell.rowId}-${cell.columnId}`;
      m.set(id, cell.value);
    }
    return m;
  }, [value]);

  const colLabel = (index: number) => {
    let result = "";
    let num = index;
    while (num >= 0) {
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26) - 1;
      if (num < 0) break;
    }
    return result;
  };

  const totalRows = rows + (showHeaders ? 1 : 0);
  const totalCols = columns + (showHeaders ? 1 : 0);

  return (
    <div
      style={{
        overflow: "auto",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: totalCols * cellWidth,
          height: totalRows * cellHeight,
        }}
      >
        {Array.from({ length: totalRows }).map((_, r) =>
          Array.from({ length: totalCols }).map((__, c) => {
            const isHeaderRow = !!showHeaders && r === 0;
            const isHeaderCol = !!showHeaders && c === 0;
            if (isHeaderRow || isHeaderCol) {
              const text =
                isHeaderRow && isHeaderCol
                  ? ""
                  : isHeaderRow
                  ? colLabel(c - 1)
                  : String(r);
              return (
                <div
                  key={`h-${r}-${c}`}
                  style={{
                    position: "absolute",
                    left: c * cellWidth,
                    top: r * cellHeight,
                    width: cellWidth - 2,
                    height: cellHeight - 2,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    color: "#555",
                    border: "1px solid rgba(0,0,0,0.2)",
                    background: "#f7f7f7",
                  }}
                >
                  {text}
                </div>
              );
            }

            const dataRow = showHeaders ? r - 1 : r;
            const dataCol = showHeaders ? c - 1 : c;
            const cellId = `${dataRow}-${dataCol}`;
            const defaultValue = initialMap.get(cellId) ?? "";
            return (
              <input
                key={cellId}
                defaultValue={defaultValue}
                style={{
                  position: "absolute",
                  left: c * cellWidth,
                  top: r * cellHeight,
                  width: cellWidth - 2,
                  height: cellHeight - 2,
                  boxSizing: "border-box",
                }}
                onBlur={(e) =>
                  onCellEdited?.({
                    nativeEvent: { cellId, value: e.currentTarget.value },
                  })
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
