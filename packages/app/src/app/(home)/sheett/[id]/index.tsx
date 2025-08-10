import {
  rowIdColumnIdToCellId,
  useSpreadsheetCellValue,
} from "@/src/utils/store/spreadsheet";
import { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useSheettRouteParams } from "./_layout";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const CELL_SIZE = 25;
const HEADER_SIZE = 40;
const ROWS = 256;
const COLS = 256;

// Generate column headers (A, B, C, ..., Z, AA, AB, ...)
const generateColumnHeaders = () => {
  const headers = [];
  for (let i = 0; i < COLS; i++) {
    let header = "";
    let num = i;
    while (num >= 0) {
      header = String.fromCharCode(65 + (num % 26)) + header;
      num = Math.floor(num / 26) - 1;
      if (num < 0) break;
    }
    headers.push(header);
  }
  return headers;
};

// Generate row headers (1, 2, 3, ..., 256)
const generateRowHeaders = () => {
  return Array.from({ length: ROWS }, (_, i) => (i + 1).toString());
};

const Row = ({ item: rowIndex }: { item: number }) => {
  const rowId = (rowIndex + 1).toString();
  // const columnHeaders = useMemo(() => generateColumnHeaders(), []);

  // const cells = columnHeaders.map((_, colIndex) => {
  //   const columnId = (colIndex + 1).toString();
  //   return rowIdColumnIdToCellId(rowId, columnId);
  // });

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.headerText}>{rowId}</Text>
      </View>
      <View style={styles.rowCells}>
        <FlatList
          horizontal
          data={Array.from({ length: COLS }, (_, i) => i)}
          renderItem={Cell}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          // style={{ flex: 1 }}
          scrollEnabled={false}
        />
        {/* {cells.map((cellId) => ( */}
        {/*   <View key={cellId} style={styles.cellContainer}> */}
        {/*     <Cell cellId={cellId} /> */}
        {/*   </View> */}
        {/* ))} */}
      </View>
    </View>
  );
};

// Cell component to handle individual cell rendering and editing
const Cell = ({ item: cellIndex }: { item: number }) => {
  const cellId = cellIndex + 1;
  // const { id: spreadsheetId } = useSheettRouteParams();
  //
  // const [cellValue, setCellValue] = useSpreadsheetCellValue(
  //   spreadsheetId,
  //   cellId.toString(),
  //   "value",
  // );

  // const [isEditing, setIsEditing] = useState(false);
  // const [editValue, setEditValue] = useState("");

  const displayValue = "";

  // const onEditComplete = () => {
  //   setCellValue(editValue);
  // };

  return (
    <TouchableOpacity style={styles.cell}>
      {false ? (
        <TextInput
          style={styles.cellText}
          value={displayValue}
          // onChangeText={setCellValue}
          // onBlur={onEditComplete}
          // onEndEditing={onEditComplete}
          autoFocus
          multiline
        />
      ) : (
        <Text style={styles.cellText} numberOfLines={1}>
          {displayValue}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function Sheett() {
  return (
    <View style={styles.container} onLayout={() => console.log("Layout")}>
      <ScrollView horizontal>
        <FlatList
          data={Array.from({ length: ROWS }, (_, i) => i)}
          renderItem={Row}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.rowsContainer}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    flexDirection: "row",
    height: HEADER_SIZE,
    zIndex: 1,
  },
  cornerCell: {
    width: HEADER_SIZE * 2,
    height: HEADER_SIZE,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  columnHeaders: {
    flex: 1,
  },
  headerContent: {
    flexDirection: "row",
  },
  columnHeaderContainer: {
    width: CELL_SIZE,
  },
  columnHeader: {
    width: CELL_SIZE,
    height: HEADER_SIZE,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContainer: {
    flex: 1,
  },
  bodyContent: {
    flexDirection: "row",
  },
  rowsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    height: CELL_SIZE,
  },
  rowHeader: {
    width: HEADER_SIZE * 2,
    height: CELL_SIZE,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border.primary,
  },
  rowCells: {
    flexDirection: "row",
  },
  cellContainer: {
    width: CELL_SIZE * 2,
  },
  cell: {
    width: CELL_SIZE * 2,
    height: CELL_SIZE,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
    justifyContent: "center",
    borderColor: theme.colors.border.primary,
  },
  selectedCell: {
    backgroundColor: "rgba(30, 184, 84, 0.1)",
    borderWidth: 2,
    borderColor: "#1EB854",
  },
  cellText: {
    fontSize: 12,
    textAlign: "left",
    color: theme.colors.text.primary,
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.colors.text.secondary,
  },
}));
