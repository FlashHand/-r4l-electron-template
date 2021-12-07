import Dexie, { Table } from 'dexie'
import logger from '@/shared/logger'

class Database extends Dexie {
	protected constructor(dbName: string, init: (dexie: Dexie) => void) {
		super(dbName)
		init(this)
		this.open()
			.then(r => {
				logger.info(`${dbName} db opened`)
			})
			.catch(err => {
				logger.error(`${dbName} open failed: `, err)
			})
	}
}

class TokensDB extends Database {
	public readonly tokens!: Table<Entities.Tokens, number>
	constructor() {
		super('tokens', (dexie: Dexie) => {
			dexie.version(1).stores({
				tokens: '++id, &certificate, &token, ymbb, ssq, url'
			})
		})
	}

}

export const tokens = new TokensDB().tokens
