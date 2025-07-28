import * as SQLite from "expo-sqlite";
import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite/with-schemas";
import { Store, MergeableStore, OptionalSchemas } from "tinybase/with-schemas";

// On a mobile client, use Expo's SQLite API to persist the store.
export const createClientPersister = <Schemas extends OptionalSchemas>(
  storeId: string,
  store: MergeableStore<Schemas> | Store<Schemas>,
) => createExpoSqlitePersister(store, SQLite.openDatabaseSync(storeId + ".db"));
