import { flexRender } from "@tanstack/react-table";
import { SpreadsheetHeaderProps } from "./SpreadsheetHeader";
import { getWebProps } from "react-native-unistyles/web";
import { StyleSheet } from "react-native-unistyles";

export function SpreadsheetHeader(props: SpreadsheetHeaderProps) {
  return (
    <thead>
      {props.table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id} {...getWebProps(styles.headerCell)}>
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

const styles = StyleSheet.create((theme) => ({
  headerCell: {
    _web: {
      boxSizing: "border-box",
      height: 32,
      minWidth: 100,
      backgroundColor: theme.colors.background,
      color: theme.colors.text.primary,
      border: `1px double ${theme.colors.border.primary}`,
      textAlign: "center",
      verticalAlign: "middle",
      fontWeight: "bold",
      fontSize: "14px",
      fontFamily: theme.fontFamily.sans,
    },
  },
}));
