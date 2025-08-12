import React, { useCallback, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import {
  SpreadsheetStore,
  useSpreadsheetCell,
  rowIdColumnIdToCellId,
} from "@/src/utils/store/spreadsheet";
import { useSheettRouteParams } from "./_layout";
import { SafeAreaView } from "react-native-safe-area-context";

const CELL_SIZE = 40;
const ROWS = 100;
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
  const cellId = useMemo(
    () => rowIdColumnIdToCellId(String(r), String(c)),
    [r, c]
  );

  const [cell] = useSpreadsheetCell(spreadsheetId, cellId);

  return (
    <View style={[styles.cell, styles.cellBorder]}>
      <Text style={styles.cellText}>{cell?.value ?? ""}</Text>
    </View>
  );
});

export default function Sheett() {
  const { id: spreadsheetId } = useSheettRouteParams();

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

  const renderItem = useCallback(
    ({ item }: { item: CellCoords }) => (
      <Cell spreadsheetId={spreadsheetId} r={item.r} c={item.c} />
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
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <SpreadsheetStore id={spreadsheetId} />
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
          />
        </View>

        {/* Right scrollable area */}
        <View style={styles.rightPane}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
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
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
  },
}));
