import { CSSProperties, useCallback, useState } from "react";
import {
  useSpreadsheetCellValue,
  useLockCellCallbacks,
  rowIdColumnIdToCellId,
} from "@/src/utils/store/spreadsheet";
import { useSession } from "@/src/utils/supabase";
import { SpreadsheetCellProps } from "./SpreadsheetCell";
import { StyleSheet } from "react-native-unistyles";
import { getWebProps } from "react-native-unistyles/web";
import { Text } from "@/src/components/ui";

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

  const handleCellClick = useCallback(() => {
    if (isLocked) return;

    lockCell();
    setIsEditing(true);
    setTempValue(cellValue || "");
  }, [isLocked, lockCell, cellValue]);

  const handleSave = useCallback(() => {
    setCellValue(tempValue);
    setIsEditing(false);
    unlockCell();
  }, [tempValue, setCellValue, unlockCell]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setTempValue("");
    unlockCell();
  }, [unlockCell]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  return (
    <div
      onClick={handleCellClick}
      {...getWebProps([
        styles.cell,
        isEditing && styles.cellEditing,
        isLocked && styles.cellLocked,
      ])}
    >
      {isEditing ? (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          {...getWebProps(styles.input)}
        />
      ) : (
        <Text numberOfLines={1} {...getWebProps(styles.cellText)}>
          {cellValue || ""}
        </Text>
      )}
    </div>
  );
}

const styles = StyleSheet.create((theme) => ({
  cell: {
    _web: {
      width: "100%",
      boxSizing: "border-box",
      height: 32,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      display: "flex",
      border: "1px solid",
      borderColor: theme.colors.border.primary,
      transition: "all 0.1s ease",
      cursor: "pointer",
    },
  },
  cellEditing: {
    _web: {
      borderWidth: 2,
      borderColor: theme.colors.accent,
    },
  },
  cellLocked: {
    _web: {
      borderWidth: 2,
      borderColor: theme.colors.status.error,
      // opacity: 0.5,
    },
  },
  input: {
    _web: {
      width: "100%",
      height: "100%",
      border: "none",
      outline: "none",
      textAlign: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      color: theme.colors.text.primary,
      fontSize: 14,
    },
  },
  cellText: {
    _web: {
      color: theme.colors.text.primary,
      fontSize: 14,
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textAlign: "center",
      justifyContent: "center",
    },
  },
}));
