import React, { useCallback, useState } from "react";
import { View, TouchableOpacity, Alert, TextInput } from "react-native";
import {
  useSpreadsheetCellValue,
  useLockCellCallbacks,
  rowIdColumnIdToCellId,
} from "@/src/utils/store/spreadsheet";
import { useSession } from "@/src/utils/supabase";
import { StyleSheet } from "react-native-unistyles";
import { Text } from "@/src/components/ui";

export type SpreadsheetCellProps = {
  spreadsheetId: string;
  rowId: number;
  colId: number;
};

export function SpreadsheetCell(props: SpreadsheetCellProps) {
  const session = useSession();
  const currentUserId = session?.user.id ?? "";
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState("");

  const cellId = rowIdColumnIdToCellId(
    String(props.rowId),
    String(props.colId)
  );
  const [cellValue, setCellValue] = useSpreadsheetCellValue(
    props.spreadsheetId,
    cellId,
    "value"
  );
  const { isLocked, lockCell, unlockCell } = useLockCellCallbacks(
    props.spreadsheetId,
    currentUserId,
    cellId
  );

  const handleCellPress = useCallback(() => {
    if (isLocked) {
      Alert.alert(
        "Cell Locked",
        "This cell is currently being edited by another user."
      );
      return;
    }

    lockCell();
    setIsEditing(true);
    setTempValue(cellValue || "");
  }, [isLocked, lockCell, cellValue]);

  const handleSave = useCallback(() => {
    setCellValue(tempValue);
    setIsEditing(false);
    unlockCell();
  }, [tempValue, setCellValue, unlockCell]);

  const handleSubmitEditing = useCallback(() => {
    handleSave();
  }, [handleSave]);

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        isEditing && styles.cellEditing,
        isLocked && styles.cellLocked,
      ]}
      onPress={handleCellPress}
      disabled={isEditing}
      activeOpacity={0.7}
    >
      <View style={styles.cellContent}>
        {isEditing ? (
          <TextInput
            value={tempValue}
            onChangeText={setTempValue}
            onBlur={handleSave}
            onSubmitEditing={handleSubmitEditing}
            autoFocus
            textAlign="center"
            returnKeyType="done"
            style={styles.input}
          />
        ) : (
          <Text
            numberOfLines={1}
            style={styles.cellText}
            variant="bodySmall"
            align="center"
          >
            {cellValue || ""}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  cell: {
    width: 100,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    margin: 0,
    padding: 0,
  },
  cellEditing: {
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  cellLocked: {
    borderWidth: 2,
    borderColor: theme.colors.status.error,
  },
  cellContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  input: {
    height: "100%",
    width: "100%",
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 4,
    margin: 0,
  },
  cellText: {
    fontSize: 14,
    textAlign: "center",
  },
}));
