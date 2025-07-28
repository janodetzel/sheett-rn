import * as UIReact from "tinybase/ui-react/with-schemas";
import { MergeableStore, OptionalSchemas } from "tinybase/with-schemas";
import { createClientPersister } from "./create-client-persister";

export const useCreateClientPersisterAndStart = <
  Schemas extends OptionalSchemas,
>(
  storeId: string,
  store: MergeableStore<Schemas>,
  callback?: () => void,
) =>
  (UIReact as UIReact.WithSchemas<Schemas>).useCreatePersister(
    store,
    // Create the persister.
    (store) => createClientPersister(storeId, store),
    [storeId],
    async (persister) => {
      // Start the persistence.
      await persister.load();
      await persister.startAutoSave();
      callback?.();
    },
    [],
  );
