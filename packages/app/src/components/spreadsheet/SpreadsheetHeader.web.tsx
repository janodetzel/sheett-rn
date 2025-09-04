import { flexRender } from "@tanstack/react-table";
import { CSSProperties } from "react";
import {
  HeaderCellProps,
  HeaderRowProps,
  SpreadsheetHeaderProps,
} from "./SpreadsheetHeader";

export function SpreadsheetHeader(props: SpreadsheetHeaderProps) {
  return (
    <thead style={tableHeadStyles}>
      {props.table.getHeaderGroups().map((headerGroup) => (
        <HeaderRow
          columnVirtualizer={props.columnVirtualizer}
          headerGroup={headerGroup}
          key={headerGroup.id}
          virtualPaddingLeft={props.virtualPaddingLeft}
          virtualPaddingRight={props.virtualPaddingRight}
        />
      ))}
    </thead>
  );
}

const tableHeadStyles: CSSProperties = {
  display: "grid",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

function HeaderRow(props: HeaderRowProps) {
  const virtualColumns = props.columnVirtualizer.getVirtualItems();
  return (
    <tr
      key={props.headerGroup.id}
      style={{ display: "flex", width: "100%", backgroundColor: "darkgray" }}
    >
      {props.virtualPaddingLeft ? (
        <th style={{ display: "flex", width: props.virtualPaddingLeft }} />
      ) : null}
      {virtualColumns.map((virtualColumn) => {
        const header = props.headerGroup.headers[virtualColumn.index];
        return <HeaderCell key={header.id} header={header} />;
      })}
      {props.virtualPaddingRight ? (
        <th style={{ display: "flex", width: props.virtualPaddingRight }} />
      ) : null}
    </tr>
  );
}

function HeaderCell(props: HeaderCellProps) {
  return (
    <th
      key={props.header.id}
      style={{
        display: "flex",
        width: props.header.getSize(),
      }}
    >
      <div
        {...{
          className: props.header.column.getCanSort()
            ? "cursor-pointer select-none"
            : "",
          onClick: props.header.column.getToggleSortingHandler(),
        }}
        style={{
          color: "white",
        }}
      >
        {flexRender(
          props.header.column.columnDef.header,
          props.header.getContext()
        )}
        {{
          asc: " 🔼",
          desc: " 🔽",
        }[props.header.column.getIsSorted() as string] ?? null}
      </div>
    </th>
  );
}
