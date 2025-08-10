import { useEvent } from "expo";
import ExpoSpreadsheet, {
  CellRecord,
  ExpoSpreadsheetView,
} from "expo-spreadsheet";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function App() {
  const onChangePayload = useEvent(ExpoSpreadsheet, "onChange");

  const rows = 2000;
  const columns = 1000;

  const initialValue = [
    {
      rowId: "0",
      columnId: "0",
      value: "A1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "example",
    },
    {
      rowId: "1",
      columnId: "2",
      value: "C2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "example",
    },
  ];

  const [value, setValue] = useState<CellRecord[]>(initialValue);

  return (
    <SafeAreaView style={styles.container}>
      <ExpoSpreadsheetView
        rows={rows}
        columns={columns}
        cellWidth={100}
        cellHeight={40}
        value={value}
        showHeaders={true}
        infiniteScrollHorizontal={false}
        infiniteScrollVertical={false}
        gridStyle={{ color: "#E0E0E0", width: 5 }}
        intercellSpacing={{ width: 1, height: 1 }}
        headerStyle={{
          backgroundColor: "#FAFAFA",
          textColor: "#666",
          fontSize: 12,
        }}
        cellStyle={{
          backgroundColor: "#FFFFFF",
          textColor: "#111",
          fontSize: 13,
        }}
        onCellEdited={({ nativeEvent }) => {
          console.log("Cell edited", nativeEvent.cellId, nativeEvent.value);
          setValue(
            value.map((cell) =>
              cell.rowId === nativeEvent.cellId
                ? { ...cell, value: nativeEvent.value }
                : cell
            )
          );
        }}
        style={styles.view}
      />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    paddingTop: 60,
  },
};
