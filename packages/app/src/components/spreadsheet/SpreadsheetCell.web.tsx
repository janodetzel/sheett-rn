import { CSSProperties, useCallback, useState } from "react";
import {
  useSpreadsheetCellValue,
  useLockCellCallbacks,
  rowIdColumnIdToCellId,
} from "@/src/utils/store/spreadsheet";
import { useSession } from "@/src/utils/supabase";
import { SpreadsheetCellProps } from "./SpreadsheetCell";

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
      style={{
        ...cellStyles,
        borderColor: isEditing ? "#007AFF" : "#d1d5db",
        borderWidth: isEditing ? "2px" : "1px",
        opacity: isLocked ? 0.6 : 1,
        backgroundColor: isLocked ? "#fef3c7" : "white",
      }}
      onClick={handleCellClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={inputStyles}
        />
      ) : (
        <span>{cellValue || ""}</span>
      )}
    </div>
  );
}

const cellStyles: CSSProperties = {
  width: "100%",
  height: "32px",
  padding: "4px 8px",
  border: "none",
  outline: "none",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  minHeight: "32px",
  boxSizing: "border-box",
};

const inputStyles: CSSProperties = {
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  fontSize: "13px",
  padding: "0",
  margin: "0",
  backgroundColor: "transparent",
};
