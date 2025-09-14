import { SpreadsheetCell } from "@/src/utils/store/spreadsheet";
import { Header, HeaderGroup, Table } from "@tanstack/react-table";
import { Virtualizer } from "@tanstack/react-virtual";

export type SpreadsheetHeaderProps = {
  table: Table<SpreadsheetCell>;
};

export function SpreadsheetHeader(props: SpreadsheetHeaderProps) {
  return null;
}

export type HeaderRowProps = {
  columnVirtualizer: Virtualizer<HTMLDivElement, HTMLTableCellElement>;
  headerGroup: HeaderGroup<SpreadsheetCell>;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
};

export type HeaderCellProps = {
  header: Header<SpreadsheetCell, unknown>;
};
