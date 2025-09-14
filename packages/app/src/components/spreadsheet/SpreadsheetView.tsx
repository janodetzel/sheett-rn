import React from "react";
import { ScrollView, View } from "react-native";
import { Table } from "@tanstack/react-table";
import { StyleSheet } from "react-native-unistyles";
import { SpreadsheetBody } from "./SpreadsheetBody";
import { SpreadsheetHeader } from "./SpreadsheetHeader";

type CellCoords = { r: number; c: number };

type SpreadsheetViewProps = {
  table: Table<CellCoords>;
};

export function SpreadsheetView(props: SpreadsheetViewProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.spreadsheetContainer}>
          <SpreadsheetHeader table={props.table} />
          <ScrollView
            style={styles.bodyScrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <SpreadsheetBody table={props.table} />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  spreadsheetContainer: {
    flex: 1,
  },
  bodyScrollView: {
    flex: 1,
  },
}));
