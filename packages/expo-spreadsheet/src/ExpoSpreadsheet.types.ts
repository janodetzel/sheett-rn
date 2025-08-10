import type { StyleProp, ViewStyle } from "react-native";

export type CellRecord = {
  rowId: string;
  columnId: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type OnCellEditedEventPayload = {
  cellId: string;
  value: string;
};

export type ExpoSpreadsheetModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type GridStyle = {
  color?: string; // hex or rgba string
  width?: number;
};

export type IntercellSpacing = {
  width?: number;
  height?: number;
};

export type HeaderStyle = {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
};

export type CellStyle = {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
};

export type ExpoSpreadsheetViewProps = {
  rows: number;
  columns: number;
  cellWidth: number;
  cellHeight: number;
  value: CellRecord[];
  showHeaders?: boolean;
  infiniteScrollHorizontal?: boolean;
  infiniteScrollVertical?: boolean;
  gridStyle?: GridStyle;
  intercellSpacing?: IntercellSpacing;
  headerStyle?: HeaderStyle;
  cellStyle?: CellStyle;
  onCellEdited?: (event: { nativeEvent: OnCellEditedEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
