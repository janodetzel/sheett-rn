import * as UIReact from "tinybase/ui-react/with-schemas";
import {
  createMergeableStore,
  Row,
  TablesSchema,
  Value,
  ValuesSchema,
} from "tinybase/with-schemas";
import { useSession } from "../../supabase";
import { useCreateClientPersisterAndStart } from "../helpers/persistence";
import { useCreateServerSynchronizerAndStart } from "../helpers/sync";
import { useCallback } from "react";
import { useStore } from "tinybase/ui-react";

const SPREADSHEET_STORE_PREFIX = "spreadsheetStore-";

const SPREADSHEET_STORE_VALUES_SCHEMA = {
  id: { type: "string" },
  name: { type: "string" },
  description: { type: "string" },
  createdBy: { type: "string" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" },
} as const satisfies ValuesSchema;

const SPREADSHEET_STORE_TABLE_SCHEMA = {
  cells: {
    rowId: { type: "string" },
    columnId: { type: "string" },
    value: { type: "string" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },
    createdBy: { type: "string" },
  },
  collaborators: {
    role: { type: "string" },
  },
} as const satisfies TablesSchema;

type Schemas = [
  typeof SPREADSHEET_STORE_TABLE_SCHEMA,
  typeof SPREADSHEET_STORE_VALUES_SCHEMA
];

type SpreadsheetValues = typeof SPREADSHEET_STORE_VALUES_SCHEMA;

type SpreadsheetTables = typeof SPREADSHEET_STORE_TABLE_SCHEMA;
type SpreadsheetCell = SpreadsheetTables["cells"];
type SpreadsheetCollaborator = SpreadsheetTables["collaborators"];

const SPREADSHEET_COLLABORATOR_ROLES = {
  owner: "owner",
  editor: "editor",
  viewer: "viewer",
} as const satisfies Record<string, string>;

const {
  useCreateMergeableStore,
  useProvideStore,

  useValue,
  useSetValueCallback,

  useRow,
  useAddRowCallback,
  useSortedRowIds,
  useSetRowCallback,
  useDelRowCallback,

  useCell,
  useSetCellCallback,
} = UIReact as UIReact.WithSchemas<Schemas>;

const useSpreadsheetStoreId = (id: string) => SPREADSHEET_STORE_PREFIX + id;

const rowIdColumnIdToCellId = (rowId: string, columnId: string) =>
  `${rowId}-${columnId}`;

const cellIdToRowIdColumnId = (
  cellId: string
): [rowId: string, columnId: string] => {
  const [rowId, columnId] = cellId.split("-");

  if (rowId === "" || columnId === "") {
    throw new Error("Invalid cell id");
  }

  return [rowId, columnId];
};

const useSpreadsheetValue = <Key extends keyof SpreadsheetValues>(
  id: string,
  key: Key
): [
  Value<SpreadsheetValues, Key> | undefined,
  (v: Value<SpreadsheetValues, Key>) => void
] => [
  useValue(key, useSpreadsheetStoreId(id)),
  useSetValueCallback(
    key,
    (v: Value<SpreadsheetValues, Key>) => v,
    [],
    useSpreadsheetStoreId(id)
  ),
];

const useSpreadsheetCellIds = (id: string, offset?: number, limit?: number) =>
  useSortedRowIds(
    "cells",
    "rowId",
    true,
    offset,
    limit,
    useSpreadsheetStoreId(id)
  );

const useSpreadsheetCell = (
  id: string,
  cellId: string
): [
  Row<SpreadsheetTables, "cells"> | undefined,
  (row: Row<SpreadsheetTables, "cells">) => void
] => [
  useRow("cells", cellId, useSpreadsheetStoreId(id)),

  useSetRowCallback(
    "cells",
    cellId,
    (row: Row<SpreadsheetTables, "cells">) => row,
    [],
    useSpreadsheetStoreId(id)
  ),
];

const useDelSpreadsheetCellCallback = (id: string, cellId: string) =>
  useDelRowCallback("cells", cellId, useSpreadsheetStoreId(id));

const useSpreadsheetCellValue = <Key extends keyof SpreadsheetCell>(
  id: string,
  cellId: string,
  key: Key
): [
  Value<SpreadsheetCell, Key> | undefined,
  (v: Value<SpreadsheetCell, Key>) => void
] => [
  useCell("cells", cellId, key, useSpreadsheetStoreId(id)),
  useSetCellCallback(
    "cells",
    cellId,
    key,
    (v: Value<SpreadsheetCell, Key>) => v,
    [],
    useSpreadsheetStoreId(id)
  ),
];

const useSpreadsheetCollaborator = (
  id: string,
  userId: string
): [
  Row<SpreadsheetTables, "collaborators"> | undefined,
  (row: Row<SpreadsheetTables, "collaborators">) => void
] => [
  useRow("collaborators", userId, useSpreadsheetStoreId(id)),

  useSetRowCallback(
    "collaborators",
    userId,
    (row: Row<SpreadsheetTables, "collaborators">) => row,
    [],
    useSpreadsheetStoreId(id)
  ),
];

const useAddSpreadsheetCollaboratorCallback = (id: string) => {
  const storeId = useSpreadsheetStoreId(id);
  const store = useStore(storeId);

  return useCallback(
    (userId: string, role: keyof typeof SPREADSHEET_COLLABORATOR_ROLES) => {
      store?.setRow("collaborators", userId, {
        role,
      });
    },
    [store]
  );
};

const useDelSpreadsheetCollaboratorCallback = (id: string, userId: string) =>
  useDelRowCallback("collaborators", userId, useSpreadsheetStoreId(id));

const SpreadsheetStore = ({ id }: { id: string }) => {
  const storeId = useSpreadsheetStoreId(id);
  const session = useSession();

  const store = useCreateMergeableStore(() =>
    createMergeableStore().setSchema(
      SPREADSHEET_STORE_TABLE_SCHEMA,
      SPREADSHEET_STORE_VALUES_SCHEMA
    )
  );

  useCreateClientPersisterAndStart(storeId, store, () => {
    if (session?.user.id) {
      store.setRow("collaborators", session?.user.id, {
        role: SPREADSHEET_COLLABORATOR_ROLES.viewer,
      });
    }

    console.debug("[spreadsheet-store]: Client persister created and ready");
  });

  useCreateServerSynchronizerAndStart(storeId, store, () =>
    console.debug("[spreadsheet-store]: Server synchronizer created and ready")
  );

  useProvideStore(storeId, store);

  return null;
};

export {
  SpreadsheetStore,
  useSpreadsheetCellIds,
  useDelSpreadsheetCellCallback,
  useSpreadsheetCell,
  useSpreadsheetCellValue,
  useSpreadsheetValue,
  useSpreadsheetCollaborator,
  useAddSpreadsheetCollaboratorCallback,
  useDelSpreadsheetCollaboratorCallback,
  rowIdColumnIdToCellId,
  cellIdToRowIdColumnId,
};
