import React from "react";
import { View } from "react-native";
import { Table, flexRender } from "@tanstack/react-table";
import { StyleSheet } from "react-native-unistyles";

type CellCoords = { r: number; c: number };

export type SpreadsheetBodyProps = {
  table: Table<CellCoords>;
};

export function SpreadsheetBody(props: SpreadsheetBodyProps) {
  return (
    <View style={styles.bodyContainer}>
      {props.table.getRowModel().rows.map((row) => (
        <View key={row.id} style={styles.bodyRow}>
          {row.getVisibleCells().map((cell) => (
            <View key={cell.id} style={styles.bodyCell}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  bodyContainer: {
    flex: 1,
  },
  bodyRow: {
    flexDirection: "row",
  },
  bodyCell: {
    margin: 0,
    padding: 0,
  },
}));
