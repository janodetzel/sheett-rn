import { createMergeableStore } from 'tinybase';
import { createDurableObjectSqlStoragePersister } from 'tinybase/persisters/persister-durable-object-sql-storage';
import { getWsServerDurableObjectFetch, WsServerDurableObject } from 'tinybase/synchronizers/synchronizer-ws-server-durable-object';

export class SheettDurableObject extends WsServerDurableObject<Env> {
	createPersister() {
		return createDurableObjectSqlStoragePersister(createMergeableStore(), this.ctx.storage.sql);
	}
}

export default {
	fetch: getWsServerDurableObjectFetch('SHEETT_DURABLE_OBJECT'),
};
