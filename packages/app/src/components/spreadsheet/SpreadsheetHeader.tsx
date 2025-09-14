import React from "react";
import { View } from "react-native";
import { Table, flexRender } from "@tanstack/react-table";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "@/src/components/ui";

type CellCoords = { r: number; c: number };

export type SpreadsheetHeaderProps = {
  table: Table<CellCoords>;
};

export function SpreadsheetHeader(props: SpreadsheetHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      {props.table.getHeaderGroups().map((headerGroup) => (
        <View key={headerGroup.id} style={styles.headerRow}>
          {headerGroup.headers.map((header) => (
            <View key={header.id} style={styles.headerCell}>
              {header.isPlaceholder ? null : (
                <Text
                  variant="label"
                  weight="bold"
                  align="center"
                  style={styles.headerText}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  headerContainer: {
    backgroundColor: theme.colors.surface,
  },
  headerRow: {
    flexDirection: "row",
  },
  headerCell: {
    width: 100,
    height: 32,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 12,
    textAlign: "center",
  },
}));
