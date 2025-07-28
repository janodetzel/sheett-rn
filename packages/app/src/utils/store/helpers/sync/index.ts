import env from "@/src/utils/environment";
import ReconnectingWebSocket from "reconnecting-websocket";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { MergeableStore, OptionalSchemas } from "tinybase/with-schemas";

export const useCreateServerSynchronizerAndStart = <
  Schemas extends OptionalSchemas,
>(
  storeId: string,
  store: MergeableStore<Schemas>,
  callback?: () => void,
) =>
  (UiReact as UiReact.WithSchemas<Schemas>).useCreateSynchronizer(
    store,
    async (store: MergeableStore<Schemas>) => {
      // Create the synchronizer.
      const synchronizer = await createWsSynchronizer(
        store,

        // @ts-ignore WebSocket.ping() method is not available on ReconnectingWebSocket
        new ReconnectingWebSocket(
          `${env.EXPO_PUBLIC_CF_DO_WS_URL}/${storeId}`,
          [],
          {
            maxReconnectionDelay: 1000,
            connectionTimeout: 1000,
          },
        ),
      );

      // Start the synchronizer.
      await synchronizer.startSync();

      synchronizer.getWebSocket();

      // If the websocket reconnects in the future, do another explicit sync.
      synchronizer.getWebSocket().addEventListener("open", () => {
        synchronizer.load().then(() => synchronizer.save());
      });

      callback?.();

      return synchronizer;
    },
    [storeId],
  );
