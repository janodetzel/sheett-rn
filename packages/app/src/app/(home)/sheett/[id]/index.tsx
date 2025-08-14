import React, {
  createContext,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import Animated, {
  interpolate,
  runOnJS,
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  useSpreadsheetCellValue,
  useLockCellCallbacks,
  rowIdColumnIdToCellId,
} from "@/src/utils/store/spreadsheet";
import { useSession } from "@/src/utils/supabase";
import { useSheettRouteParams } from "./_layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Screen from "@/src/components/ui/Screen";
import {
  KeyboardAvoidingView,
  useKeyboardState,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import SpreadsheetWebView from "@/src/components/SpreadsheetWebview";

const CELL_SIZE = 40;
const ROWS = 40;
const COLS = 26;
const HEADER_HEIGHT = CELL_SIZE;
const ROW_HEADER_WIDTH = 48;

type CellCoords = { r: number; c: number };

const Cell = React.memo(function Cell({
  spreadsheetId,
  r,
  c,
}: {
  spreadsheetId: string;
  r: number;
  c: number;
}) {
  const session = useSession();
  const currentUserId = session?.user.id ?? "";
  const { focusedCellSharedValue } = useSpreadsheetContext();
  const { theme } = useUnistyles();

  const cellId = rowIdColumnIdToCellId(String(r), String(c));

  const [cellValue] = useSpreadsheetCellValue(spreadsheetId, cellId, "value");

  const { isLocked, lockCell } = useLockCellCallbacks(
    spreadsheetId,
    currentUserId,
    cellId
  );

  const onCellFocused = useCallback(() => {
    if (isLocked) {
      return;
    }
    lockCell();
    focusedCellSharedValue.value = { r, c };
  }, [isLocked, lockCell, focusedCellSharedValue, r, c]);

  const isEditingAnimatedStyles = useAnimatedStyle(() => {
    const isEditing =
      focusedCellSharedValue.value?.r === r &&
      focusedCellSharedValue.value?.c === c;

    return {
      borderWidth: withTiming(isEditing ? 2 : 1, { duration: 200 }),
      borderColor: withTiming(
        isEditing ? theme.colors.accent : theme.colors.border.primary,
        { duration: 200 }
      ),
    };
  });

  return (
    <Pressable onPress={onCellFocused}>
      <Animated.View
        style={[
          styles.cell,
          styles.cellBorder,
          isEditingAnimatedStyles,
          isLocked ? styles.cellLockedBorder : null,
          isLocked ? styles.cellLockedOpacity : null,
        ]}
      >
        <Text style={styles.cellText}>{cellValue ?? ""}</Text>
      </Animated.View>
    </Pressable>
  );
});

export default function Sheett() {
  const { id: spreadsheetId } = useSheettRouteParams();

  return (
    <SpreadsheetProvider>
      <Screen padding="none" insets="none" scrollable={false}>
        <SheetArea spreadsheetId={spreadsheetId} />
        {/* <SpreadsheetWebView spreadsheetId={spreadsheetId} /> */}
        <BottomPane spreadsheetId={spreadsheetId} />
      </Screen>
    </SpreadsheetProvider>
  );
}

const SheetArea = ({ spreadsheetId }: { spreadsheetId: string }) => {
  const data = useMemo<CellCoords[]>(
    () =>
      Array.from({ length: ROWS * COLS }, (_, i) => ({
        r: Math.floor(i / COLS),
        c: i % COLS,
      })),
    []
  );

  const rowIndices = useMemo(
    () => Array.from({ length: ROWS }, (_, i) => i),
    []
  );
  const colIndices = useMemo(
    () => Array.from({ length: COLS }, (_, i) => i),
    []
  );

  const gridListRef = useAnimatedRef<Animated.FlatList<CellCoords>>();
  const rowHeaderListRef = useAnimatedRef<Animated.FlatList<number>>();

  const keyExtractor = useCallback(
    (item: CellCoords) => rowIdColumnIdToCellId(String(item.r), String(item.c)),
    []
  );

  const { focusedCellSharedValue } = useSpreadsheetContext();
  const { isVisible } = useKeyboardState();

  useDerivedValue(() => {
    if (focusedCellSharedValue.value && isVisible) {
      const y = focusedCellSharedValue.value.r * CELL_SIZE;
      scrollTo(gridListRef, 0, y - CELL_SIZE, true);
    }
  });

  // const onCellFocus = useCallback(
  //   (item: CellCoords) => {
  //     console.log("onCellFocus", item);
  //     // scroll to the cell

  //     setTimeout(() => {
  //       gridListRef.current?.scrollToOffset({
  //         offset: item.r * CELL_SIZE - CELL_SIZE,
  //         animated: true,
  //       });
  //     }, 1000);
  //   },
  //   [gridListRef]
  // );

  const renderItem = useCallback(
    ({ item }: { item: CellCoords }) => (
      <Cell
        spreadsheetId={spreadsheetId}
        r={item.r}
        c={item.c}
        // onFocus={() => onCellFocus(item)}
      />
    ),
    [spreadsheetId]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<CellCoords> | null | undefined, index: number) => {
      const rowIndex = Math.floor(index / COLS);
      return {
        length: CELL_SIZE,
        offset: rowIndex * CELL_SIZE,
        index,
      };
    },
    []
  );

  const onGridScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      scrollTo(rowHeaderListRef, 0, y, false);
    },
  });

  const getColumnLabel = useCallback((index: number) => {
    let n = index;
    let label = "";
    while (n >= 0) {
      label = String.fromCharCode((n % 26) + 65) + label;
      n = Math.floor(n / 26) - 1;
    }
    return label;
  }, []);

  return (
    <View style={styles.sheetArea}>
      {/* Left sticky column */}
      <View style={styles.leftPane}>
        <View style={[styles.cornerCell, styles.headerCellBorder]}>
          <Text style={styles.headerText}>#</Text>
        </View>
        <Animated.FlatList
          ref={rowHeaderListRef}
          data={rowIndices}
          keyExtractor={(i) => `row-${i}`}
          renderItem={({ item: r }) => (
            <View style={[styles.rowHeaderCell, styles.headerCellBorder]}>
              <Text style={styles.headerText}>{r + 1}</Text>
            </View>
          )}
          getItemLayout={(_, index) => ({
            length: CELL_SIZE,
            offset: index * CELL_SIZE,
            index,
          })}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          scrollToOverflowEnabled={true}
          keyboardDismissMode="none"
        />
      </View>

      {/* Right scrollable area */}
      <View style={styles.rightPane}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {/* Column headers */}
            <View style={styles.columnHeaderRow}>
              {colIndices.map((c) => (
                <View
                  key={`col-${c}`}
                  style={[styles.columnHeaderCell, styles.headerCellBorder]}
                >
                  <Text style={styles.headerText}>{getColumnLabel(c)}</Text>
                </View>
              ))}
            </View>

            {/* Grid */}
            <Animated.FlatList
              bounces={true}
              ref={gridListRef}
              data={data}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              numColumns={COLS}
              windowSize={9}
              maxToRenderPerBatch={90}
              initialNumToRender={120}
              updateCellsBatchingPeriod={16}
              removeClippedSubviews
              getItemLayout={getItemLayout}
              showsVerticalScrollIndicator={false}
              onScroll={onGridScroll}
              scrollEventThrottle={16}
              contentContainerStyle={styles.grid}
              style={{ width: COLS * CELL_SIZE * 2 }}
              keyboardDismissMode="none"
              keyboardShouldPersistTaps="handled"
              // automaticallyAdjustKeyboardInsets={true}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const BottomPane = ({ spreadsheetId }: { spreadsheetId: string }) => {
  const textInputRef = useRef<TextInput>(null);
  const { focusedCellSharedValue } = useSpreadsheetContext();
  const [focusedCell, setFocusedCell] = useState<CellCoords | null>(null);
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();

  const cellId = rowIdColumnIdToCellId(
    String(focusedCell?.r ?? 0),
    String(focusedCell?.c ?? 0)
  );

  const [cellValue, setCellValue] = useSpreadsheetCellValue(
    spreadsheetId,
    cellId,
    "value"
  );

  useEffect(() => {
    if (focusedCell) {
      textInputRef.current?.focus();
    }
  }, [focusedCell]);

  useDerivedValue(() => {
    runOnJS(setFocusedCell)(focusedCellSharedValue.value ?? null);
  });

  const onChangeText = useCallback(
    (text: string) => {
      if (focusedCell) {
        setCellValue(text);
      }
    },
    [focusedCell, setCellValue]
  );

  const onBlur = useCallback(() => {
    setFocusedCell(null);
    focusedCellSharedValue.value = null;
  }, [focusedCellSharedValue]);

  const { progress } = useReanimatedKeyboardAnimation();

  const animatedBottomInsetStyles = useAnimatedStyle(() => {
    return {
      paddingBottom: interpolate(progress.value, [0, 1], [insets.bottom, 0]),
    };
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View style={[styles.bottomPane, animatedBottomInsetStyles]}>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <View style={styles.textInputContainer}>
              <TextInput
                ref={textInputRef}
                style={styles.textInput}
                placeholder={""}
                placeholderTextColor={theme.colors.text.secondary}
                value={cellValue ?? ""}
                onChangeText={onChangeText}
                onBlur={onBlur}
                multiline={false}
                textAlignVertical="center"
                autoCapitalize="none"
                autoCorrect={true}
                keyboardType="default"
                returnKeyType="done"
                maxLength={1000}
                editable={!!focusedCell}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const SpreadsheetContext = createContext<{
  focusedCellSharedValue: SharedValue<CellCoords | null>;
} | null>(null);

const useSpreadsheetContext = () => {
  const context = useContext(SpreadsheetContext);
  if (!context) {
    throw new Error(
      "useSpreadsheetContext must be used within a SpreadsheetContext"
    );
  }
  return context;
};

function SpreadsheetProvider({ children }: { children: React.ReactNode }) {
  const focusedCellSharedValue = useSharedValue<CellCoords | null>(null);

  return (
    <SpreadsheetContext.Provider value={{ focusedCellSharedValue }}>
      {children}
    </SpreadsheetContext.Provider>
  );
}

const styles = StyleSheet.create((theme) => ({
  sheetArea: {
    flex: 1,
    flexDirection: "row",
  },
  leftPane: {
    width: ROW_HEADER_WIDTH,
  },
  rightPane: {
    flex: 1,
  },
  grid: {
    backgroundColor: theme.colors.background,
  },
  cornerCell: {
    width: ROW_HEADER_WIDTH,
    height: HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  rowHeaderCell: {
    width: ROW_HEADER_WIDTH,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  columnHeaderRow: {
    flexDirection: "row",
  },
  columnHeaderCell: {
    width: CELL_SIZE * 2,
    height: HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  cell: {
    width: CELL_SIZE * 2,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  cellBorder: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  cellEditingBorder: {
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  cellLockedBorder: {
    borderWidth: 2,
    borderColor: theme.colors.status.error,
  },
  cellLockedOpacity: {
    opacity: 0.5,
  },
  headerCellBorder: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  headerText: {
    color: theme.colors.text.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  cellText: {
    color: theme.colors.text.primary,
    fontSize: 13,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  cellPressable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cellInput: {
    color: theme.colors.text.primary,
    fontSize: 13,
    textAlign: "center",
    paddingVertical: theme.gap(0.5),
    paddingHorizontal: theme.gap(0.25),
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "100%",
    height: "100%",
  },
  bottomPane: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  inputContainer: {
    paddingHorizontal: theme.gap(1),
    paddingTop: theme.gap(1),
    paddingBottom: theme.gap(1),
  },
  inputRow: {
    flexDirection: "row",
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    paddingHorizontal: theme.gap(2),
    paddingVertical: theme.gap(0.5),
    minHeight: 40,
    maxHeight: 120,
  },
  textInput: {
    color: theme.colors.text.primary,
    fontSize: 16,
    lineHeight: 20,
    minHeight: 28,
    maxHeight: 100,
    paddingVertical: 0,
    margin: 0,
  },
}));
