import { NoValuesSchema } from "tinybase/store";
import * as UIReact from "tinybase/ui-react/with-schemas";
import { createMergeableStore, TablesSchema } from "tinybase/with-schemas";
import { useSession } from "../../supabase";
import { useCreateClientPersisterAndStart } from "../helpers/persistence";
import { useCreateServerSynchronizerAndStart } from "../helpers/sync";
import { useCallback } from "react";
import { nanoid } from "nanoid";

const USER_STORE_PREFIX = "userStore-";

const USER_STORE_TABLE_SCHEMA = {
  spreadsheets: {
    id: { type: "string" },
  },
} as const satisfies TablesSchema;

const {
  useCreateMergeableStore,
  useDelRowCallback,
  useProvideStore,
  useRowIds,
  useStore,
} = UIReact as UIReact.WithSchemas<
  [typeof USER_STORE_TABLE_SCHEMA, NoValuesSchema]
>;

const useUserStoreId = () => {
  const session = useSession();

  if (!session) {
    throw new Error("User not authenticated. Cannot generate userStoreId");
  }

  return USER_STORE_PREFIX + session.user.id;
};

const useSpreadsheetIds = () => useRowIds("spreadsheets", useUserStoreId());

const useAddSpreadsheetCallback = () => {
  const storeId = useUserStoreId();
  const store = useStore(storeId);

  return useCallback(() => {
    const id = nanoid();

    store?.setRow("spreadsheets", id, {
      id,
    });

    return id;
  }, [store]);
};

const useJoinSpreadsheetCallback = () => {
  const storeId = useUserStoreId();
  const store = useStore(storeId);

  return useCallback(
    (id: string) => {
      store?.setRow("spreadsheets", id, {
        id,
      });

      return id;
    },
    [store],
  );
};

const useDelSpreadsheetCallback = (id: string) =>
  useDelRowCallback("spreadsheets", id, useUserStoreId());

const UserStore = () => {
  const storeId = useUserStoreId();

  const store = useCreateMergeableStore(() =>
    createMergeableStore().setTablesSchema(USER_STORE_TABLE_SCHEMA),
  );

  useCreateClientPersisterAndStart(storeId, store, () =>
    console.debug(
      "[user-store]: User store client persister created and ready",
    ),
  );

  useCreateServerSynchronizerAndStart(storeId, store, () =>
    console.debug("[user-store]: Server syncronizer created and ready"),
  );

  useProvideStore(storeId, store);
};

export {
  UserStore,
  useSpreadsheetIds,
  useAddSpreadsheetCallback,
  useJoinSpreadsheetCallback,
  useDelSpreadsheetCallback,
};
