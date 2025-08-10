import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { CellRecord, ExpoSpreadsheetView } from "expo-spreadsheet";
import {
  cellIdToRowIdColumnId,
  SpreadsheetStore,
  SpreadsheetTables,
  useGetSpreadsheetCellCallback,
  useSetSpreadsheetCellCallback,
  useSpreadsheetCellIds,
} from "@/src/utils/store/spreadsheet";
import { useSheettRouteParams } from "./_layout";
import { Row } from "tinybase/with-schemas";

const CELL_SIZE = 25;
const ROWS = 20;
const COLS = 10;

export default function Sheett() {
  const { id: spreadsheetId } = useSheettRouteParams();

  // Subscribe to row id changes (adds/removes). Values are read imperatively below.
  const cellIds = useSpreadsheetCellIds(spreadsheetId);

  const getCell = useGetSpreadsheetCellCallback(spreadsheetId);
  const setCell = useSetSpreadsheetCellCallback(spreadsheetId);

  const value = useMemo(() => {
    const rows: Partial<CellRecord>[] = [];
    for (const cellId of cellIds) {
      const row = getCell(cellId);

      if (!row) continue;

      if (!row.rowId || !row.columnId || !row.value) continue;

      rows.push({
        rowId: row.rowId,
        columnId: row.columnId,
        value: row.value,
      });
    }
    return rows;
  }, [getCell, cellIds]);

  const handleCellEdited = useCallback(
    (event: { nativeEvent: { cellId: string; value: string } }) => {
      console.log("handleCellEdited", event.nativeEvent.cellId);
      const { cellId, value } = event.nativeEvent;
      const [rowId, columnId] = cellIdToRowIdColumnId(cellId);

      setCell(rowId, {
        rowId,
        columnId,
        value,
      });
    },
    [setCell]
  );

  return (
    <View style={styles.container}>
      <SpreadsheetStore id={spreadsheetId} />
      <ExpoSpreadsheetView
        rows={ROWS}
        columns={COLS}
        cellWidth={CELL_SIZE * 2}
        cellHeight={CELL_SIZE}
        gridStyle={styles.grid}
        intercellSpacing={styles.intercellSpacing}
        headerStyle={styles.headerStyle}
        cellStyle={styles.cellStyle}
        // showHeaders={true}
        value={value}
        onCellEdited={handleCellEdited}
        style={styles.view}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  view: {
    flex: 1,
  },
  grid: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
    borderColor: theme.colors.text.primary,
    width: 1,
  },
  intercellSpacing: {
    width: 1,
    height: 1,
  },
  headerStyle: {
    backgroundColor: theme.colors.background,
    textColor: theme.colors.text.primary,
    fontSize: 12,
  },
  cellStyle: {
    backgroundColor: theme.colors.background,
    textColor: theme.colors.text.primary,
    fontSize: 13,
  },
}));
