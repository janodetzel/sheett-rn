import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas";
import { Store, MergeableStore, OptionalSchemas } from "tinybase/with-schemas";

// On a web client, use the browser's local storage to persist the store.
export const createClientPersister = <Schemas extends OptionalSchemas>(
  storeId: string,
  store: MergeableStore<Schemas> | Store<Schemas>,
) => createLocalPersister(store, storeId);
