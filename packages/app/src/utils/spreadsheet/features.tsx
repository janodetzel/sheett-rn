// import {
//   functionalUpdate,
//   makeStateUpdater,
//   OnChangeFn,
//   RowData,
//   Table,
//   TableFeature,
//   Updater,
// } from "@tanstack/react-table";
// import { CellCoords } from "./utils";

// export type SelectedCellState = CellCoords | null;
// export interface SelectedCellTableState {
//   selectedCell: SelectedCellState;
// }

// // define types for our new feature's table options
// export interface SelectedCellOptions {
//   enableSelectedCellFeature?: boolean;
//   onSelectedCellChange?: OnChangeFn<SelectedCellState>;
// }

// // Define types for our new feature's table APIs
// export interface SelectedCellInstance {
//   setSelectedCell: (updater: Updater<SelectedCellState>) => void;
// }

// // Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
// declare module "@tanstack/react-table" {
//   // or whatever framework adapter you are using
//   //merge our new feature's state with the existing table state
//   interface TableState extends SelectedCellTableState {}
//   //merge our new feature's options with the existing table options
//   interface TableOptionsResolved<TData extends RowData>
//     extends SelectedCellOptions {}
//   //merge our new feature's instance APIs with the existing table instance APIs
//   interface Table<TData extends RowData> extends SelectedCellInstance {}
//   // if you need to add cell instance APIs...
//   // interface Cell<TData extends RowData, TValue> extends DensityCell
//   // if you need to add row instance APIs...
//   // interface Row<TData extends RowData> extends DensityRow
//   // if you need to add column instance APIs...
//   // interface Column<TData extends RowData, TValue> extends DensityColumn
//   // if you need to add header instance APIs...
//   // interface Header<TData extends RowData, TValue> extends DensityHeader

//   // Note: declaration merging on `ColumnDef` is not possible because it is a complex type, not an interface.
//   // But you can still use declaration merging on `ColumnDef.meta`
// }

// export const selectedCellFeature: TableFeature<any> = {
//   // define the new feature's initial state
//   getInitialState: (state): SelectedCellTableState => {
//     return {
//       ...state,
//       selectedCell: null,
//     };
//   },

//   // define the new feature's default options
//   getDefaultOptions: <TData extends RowData>(
//     table: Table<TData>
//   ): SelectedCellOptions => {
//     return {
//       enableSelectedCellFeature: true,
//       onSelectedCellChange: makeStateUpdater("selectedCell", table),
//     } as SelectedCellOptions;
//   },

//   // define the new feature's table instance methods
//   createTable: <TData extends RowData>(table: Table<TData>): void => {
//     table.setSelectedCell = (updater) => {
//       const safeUpdater: Updater<SelectedCellState> = (old) => {
//         let newState = functionalUpdate(updater, old);
//         return newState;
//       };
//       return table.options.onSelectedCellChange?.(safeUpdater);
//     };
//   },
// };
